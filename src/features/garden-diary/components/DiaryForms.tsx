import { useState, type ReactNode } from 'react';
import { LoaderCircle, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui';
import type {
  DiaryEntryInput,
  DiaryPlant,
  DiaryReminder,
  PlantRecordInput,
  ReminderType,
} from '../types';
import { validateSafeText } from '@/services/security';

const inputClass =
  'focus-ring h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink outline-none transition-all placeholder:text-muted/65 hover:border-brand/30 focus:border-brand/60 focus:shadow-[0_0_0_3px_rgb(34_121_81_/_0.09)]';
const labelClass =
  'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-muted';

export function AddPlantForm({
  onSave,
  onClose,
}: {
  onSave: (input: PlantRecordInput) => void;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlantRecordInput>({
    defaultValues: {
      category: 'Vegetable',
      plantingDate: '2026-07-16',
      expectedHarvest: '2026-09-15',
      location: '',
      gardenArea: '',
      potSize: '',
      variety: '',
      source: '',
      notes: '',
    },
  });
  const submit = async (values: PlantRecordInput) => {
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    onSave(values);
    onClose();
  };
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plant name" error={errors.name?.message}>
          <input
            className={inputClass}
            placeholder="e.g. Sweet Pepper"
            {...register('name', {
              required: 'Enter a plant name.',
              validate: (value) => validateSafeText(value, 'Plant name', 120),
            })}
          />
        </Field>
        <Field label="Category">
          <select className={inputClass} {...register('category')}>
            <option>Vegetable</option>
            <option>Herb</option>
            <option>Flower</option>
            <option>Fruit</option>
            <option>Indoor Plant</option>
          </select>
        </Field>
        <Field label="Planting date">
          <input
            type="date"
            className={inputClass}
            {...register('plantingDate', { required: true })}
          />
        </Field>
        <Field label="Expected harvest">
          <input
            type="date"
            className={inputClass}
            {...register('expectedHarvest', { required: true })}
          />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <input
            className={inputClass}
            placeholder="e.g. East balcony"
            {...register('location', {
              required: 'Add a location.',
              validate: (value) => validateSafeText(value, 'Location', 120),
            })}
          />
        </Field>
        <Field label="Garden area">
          <input
            className={inputClass}
            placeholder="e.g. Container garden"
            {...register('gardenArea')}
          />
        </Field>
        <Field label="Pot size">
          <input
            className={inputClass}
            placeholder="e.g. 12 L"
            {...register('potSize')}
          />
        </Field>
        <Field label="Plant variety">
          <input
            className={inputClass}
            placeholder="e.g. California Wonder"
            {...register('variety')}
          />
        </Field>
        <Field label="Plant source">
          <input
            className={inputClass}
            placeholder="e.g. Local nursery"
            {...register('source')}
          />
        </Field>
        <Field label="Photo upload">
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-brand/40 bg-brand-soft/30 px-3 text-xs font-semibold text-brand-dark">
            <Upload size={14} />
            Add a plant photo
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              {...register('photo')}
            />
          </label>
        </Field>
      </div>
      <Field label="Notes">
        <textarea
          className={`${inputClass} h-20 resize-none py-2.5`}
          placeholder="Anything useful to remember about this plant…"
          {...register('notes', {
            validate: (value) =>
              !value || validateSafeText(value, 'Notes', 1_200),
          })}
        />
      </Field>
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle size={15} className="animate-spin" />}
          {isSubmitting ? 'Adding plant…' : 'Add plant record'}
        </Button>
      </div>
    </form>
  );
}

