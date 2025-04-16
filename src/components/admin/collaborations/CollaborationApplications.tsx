
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CollaborationApplication } from '@/types/collaboration';
import { ApplicationsTable } from './ApplicationsTable';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';

export const CollaborationApplications = () => {
  const [applications, setApplications] = useState<CollaborationApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('collaboration_applications')
        .select(`
          *,
          creator:creator_id(email),
          collaboration:collaboration_id(
            title, 
            salon_id(name),
            deal_id(title)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const formattedApplications = data.map(app => ({
        ...app,
        creator_email: app.creator?.email || 'Unknown',
        collaboration_title: app.collaboration?.title || 'Unknown',
        salon_name: app.collaboration?.salon_id?.name || 'Unknown',
        deal_title: app.collaboration?.deal_id?.title || 'Unknown'
      })) as CollaborationApplication[];

      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Ett fel uppstod vid hämtning av ansökningar');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (applicationId: string, collaborationId: string, creatorId: string) => {
    try {
      // Step 1: Get salon_id and deal_id from collaboration request
      const { data: collaborationData, error: collaborationError } = await supabase
        .from('collaboration_requests')
        .select('salon_id, deal_id')
        .eq('id', collaborationId)
        .single();
        
      if (collaborationError) throw collaborationError;
      
      // Step 2: Generate discount code
      const { data: creatorData, error: creatorError } = await supabase
        .from('creator_applications') 
        .select('instagram_handle')
        .eq('email', (await supabase.auth.getUser(creatorId)).data.user?.email)
        .single();
        
      if (creatorError) {
        console.error("Error fetching creator data:", creatorError);
        // Fallback if we can't get Instagram handle
        const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const discountCode = `CREATOR${randomCode}`;
        
        // Create active collaboration
        const { data, error } = await supabase
          .from('active_collaborations')
          .insert({
            collaboration_id: collaborationId,
            creator_id: creatorId,
            salon_id: collaborationData.salon_id,
            deal_id: collaborationData.deal_id,
            discount_code: discountCode
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Update application status
        await supabase
          .from('collaboration_applications')
          .update({ status: 'approved' })
          .eq('id', applicationId);
          
        toast.success('Ansökan godkänd och samarbete skapat');
        fetchApplications();
        return;
      }
      
      // Generate code from Instagram handle if available
      const instagramHandle = creatorData.instagram_handle;
      const { data: discountCodeData } = await supabase.rpc(
        'generate_collaboration_discount_code', 
        { creator_handle: instagramHandle }
      );
      
      const discountCode = discountCodeData || `CREATOR${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      // Create active collaboration
      const { data, error } = await supabase
        .from('active_collaborations')
        .insert({
          collaboration_id: collaborationId,
          creator_id: creatorId,
          salon_id: collaborationData.salon_id,
          deal_id: collaborationData.deal_id,
          discount_code: discountCode
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update application status
      await supabase
        .from('collaboration_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);
        
      toast.success('Ansökan godkänd och samarbete skapat');
      fetchApplications();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await supabase
        .from('collaboration_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);
        
      toast.success('Ansökan avvisad');
      fetchApplications();
    } catch (error: any) {
      toast.error(`Ett fel uppstod: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Kreatörsansökningar</h2>
      </div>

      {isLoading ? (
        <CollaborationsLoadingSkeleton />
      ) : (
        <ApplicationsTable
          applications={applications}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};
