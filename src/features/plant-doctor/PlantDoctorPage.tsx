import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoaderCircle, ScanLine, ShieldCheck, Sparkles } from 'lucide-react';
import { Button, Card, Modal } from '@/components/ui';
import {
  AnalysisWorkflow,
  CameraCapture,
  DiagnosisResult,
  DiseaseDatabase,
  ImageUploader,
  PlantDoctorHero,
  PlantHealthDashboard,
  ScanHistory,
} from './components';
import { plantDoctorService } from './services/plantDoctorService';
import {
  scanExportService,
  type ReportAction,
} from './services/scanExportService';
import { usePlantDoctorStore } from './store/usePlantDoctorStore';
import type { PlantDoctorAnalysis, PlantScan } from './types';
import { workspaceIntegrationService } from '@/services/workspaceIntegrationService';
import { preparePlantImage } from '@/services/security';

export function PlantDoctorPage() {
  const { scans, addScan, deleteScan, toggleFavorite } = usePlantDoctorStore();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [analysis, setAnalysis] = useState<PlantDoctorAnalysis | null>(null);
  const [activeScan, setActiveScan] = useState<PlantScan>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const previewUrlRef = useRef<string | undefined>(undefined);

  useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    },
    [],
  );

  const setPhoto = async (file: File) => {
    const secureImage = await preparePlantImage(file);
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const nextPreview = URL.createObjectURL(secureImage);
    previewUrlRef.current = nextPreview;
    setSelectedFile(secureImage);
    setPreviewUrl(nextPreview);
    setAnalysis(null);
    setActiveScan(undefined);
    setNotice('');
  };

  const removePhoto = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = undefined;
    setSelectedFile(undefined);
    setPreviewUrl(undefined);
    setAnalysis(null);
    setActiveScan(undefined);
    setNotice('');
  };

  const runAnalysis = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setNotice('');
    try {
      const result = await plantDoctorService.analyze({ image: selectedFile });
      const scan: PlantScan = {
        id: `scan-${Date.now()}`,
        filename: selectedFile.name,
        imageUrl: previewUrl,
        date: 'Just now',
        favorite: false,
        analysis: result,
      };
      setAnalysis(result);
      setActiveScan(scan);
      addScan(scan);
      const diarySync = workspaceIntegrationService.syncDoctorScanToDiary(scan);
      if (diarySync.addedToDiary) {
        setNotice(
          'Diagnosis saved to Garden Diary and a Plant Doctor follow-up was added to Tasks.',
        );
      }
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Plant Doctor could not review this image. Please try another clear photo.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectHistoryScan = (scan: PlantScan) => {
    setAnalysis(scan.analysis);
    setActiveScan(scan);
    setNotice(
      `Viewing the ${scan.date} screening for ${scan.analysis.plantName}.`,
    );
    window.setTimeout(
      () =>
        document
          .getElementById('plant-doctor-result')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      0,
    );
  };

  const prepareReport = async (
    scan: PlantScan | undefined,
    action: ReportAction,
  ) => {
    if (!scan) {
      setNotice('Complete or open a screening before preparing a report.');
      return;
    }
    if (action === 'Reminder') {
      const diarySync = workspaceIntegrationService.syncDoctorScanToDiary(scan);
      setNotice(
        diarySync.addedToDiary
          ? 'The screening was added to Garden Diary with a follow-up task.'
          : diarySync.reminderScheduled
            ? 'A Plant Doctor follow-up was added to Tasks.'
            : 'This screening already has a matching follow-up task.',
      );
      return;
    }
    setNotice('Preparing your report...');
    setNotice(await scanExportService.prepare(scan, action));
  };

  return (
    <div className="pb-3">
      <PlantDoctorHero />

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.12fr_.88fr]">
        <div>
          <ImageUploader
            file={selectedFile}
            previewUrl={previewUrl}
            onFileSelect={setPhoto}
            onRemove={removePhoto}
            onCapture={() => setIsCameraOpen(true)}
          />
          <Card className="mt-5 overflow-hidden border-brand/15 bg-[linear-gradient(120deg,rgb(var(--surface)),rgb(var(--brand-soft)/.45))] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-brand text-white shadow-[0_8px_18px_rgb(34_121_81_/_0.18)]">
                  <ScanLine size={19} />
                </span>
                <div>
                  <p className="text-[15px] font-extrabold tracking-[-0.025em]">
                    Ready for an AI health screening
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    GreenMind will inspect species, leaf condition, disease
                    risk, nutrient patterns, and the next best treatment steps.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                onClick={() => void runAnalysis()}
                disabled={!selectedFile || isAnalyzing}
                leftIcon={
                  isAnalyzing ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )
                }
              >
                {isAnalyzing ? 'Analyzing plant...' : 'Analyze Plant'}
              </Button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-brand/10 pt-4 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-brand-dark sm:grid-cols-4 2xl:grid-cols-7">
              {[
                'Upload',
                'Species',
                'Leaf',
                'Disease',
                'Nutrients',
                'Treatment',
                'Report',
              ].map((step, index) => (
                <span
                  key={step}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-surface/75 px-2 py-2 shadow-sm"
                >
                  <span className="grid size-5 place-items-center rounded-full bg-brand-soft text-[10px] text-brand">
                    {index + 1}
                  </span>
                  {step}
                </span>
              ))}
            </div>
          </Card>
          <p className="status-warning mt-5 rounded-xl px-4 py-3 text-sm leading-6">
            <b>Important disclaimer:</b> This diagnosis is AI-generated and
            should be verified by an agricultural expert before applying
            chemicals.
          </p>
          <AnalysisWorkflow isAnalyzing={isAnalyzing} />
        </div>
        <div className="space-y-5">
          <PlantHealthDashboard analysis={analysis} />
          <Card className="p-5 sm:p-6">
            <div className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-brand-soft text-brand">
                <ShieldCheck size={19} />
              </span>
              <div>
                <p className="text-[15px] font-extrabold tracking-[-0.025em]">
                  A more useful kind of AI
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  Plant Doctor separates visual observations, confidence, care
                  actions, and escalation guidance so future providers can
                  remain transparent.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-lg font-extrabold tracking-[-0.04em]">10</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  Issue models
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-lg font-extrabold tracking-[-0.04em]">6</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  Care checks
                </p>
              </div>
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-lg font-extrabold tracking-[-0.04em]">30d</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  Plan horizon
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <AnimatePresence>
        {notice && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="mt-5 rounded-xl border border-brand/15 bg-brand-soft/45 px-4 py-3 text-xs font-semibold leading-5 text-brand-dark"
          >
            {notice}
          </motion.p>
        )}
      </AnimatePresence>

      {analysis && !isAnalyzing && (
        <div id="plant-doctor-result" className="scroll-mt-8">
          <DiagnosisResult
            analysis={analysis}
            onReport={(action) => void prepareReport(activeScan, action)}
          />
        </div>
      )}
      <ScanHistory
        scans={scans}
        onSelect={selectHistoryScan}
        onDelete={deleteScan}
        onToggleFavorite={toggleFavorite}
        onDownload={(scan) => void prepareReport(scan, 'PDF')}
      />
      <DiseaseDatabase />

      <Modal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        title="Capture plant photo"
      >
        <CameraCapture
          onCapture={(file) =>
            void setPhoto(file).catch((error: Error) =>
              setNotice(error.message),
            )
          }
          onClose={() => setIsCameraOpen(false)}
        />
      </Modal>
    </div>
  );
}
