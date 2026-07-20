import { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Leaf,
  Plus,
  Printer,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button, Card, Modal, SectionHeader } from '@/components/ui';
import {
  Achievements,
  AddPlantForm,
  AddReminderForm,
  DiaryCalendar,
  DiaryEntryCard,
  DiaryEntryForm,
  DiaryInsights,
  DiaryPlantVisual,
  DiaryReminders,
  DiaryStats,
  PhotoTimeline,
} from './components';
import { diaryAnalysisService } from './services/diaryAnalysisService';
import { diaryExportService } from './services/diaryExportService';
import { useGardenDiaryStore } from './store/useGardenDiaryStore';
import type { DiaryEntryInput, PlantRecordInput } from './types';

export function GardenDiaryPage() {
  const plants = useGardenDiaryStore((state) => state.plants);
  const entries = useGardenDiaryStore((state) => state.entries);
  const reminders = useGardenDiaryStore((state) => state.reminders);
  const achievements = useGardenDiaryStore((state) => state.achievements);
  const addPlant = useGardenDiaryStore((state) => state.addPlant);
  const addEntry = useGardenDiaryStore((state) => state.addEntry);
  const addReminder = useGardenDiaryStore((state) => state.addReminder);
  const toggleReminder = useGardenDiaryStore((state) => state.toggleReminder);
  const [modal, setModal] = useState<'plant' | 'entry' | 'reminder' | null>(
    null,
  );
  const [notice, setNotice] = useState('');
  const submitEntry = async (input: DiaryEntryInput) => {
    const analysis = await diaryAnalysisService.analyze(input);
    addEntry(input, analysis);
  };
  const exportDiary = async (format: 'PDF' | 'CSV' | 'Print') => {
    setNotice(await diaryExportService.requestExport(format));
  };
  return (
    <div>
      <section className="relative overflow-hidden rounded-[24px] border border-[#d5e9db] bg-[radial-gradient(circle_at_83%_20%,rgba(163,221,181,.52),transparent_22%),radial-gradient(circle_at_6%_112%,rgba(215,241,222,.88),transparent_35%),linear-gradient(120deg,#fbfefb,#edf7ef)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="absolute -right-14 -top-16 size-72 rounded-full border border-brand/10" />
        <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#4d725a]">
              Thursday, 16 July
            </p>
            <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.065em] text-ink sm:text-[40px]">
              Your garden’s living story.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-[15px]">
              Capture what you notice, see how each plant is changing, and let
              gentle intelligence surface the patterns worth caring about.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => setModal('entry')}
                leftIcon={<Plus size={15} />}
              >
                Add daily entry
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setModal('plant')}
                leftIcon={<Leaf size={15} />}
              >
                Add new plant
              </Button>
            </div>
          </div>
          <div className="rounded-[21px] border border-white/80 bg-white/60 p-5 shadow-[0_14px_32px_rgb(35_102_59_/_0.08)] backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#557660]">
                Garden summary
              </span>
              <Sparkles size={17} className="text-brand" />
            </div>
            <p className="mt-5 text-3xl font-extrabold tracking-[-0.065em]">
              {Math.round(
                plants.reduce((total, plant) => total + plant.healthScore, 0) /
                  plants.length,
              )}
              %
            </p>
            <p className="mt-1 text-xs font-semibold text-ink">
              Average garden health
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-soft">
              <div
                className="h-full rounded-full bg-brand"
                style={{
                  width: `${Math.round(plants.reduce((total, plant) => total + plant.healthScore, 0) / plants.length)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-[11px] leading-5 text-muted">
              {plants.filter((plant) => plant.status === 'Healthy').length}{' '}
              plants are thriving; one has a helpful care signal to review.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-8">
        <DiaryStats plants={plants} reminders={reminders} />
      </section>
      <section className="mt-9 grid gap-5 xl:grid-cols-[1.12fr_.88fr]">
        <PhotoTimeline entries={entries} plants={plants} />
        <DiaryInsights plants={plants} entries={entries} />
      </section>
      <section className="mt-9">
        <SectionHeader
          eyebrow="Your growing spaces"
          title="Plant timeline"
          description="A grounded snapshot of every plant in your care."
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setModal('plant')}
              leftIcon={<Plus size={14} />}
            >
              Add plant
            </Button>
          }
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {plants.map((plant) => (
            <motion.div whileHover={{ y: -4 }} key={plant.id}>
              <Card className="overflow-hidden p-4">
                <DiaryPlantVisual plant={plant} />
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold tracking-[-0.03em]">
                      {plant.name}
                    </h3>
                    <p className="mt-1 text-[10px] text-muted">
                      {plant.location} · {plant.currentStage}
                    </p>
                  </div>
                  <span
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold ${plant.status === 'Healthy' ? 'status-success' : 'status-warning'}`}
                  >
                    {plant.healthScore}%
                  </span>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-soft">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${plant.healthScore}%` }}
                  />
                </div>
                <Link
                  to={`/garden-diary/${plant.id}`}
                  className="focus-ring mt-4 inline-flex rounded-md text-[11px] font-bold text-brand hover:text-brand-dark"
                >
                  Open plant profile →
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="mt-9 grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
        <DiaryCalendar reminders={reminders} entries={entries} />
        <DiaryReminders
          reminders={reminders}
          plants={plants}
          onToggle={toggleReminder}
        />
      </section>
      <section className="mt-9 grid gap-5 xl:grid-cols-[1.08fr_.92fr]">
        <div>
          <SectionHeader
            eyebrow="Latest observations"
            title="Recent diary entries"
            description="The details you captured are becoming a more useful growing record."
          />
          <div className="mt-5 grid gap-3">
            {entries.slice(0, 3).map((entry) => {
              const plant = plants.find((item) => item.id === entry.plantId);
              return plant ? (
                <DiaryEntryCard key={entry.id} entry={entry} plant={plant} />
              ) : null;
            })}
          </div>
        </div>
        <Achievements achievements={achievements} />
      </section>
      <section className="mt-9 rounded-[22px] border border-[#cbe3d3] bg-[linear-gradient(110deg,#eef8f0,#e1f1e6)] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
        <div>
          <h2 className="text-lg font-extrabold tracking-[-0.04em]">
            Take your garden story with you.
          </h2>
          <p className="mt-1.5 text-xs leading-5 text-muted">
            Export your diary whenever you want to reflect, share, or archive a
            season.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2 sm:mt-0">
          <Button
            size="sm"
            onClick={() => exportDiary('PDF')}
            leftIcon={<Download size={14} />}
          >
            Export PDF
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => exportDiary('CSV')}
            leftIcon={<FileSpreadsheet size={14} />}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => exportDiary('Print')}
            leftIcon={<Printer size={14} />}
          >
            Print diary
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setModal('reminder')}
            leftIcon={<Plus size={14} />}
          >
            New reminder
          </Button>
        </div>
      </section>
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="status-success fixed bottom-5 right-5 z-50 max-w-sm rounded-xl p-4 text-xs font-medium leading-5 shadow-elevated"
          >
            {notice}
            <button
              type="button"
              onClick={() => setNotice('')}
              className="ml-3 text-[11px] font-bold text-brand"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Modal
        isOpen={modal === 'plant'}
        onClose={() => setModal(null)}
        title="Add a plant record"
      >
        <AddPlantForm
          onSave={(input: PlantRecordInput) => addPlant(input)}
          onClose={() => setModal(null)}
        />
      </Modal>
      <Modal
        isOpen={modal === 'entry'}
        onClose={() => setModal(null)}
        title="Add a daily diary entry"
      >
        <DiaryEntryForm
          plants={plants}
          onSave={submitEntry}
          onClose={() => setModal(null)}
        />
      </Modal>
      <Modal
        isOpen={modal === 'reminder'}
        onClose={() => setModal(null)}
        title="Create a care reminder"
      >
        <AddReminderForm
          plants={plants}
          onSave={addReminder}
          onClose={() => setModal(null)}
        />
      </Modal>
    </div>
  );
}
