import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Check,
  ImagePlus,
  LoaderCircle,
  LocateFixed,
  MapPin,
  MessageSquareText,
  Sparkles,
  Upload,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/ui';
import {
  browserLocationService,
  geocodingService,
} from '@/services/platform/locationService';
import type { RecommendationMethod, SmartRecommendationInput } from '../types';
import { validateSafeText } from '@/services/security';

const methods: Array<{
  id: RecommendationMethod;
  title: string;
  detail: string;
  icon: typeof LocateFixed;
}> = [
  {
    id: 'current-location',
    title: 'Current location',
    detail: 'Use your device signal',
    icon: LocateFixed,
  },
  {
    id: 'manual-location',
    title: 'Manual location',
    detail: 'Add city and country',
    icon: MapPin,
  },
  {
    id: 'place-photo',
    title: 'Upload photo',
    detail: 'Read your growing space',
    icon: ImagePlus,
  },
  {
    id: 'description',
    title: 'Describe your place',
    detail: 'Tell the AI in your words',
    icon: MessageSquareText,
  },
];

const sunlightOptions = ['Full Sun', 'Partial Sun', 'Shade'] as const;
const spaceOptions = [
  'Indoor',
  'Balcony',
  'Terrace',
  'Garden',
  'Farm',
] as const;
const maintenanceOptions = ['Low', 'Medium', 'High'] as const;
const purposeOptions = [
  'Decoration',
  'Food',
  'Medicine',
  'Air Purification',
  'Organic Farming',
  'Pet Friendly',
  'Fast Growing',
] as const;
const budgetOptions = ['Low', 'Medium', 'High'] as const;

type SmartRecommendationFormProps = {
  onComplete: (values: SmartRecommendationInput) => Promise<void>;
  isLoading: boolean;
};

