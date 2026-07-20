import type { PlantScan } from '../types';

export type ReportAction = 'Save' | 'PDF' | 'Print' | 'Share' | 'Reminder';

/** Browser-native reporting until a branded server-side PDF renderer is introduced. */
export const scanExportService = {
  async prepare(scan: PlantScan, action: ReportAction) {
    const summary = `${scan.analysis.plantName}: ${scan.analysis.diseaseName}. Health score ${scan.analysis.healthScore}%.`;

    if (action === 'Save') {
      return `${scan.analysis.plantName}'s diagnosis is saved in your scan history.`;
    }

    if (action === 'Print' || action === 'PDF') {
      window.print();
      return action === 'PDF'
        ? 'Print dialog opened. Select “Save as PDF” to download this report.'
        : 'Print dialog opened for this screening report.';
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `GreenMind AI - ${scan.analysis.plantName} report`,
          text: summary,
        });
        return 'Sharing options opened for this screening summary.';
      } catch {
        return 'Sharing was cancelled.';
      }
    }

    await navigator.clipboard?.writeText(summary);
    return 'Screening summary copied to your clipboard.';
  },
};