export function DiaryEntryForm({
  plants,
  initialPlantId,
  onSave,
  onClose,
}: {
  plants: DiaryPlant[];
  initialPlantId?: string;
  onSave: (input: DiaryEntryInput) => Promise<void>;
  onClose: () => void;
}) {
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DiaryEntryInput>({
    defaultValues: {
      plantId: initialPlantId ?? plants[0]?.id,
      date: '2026-07-16',
      height: 0,
      leafColor: 'Healthy green',
      flowerStatus: 'No flowers',
      fruitStatus: 'No fruit',
      soilMoisture: 50,
      weatherNotes: '',
      waterGiven: 0,
      fertilizerApplied: 'None',
      pesticideUsed: 'None',
      growthRating: 4,
      healthRating: 4,
      personalNotes: '',
    },
  });
  const submit = async (values: DiaryEntryInput) => {
    setError('');
    try {
      await onSave(values);
      onClose();
    } catch {
      setError('We couldn’t save this entry. Please try again.');
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plant">
          <select
            className={inputClass}
            {...register('plantId', { required: true })}
          >
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Entry date">
          <input type="date" className={inputClass} {...register('date')} />
        </Field>
        <Field label="Photo">
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-brand/40 bg-brand-soft/30 px-3 text-xs font-semibold text-brand-dark">
            <Upload size={14} />
            Add today’s photo
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              {...register('photo')}
            />
          </label>
        </Field>
        <Field label="Height (cm)" error={errors.height?.message}>
          <input
            type="number"
            min="0"
            className={inputClass}
            {...register('height', {
              valueAsNumber: true,
              min: { value: 0, message: 'Enter a valid height.' },
            })}
          />
        </Field>
        <Field label="Leaf color">
          <select className={inputClass} {...register('leafColor')}>
            <option>Healthy green</option>
            <option>Pale green</option>
            <option>Yellowing</option>
            <option>Dark green</option>
            <option>Spotted</option>
          </select>
        </Field>
        <Field label="Soil moisture">
          <input
            type="range"
            min="0"
            max="100"
            className="h-10 w-full cursor-pointer accent-brand"
            {...register('soilMoisture', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Flower status">
          <select className={inputClass} {...register('flowerStatus')}>
            <option>No flowers</option>
            <option>Budding</option>
            <option>Blooming</option>
            <option>Flowers fading</option>
          </select>
        </Field>
        <Field label="Fruit status">
          <select className={inputClass} {...register('fruitStatus')}>
            <option>No fruit</option>
            <option>First set</option>
            <option>Developing fruit</option>
            <option>Ready to harvest</option>
          </select>
        </Field>
        <Field label="Water given (ml)">
          <input
            type="number"
            min="0"
            className={inputClass}
            {...register('waterGiven', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Fertilizer applied">
          <input
            className={inputClass}
            placeholder="None or product name"
            {...register('fertilizerApplied')}
          />
        </Field>
        <Field label="Pesticide used">
          <input
            className={inputClass}
            placeholder="None or product name"
            {...register('pesticideUsed')}
          />
        </Field>
        <Field label="Growth rating (1–5)">
          <select
            className={inputClass}
            {...register('growthRating', { valueAsNumber: true })}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} / 5
              </option>
            ))}
          </select>
        </Field>
        <Field label="Health rating (1–5)">
          <select
            className={inputClass}
            {...register('healthRating', { valueAsNumber: true })}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value} / 5
              </option>
            ))}
          </select>
        </Field>
        <Field label="Weather notes">
          <input
            className={inputClass}
            placeholder="e.g. Warm, humid, and clear"
            {...register('weatherNotes')}
          />
        </Field>
      </div>
      <Field label="Personal notes">
        <textarea
          className={`${inputClass} h-20 resize-none py-2.5`}
          placeholder="What did you notice today?"
          {...register('personalNotes', {
            validate: (value) =>
              !value || validateSafeText(value, 'Personal notes', 1_200),
          })}
        />
      </Field>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-[#efd0c9] bg-[#fff6f4] p-3 text-xs text-[#a64f44]"
        >
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <LoaderCircle size={15} className="animate-spin" />}
          {isSubmitting ? 'Analyzing growth…' : 'Save diary entry'}
        </Button>
      </div>
    </form>
  );
}

export function AddReminderForm({
  plants,
  onSave,
  onClose,
}: {
  plants: DiaryPlant[];
  onSave: (reminder: Omit<DiaryReminder, 'id' | 'completed'>) => void;
  onClose: () => void;
}) {
  const { register, handleSubmit } = useForm<
    Omit<DiaryReminder, 'id' | 'completed'>
  >({
    defaultValues: {
      plantId: plants[0]?.id,
      title: '',
      type: 'Watering',
      date: '2026-07-18',
      time: '08:00',
    },
  });
  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSave(values);
        onClose();
      })}
      className="space-y-4"
    >
      <Field label="Reminder">
        <input
          className={inputClass}
          placeholder="e.g. Inspect lower leaves"
          {...register('title', { required: true })}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Plant">
          <select className={inputClass} {...register('plantId')}>
            <option value="">Whole garden</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Care type">
          <select className={inputClass} {...register('type')}>
            {(
              [
                'Watering',
                'Fertilizer',
                'Pruning',
                'Harvest',
                'Disease Inspection',
                'Repotting',
              ] as ReminderType[]
            ).map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" className={inputClass} {...register('date')} />
        </Field>
        <Field label="Time">
          <input type="time" className={inputClass} {...register('time')} />
        </Field>
      </div>
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create reminder</Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error && (
        <p className="mt-1 text-[10px] font-medium text-[#c8584b]">{error}</p>
      )}
    </div>
  );
}