export function SmartRecommendationForm({
  onComplete,
  isLoading,
}: SmartRecommendationFormProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [preview, setPreview] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SmartRecommendationInput>({
    defaultValues: {
      method: 'manual-location',
      country: 'Pakistan',
      city: 'Lahore',
      placeDescription: '',
      sunlight: 'Full Sun',
      space: 'Balcony',
      maintenance: 'Low',
      purposes: ['Food', 'Fast Growing'],
      budget: 'Medium',
    },
  });
  const values = watch();

  const setMethod = (method: RecommendationMethod) =>
    setValue('method', method, { shouldDirty: true });
  const selectOption = <
    K extends 'sunlight' | 'space' | 'maintenance' | 'budget',
  >(
    field: K,
    value: SmartRecommendationInput[K],
  ) => setValue(field, value as never, { shouldDirty: true });
  const togglePurpose = (purpose: (typeof purposeOptions)[number]) => {
    const current = values.purposes;
    setValue(
      'purposes',
      current.includes(purpose)
        ? current.filter((item) => item !== purpose)
        : [...current, purpose],
      { shouldDirty: true },
    );
  };
  const detectLocation = async () => {
    setIsDetecting(true);
    setLocationError('');
    try {
      const coordinates = await browserLocationService.getCurrentPosition();
      const place = await geocodingService.reverse(coordinates);
      setValue('method', 'current-location');
      setValue('country', place.country);
      setValue('city', place.city);
      setValue('latitude', place.latitude);
      setValue('longitude', place.longitude);
    } catch {
      setLocationError(
        'Location permission was not available. You can enter your city instead.',
      );
    } finally {
      setIsDetecting(false);
    }
  };
  const selectPhoto = (file?: File) => {
    if (!file) return;
    setMethod('place-photo');
    setValue('photoName', file.name, { shouldDirty: true });
    setPreview(URL.createObjectURL(file));
  };

  return (
    <Card className="overflow-hidden border-[#cfe4d5] bg-[linear-gradient(135deg,rgb(var(--surface)),rgb(var(--brand-soft)/.34))] p-0 shadow-[0_18px_46px_rgb(23_77_43_/_0.08)]">
      <div className="border-b border-line bg-white/45 px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
              Start a conversation with your garden
            </p>
            <h2 className="mt-2">What can GreenMind learn from your space?</h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/15 bg-brand-soft/75 px-3 py-2 text-xs font-bold text-brand-dark">
            <span className="size-2 rounded-full bg-brand shadow-[0_0_0_4px_rgb(34_121_81_/_0.12)]" />
            AI context ready
          </span>
        </div>
        <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {methods.map(({ id, title, detail, icon: Icon }) => {
            const active = values.method === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={`focus-ring group flex min-h-[104px] cursor-pointer items-start gap-3 rounded-[18px] border p-3.5 text-left transition-all ${active ? 'border-brand bg-brand text-white shadow-[0_9px_22px_rgb(34_121_81_/_0.18)]' : 'border-line bg-surface/80 text-ink hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-card'}`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-xl ${active ? 'bg-white/16 text-white' : 'bg-brand-soft text-brand'}`}
                >
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block font-bold leading-5">{title}</span>
                  <span
                    className={`mt-1 block text-[13px] leading-5 ${active ? 'text-white/75' : 'text-muted'}`}
                  >
                    {detail}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onComplete)}
        noValidate
        className="p-5 sm:p-7"
      >
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(290px,.72fr)]">
          <div className="space-y-6">
            <SourcePanel
              method={values.method}
              isDetecting={isDetecting}
              locationError={locationError}
              preview={preview}
              photoName={values.photoName}
              country={values.country}
              city={values.city}
              latitude={values.latitude}
              longitude={values.longitude}
              onDetect={detectLocation}
              onPhoto={selectPhoto}
              onClearPhoto={() => {
                setPreview('');
                setValue('photoName', undefined);
              }}
              register={register}
              errors={errors}
            />
            <fieldset>
              <legend className="text-[15px] font-bold text-ink">
                Sunlight
              </legend>
              <p className="mt-1 text-sm text-muted">
                Choose the light your plants can reliably count on.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {sunlightOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    active={values.sunlight === option}
                    onClick={() => selectOption('sunlight', option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[15px] font-bold text-ink">Space</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {spaceOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    active={values.space === option}
                    onClick={() => selectOption('space', option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="rounded-[20px] border border-line bg-surface/75 p-4 sm:p-5">
            <p className="text-[15px] font-bold text-ink">
              Growing preferences
            </p>
            <p className="mt-1 text-sm text-muted">
              These help GreenMind balance ambition with a care plan you can
              keep.
            </p>
            <fieldset className="mt-5">
              <legend className="text-[15px] font-bold text-ink">
                Maintenance
              </legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {maintenanceOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    active={values.maintenance === option}
                    onClick={() => selectOption('maintenance', option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-[15px] font-bold text-ink">Budget</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {budgetOptions.map((option) => (
                  <ChoiceButton
                    key={option}
                    active={values.budget === option}
                    onClick={() => selectOption('budget', option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-5">
              <legend className="text-[15px] font-bold text-ink">
                Purpose
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {purposeOptions.map((purpose) => (
                  <button
                    key={purpose}
                    type="button"
                    onClick={() => togglePurpose(purpose)}
                    className={`focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-2 transition-all ${values.purposes.includes(purpose) ? 'border-brand bg-brand-soft text-brand-dark' : 'border-line bg-canvas/55 text-muted hover:border-brand/30 hover:text-ink'}`}
                  >
                    {values.purposes.includes(purpose) && <Check size={14} />}
                    {purpose}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-muted">
            GreenMind combines your context into a clear plant shortlist and an
            explanation you can act on.
          </p>
          <Button
            type="submit"
            disabled={isLoading || isDetecting}
            leftIcon={
              isLoading ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )
            }
            className="min-w-[260px] shadow-[0_12px_26px_rgb(34_121_81_/_0.23)]"
          >
            {isLoading
              ? 'GreenMind is reading your space...'
              : 'Generate AI Recommendations'}
          </Button>
        </div>
        {isLoading && <ThinkingProgress />}
      </form>
    </Card>
  );
}

function SourcePanel({
  method,
  isDetecting,
  locationError,
  preview,
  photoName,
  country,
  city,
  latitude,
  longitude,
  onDetect,
  onPhoto,
  onClearPhoto,
  register,
  errors,
}: {
  method: RecommendationMethod;
  isDetecting: boolean;
  locationError: string;
  preview: string;
  photoName?: string;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  onDetect: () => Promise<void>;
  onPhoto: (file?: File) => void;
  onClearPhoto: () => void;
  register: ReturnType<typeof useForm<SmartRecommendationInput>>['register'];
  errors: ReturnType<
    typeof useForm<SmartRecommendationInput>
  >['formState']['errors'];
}) {
  if (method === 'current-location') {
    return (
      <section className="rounded-[20px] border border-brand/15 bg-brand-soft/35 p-4 sm:p-5">
        <p className="text-[15px] font-bold text-ink">Current Location</p>
        <p className="mt-1 text-sm text-muted">
          Let your browser provide a precise coordinate for this recommendation.
        </p>
        <Button
          type="button"
          onClick={onDetect}
          disabled={isDetecting}
          leftIcon={
            isDetecting ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <LocateFixed size={17} />
            )
          }
          className="mt-4"
        >
          {isDetecting ? 'Detecting location...' : 'Detect My Location'}
        </Button>
        {locationError && (
          <p className="mt-3 text-sm text-[#b85649]">{locationError}</p>
        )}
        {(latitude !== undefined || city === 'Detected location') && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <LocationDatum label="Country" value={country} />
            <LocationDatum label="City" value={city} />
            <LocationDatum
              label="Latitude"
              value={latitude?.toFixed(4) ?? '-'}
            />
            <LocationDatum
              label="Longitude"
              value={longitude?.toFixed(4) ?? '-'}
            />
          </div>
        )}
      </section>
    );
  }
  if (method === 'place-photo') {
    return (
      <section className="rounded-[20px] border border-line bg-canvas/40 p-4 sm:p-5">
        <p className="text-[15px] font-bold text-ink">Upload a place photo</p>
        <p className="mt-1 text-sm text-muted">
          Garden, balcony, roof, yard, farm, office, or home - GreenMind will
          prepare this for future vision analysis.
        </p>
        {preview ? (
          <div className="relative mt-4 overflow-hidden rounded-[16px] border border-line bg-surface">
            <img
              src={preview}
              alt="Uploaded growing space"
              className="h-44 w-full object-cover"
            />
            <div className="flex items-center justify-between gap-3 p-3">
              <p className="truncate text-sm font-semibold text-ink">
                {photoName}
              </p>
              <button
                type="button"
                onClick={onClearPhoto}
                className="focus-ring grid size-9 place-items-center rounded-lg text-muted hover:bg-brand-soft hover:text-brand-dark"
                aria-label="Remove uploaded photo"
              >
                <X size={17} />
              </button>
            </div>
          </div>
        ) : (
          <label className="focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 mt-4 flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-brand/35 bg-surface/75 px-5 text-center transition-colors hover:border-brand hover:bg-brand-soft/35">
            <span className="grid size-11 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <Upload size={20} />
            </span>
            <span className="mt-3 text-[15px] font-bold text-ink">
              Choose a landscape image
            </span>
            <span className="mt-1 text-sm text-muted">
              PNG, JPG, or WEBP up to 10 MB
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => onPhoto(event.target.files?.[0])}
              className="sr-only"
            />
          </label>
        )}
      </section>
    );
  }
  if (method === 'description') {
    return (
      <section>
        <label
          htmlFor="place-description"
          className="block text-[15px] font-bold text-ink"
        >
          Describe your place
        </label>
        <textarea
          id="place-description"
          rows={6}
          placeholder="My balcony gets morning sunlight for around 5 hours. I live in Lahore. The weather is hot and dry."
          className="focus-ring mt-2 w-full resize-y rounded-[18px] border border-line bg-canvas/42 p-4 text-ink outline-none transition-all placeholder:text-muted/70 hover:border-brand/30 focus:border-brand/50"
          {...register('placeDescription', {
            required: 'Describe your growing space in a sentence or two.',
            validate: (value) => validateSafeText(value, 'Description', 1_200),
          })}
        />
        {errors.placeDescription && (
          <p className="mt-2 text-sm text-[#b85649]">
            {errors.placeDescription.message}
          </p>
        )}
      </section>
    );
  }
  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <label>
        Country
        <input
          className="focus-ring mt-2 h-12 w-full rounded-xl border border-line bg-canvas/42 px-3.5 text-ink outline-none transition-all hover:border-brand/30 focus:border-brand/50"
          {...register('country', {
            required: 'Enter your country.',
            validate: (value) => validateSafeText(value, 'Country', 80),
          })}
        />
        {errors.country && (
          <span className="mt-1 block text-sm text-[#b85649]">
            {errors.country.message}
          </span>
        )}
      </label>
      <label>
        City
        <input
          className="focus-ring mt-2 h-12 w-full rounded-xl border border-line bg-canvas/42 px-3.5 text-ink outline-none transition-all hover:border-brand/30 focus:border-brand/50"
          {...register('city', {
            required: 'Enter your city.',
            validate: (value) => validateSafeText(value, 'City', 100),
          })}
        />
        {errors.city && (
          <span className="mt-1 block text-sm text-[#b85649]">
            {errors.city.message}
          </span>
        )}
      </label>
    </section>
  );
}

function LocationDatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand/12 bg-surface/70 px-3 py-2.5">
      <p className="text-[13px] font-semibold text-muted">{label}</p>
      <p className="mt-1 text-[15px] font-bold text-ink">{value}</p>
    </div>
  );
}

function ChoiceButton({
  children,
  active,
  onClick,
}: {
  children: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`focus-ring cursor-pointer rounded-xl border px-3 py-2.5 transition-all ${active ? 'border-brand bg-brand text-white shadow-sm' : 'border-line bg-surface text-muted hover:border-brand/35 hover:text-ink'}`}
    >
      {children}
    </button>
  );
}

function ThinkingProgress() {
  const steps = [
    'Reading location and space',
    'Balancing care preferences',
    'Preparing a tailored shortlist',
  ];
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-5 overflow-hidden rounded-[16px] border border-brand/15 bg-brand-soft/40 p-4"
    >
      <div className="flex items-center gap-2 text-[15px] font-bold text-brand-dark">
        <Sparkles size={17} className="animate-pulse" />
        GreenMind AI is thinking
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.16 }}
            className="flex items-center gap-2 text-sm text-[#397051]"
          >
            <span className="size-2 rounded-full bg-brand animate-pulse" />
            {step}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
