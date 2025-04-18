
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
        onCreate={handleCreate} 
      />
      
      {editingRequest && (
        <EditCollaborationDialog 
          isOpen={!!editingRequest} 
          onClose={() => setEditingRequest(null)} 
          onUpdate={handleUpdate} 
          collaborationRequest={editingRequest} 
        />
      )}
      
      {deletingRequest && (
        <DeleteCollaborationDialog 
          isOpen={!!deletingRequest} 
          onClose={() => setDeletingRequest(null)} 
          onDelete={() => handleDelete(deletingRequest.id)} 
          collaborationRequest={deletingRequest} 
        />
      )}
    </div>
  );
};
