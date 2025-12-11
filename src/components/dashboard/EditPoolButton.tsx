'use client';

import type { UserPool } from '@/models/Schema';
import { useState } from 'react';
import { EditPoolModal } from './EditPoolModal';

type EditPoolButtonProps = {
  pool: UserPool;
};

export function EditPoolButton({ pool }: EditPoolButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        aria-label="Edit pool"
      >
        Edit Pool
      </button>
      <EditPoolModal
        isOpen={isModalOpen}
        onCloseAction={handleCloseModal}
        pool={pool}
      />
    </>
  );
}
