'use client';

import type { UserPool } from '@/models/Schema';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deletePool } from '@/app/actions/pools.actions';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/useToast';

type DeletePoolButtonProps = {
  pool: UserPool;
};

export const DeletePoolButton = ({ pool }: DeletePoolButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { addToast } = useToast();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deletePool(pool.id);
        addToast({
          message: `Pool "${pool.poolName}" deleted successfully`,
          type: 'success',
          duration: 5000,
        });
        handleCloseModal();
        router.push('/dashboard');
      } catch (error) {
        console.error('Error deleting pool:', error);
        addToast({
          message: error instanceof Error ? error.message : 'Failed to delete pool. Please try again.',
          type: 'error',
          duration: 5000,
        });
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
        aria-label="Delete pool"
      >
        Delete Pool
      </button>
      <Modal isOpen={isModalOpen} closeAction={handleCloseModal} title="Delete Pool" size="md">
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete
            {' '}
            <span className="font-semibold text-gray-900">{pool.poolName}</span>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1"
            >
              {isPending ? 'Deleting...' : 'Delete Pool'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
