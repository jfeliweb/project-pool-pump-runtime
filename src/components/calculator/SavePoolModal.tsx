'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

type SavePoolModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (poolName: string) => Promise<void>;
  defaultName: string;
  isSaving?: boolean;
};

type SavePoolFormProps = {
  defaultName: string;
  onSave: (poolName: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
};

const SavePoolForm = ({ defaultName, onSave, onCancel, isSaving }: SavePoolFormProps) => {
  const [poolName, setPoolName] = useState(defaultName);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate pool name
    const trimmedName = poolName.trim();
    if (!trimmedName) {
      setError('Pool name is required');
      return;
    }

    if (trimmedName.length > 100) {
      setError('Pool name must be 100 characters or less');
      return;
    }

    try {
      await onSave(trimmedName);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save pool');
    }
  };

  const handleCancel = () => {
    setError('');
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="pool-name"
        label="Pool Name"
        type="text"
        value={poolName}
        onChange={(e) => {
          setPoolName(e.target.value);
          setError('');
        }}
        placeholder="My Pool"
        maxLength={100}
        error={error}
        disabled={isSaving}
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleCancel}
          disabled={isSaving}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSaving || !poolName.trim()}
          className="flex-1"
        >
          {isSaving ? 'Saving...' : 'Save Pool'}
        </Button>
      </div>
    </form>
  );
};

export const SavePoolModal = ({
  isOpen,
  onClose,
  onSave,
  defaultName,
  isSaving = false,
}: SavePoolModalProps) => {
  // Use key prop to reset form state when modal opens or defaultName changes
  const formKey = isOpen ? `save-pool-${defaultName}` : 'save-pool-closed';

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} closeAction={handleCancel} title="Save Pool" size="md">
      <SavePoolForm
        key={formKey}
        defaultName={defaultName}
        onSave={onSave}
        onCancel={handleCancel}
        isSaving={isSaving}
      />
    </Modal>
  );
};
