'use client';

import type { UserPool } from '@/models/Schema';
import { exportSchedulePDF } from '@/utils/pdf/scheduleExport';

type ExportReportButtonProps = {
  pool: UserPool;
};

export const ExportReportButton = ({ pool }: ExportReportButtonProps) => {
  const handleExport = () => {
    exportSchedulePDF(pool);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      aria-label="Export Report"
    >
      Export Report
    </button>
  );
};
