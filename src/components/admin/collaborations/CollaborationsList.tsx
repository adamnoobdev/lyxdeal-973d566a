
import { useState } from 'react';
import { useCollaborationsList } from './list/useCollaborationsList';
import { CollaborationsLoadingSkeleton } from './CollaborationsLoadingSkeleton';
import { CollaborationsTable } from './CollaborationsTable';
import { CreateCollaborationDialog } from './CreateCollaborationDialog';
import { EditCollaborationDialog } from './EditCollaborationDialog';
import { DeleteCollaborationDialog } from './DeleteCollaborationDialog';
import { ListHeader } from './list/ListHeader';
import { EmptyState } from './list/EmptyState';
import { ErrorDisplay } from './list/ErrorDisplay';
import { CollaborationRequest } from '@/types/collaboration';

export const CollaborationsList = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingRequest, setEditingRequest] = useState<CollaborationRequest | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<CollaborationRequest | null>(null);

  const {
    collaborationRequests,
    isLoading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    refetch
  } = useCollaborationsList();

  if (isLoading) {
    return <CollaborationsLoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  return (
    <div>
      <ListHeader 
        onRefresh={refetch}
        onCreateClick={() => setIsCreating(true)}
      />

      {collaborationRequests.length === 0 ? (
        <EmptyState onCreateClick={() => setIsCreating(true)} />
      ) : (
        <CollaborationsTable
          collaborationRequests={collaborationRequests}
          onEdit={setEditingRequest}
          onDelete={setDeletingRequest}
        />
      )}

      <CreateCollaborationDialog 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        onCreate={async (values) => {
          const result = await handleCreate(values);
          if (result) setIsCreating(false);
        }} 
      />
      
      {editingRequest && (
        <EditCollaborationDialog 
          isOpen={!!editingRequest} 
          onClose={() => setEditingRequest(null)} 
          onUpdate={async (values, id) => {
            const result = await handleUpdate(values, id);
            if (result) setEditingRequest(null);
          }} 
          collaborationRequest={editingRequest} 
        />
      )}
      
      {deletingRequest && (
        <DeleteCollaborationDialog 
          isOpen={!!deletingRequest} 
          onClose={() => setDeletingRequest(null)} 
          onDelete={async () => {
            await handleDelete(deletingRequest.id);
            setDeletingRequest(null);
          }} 
          collaborationRequest={deletingRequest} 
        />
      )}
    </div>
  );
};
