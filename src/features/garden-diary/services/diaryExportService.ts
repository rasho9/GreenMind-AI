/** UI-facing export seam. Connect PDF/CSV generation and browser print adapters here later. */
export const diaryExportService = {
  async requestExport(format: 'PDF' | 'CSV' | 'Print') {
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    return `${format} export is prepared for future diary sharing.`;
  },
};
