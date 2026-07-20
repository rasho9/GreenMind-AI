import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LoaderCircle,
  MapPin,
  SlidersHorizontal,
  Sprout,
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import type { RecommendationInput } from '../types';

const steps = [
  {
    title: 'Your environment',
    detail: 'Where and when you want to grow.',
    icon: MapPin,
  },
  {
    title: 'Growing conditions',
    detail: 'A few useful signals from your space.',
    icon: SlidersHorizontal,
  },
  {
    title: 'Your preferences',
    detail: 'Let’s shape a plan around your goals.',
    icon: Sprout,
  },
];

const stepFields: Array<Array<keyof RecommendationInput>> = [
  ['country', 'region', 'climateZone', 'season'],
  ['soilType', 'availableSpace', 'sunlightExposure', 'waterAvailability'],
  ['gardeningExperience', 'budget', 'preferredPlantType'],
];

function FieldLabel({
  children,
  htmlFor,
}: {
  children: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[13px] font-semibold text-ink"
    >
      {children}
    </label>
  );
}

function SelectField({
  label,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
}) {
  const inputId = props.id ?? props.name;
  return (
    <div>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <select
        id={inputId}
        aria-invalid={Boolean(error)}
        className={`focus-ring h-11 w-full appearance-none rounded-xl border bg-surface px-3.5 text-sm text-ink outline-none transition-all hover:border-brand/30 focus:border-brand/60 focus:shadow-[0_0_0_3px_rgb(34_121_81_/_0.09)] ${error ? 'border-[#d96757]' : 'border-line'}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#c8584b]">{error}</p>
      )}
    </div>
  );
}

type RecommendationFormProps = {
  onComplete: (values: RecommendationInput) => Promise<void>;
  isLoading: boolean;
};

export function RecommendationForm({
  onComplete,
  isLoading,
}: RecommendationFormProps) {
  const [step, setStep] = useState(0);
  const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<RecommendationInput>({
    mode: 'onChange',
    defaultValues: {
      country: 'Pakistan',
      region: '',
      climateZone: '',
      season: 'Summer',
      soilType: '',
      availableSpace: 'Balcony',
      sunlightExposure: 'Full sun',
      waterAvailability: 70,
      gardeningExperience: 'Beginner',
      budget: 50,
      preferredPlantType: 'Vegetables',
    },
  });
  const values = watch();
  const next = async () => {
    if (await trigger(stepFields[step]))
      setStep((current) => Math.min(current + 1, steps.length - 1));
  };
  const StepIcon = steps[step].icon;
  const buttonOption = (
    field: keyof RecommendationInput,
    option: string,
    active: boolean,
  ) => (
    <label
      key={option}
      className={`focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-center text-xs font-semibold transition-all ${active ? 'border-brand bg-brand-soft text-brand-dark' : 'border-line bg-surface text-muted hover:border-brand/35 hover:text-ink'}`}
    >
      <input
        className="sr-only"
        type="radio"
        value={option}
        {...register(field as keyof RecommendationInput)}
      />
      {option}
    </label>
  );
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-line bg-[linear-gradient(110deg,rgb(var(--surface)),rgb(var(--brand-soft)/.48))] px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-[0_7px_17px_rgb(34_121_81_/_0.18)]">
            <StepIcon size={19} />
          </div>
          <div>
            <p className="text-[15px] font-extrabold tracking-[-0.03em]">
              {steps[step].title}
            </p>
            <p className="mt-1 text-xs text-muted">{steps[step].detail}</p>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          {steps.map((item, index) => (
            <div key={item.title} className="flex flex-1 items-center gap-2">
              <span
                className={`grid size-5 place-items-center rounded-full text-[10px] font-bold ${index < step ? 'bg-brand text-white' : index === step ? 'bg-brand text-white' : 'bg-line text-muted'}`}
              >
                {index < step ? <Check size={12} strokeWidth={3} /> : index + 1}
              </span>
              <span className="hidden text-[10px] font-semibold text-muted xl:block">
                {item.title}
              </span>
              {index < steps.length - 1 && (
                <span className="h-px flex-1 bg-line" />
              )}
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onComplete)}
        noValidate
        className="p-5 sm:p-7"
      >
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Country"
              error={errors.country?.message}
              {...register('country', { required: 'Select your country.' })}
            >
              <option value="Pakistan">Pakistan</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="Other">Other</option>
            </SelectField>
            <div>
              <FieldLabel htmlFor="region">City / region</FieldLabel>
              <input
                id="region"
                placeholder="e.g. Lahore"
                className={`focus-ring h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink outline-none transition-all placeholder:text-muted/60 hover:border-brand/30 focus:border-brand/60 ${errors.region ? 'border-[#d96757]' : 'border-line'}`}
                {...register('region', {
                  required: 'Enter your city or region.',
                })}
              />
              {errors.region && (
                <p className="mt-1.5 text-xs font-medium text-[#c8584b]">
                  {errors.region.message}
                </p>
              )}
            </div>
            <SelectField
              label="Climate zone"
              error={errors.climateZone?.message}
              {...register('climateZone', {
                required: 'Select a climate zone.',
              })}
            >
              <option value="">Choose a climate zone</option>
              <option>Hot & dry</option>
              <option>Warm & humid</option>
              <option>Temperate</option>
              <option>Cool & mild</option>
              <option>Tropical</option>
            </SelectField>
            <SelectField
              label="Planting season"
              error={errors.season?.message}
              {...register('season', { required: 'Select a season.' })}
            >
              <option>Spring</option>
              <option>Summer</option>
              <option>Autumn</option>
              <option>Winter</option>
            </SelectField>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-6">
            <SelectField
              label="Soil type"
              error={errors.soilType?.message}
              {...register('soilType', { required: 'Select your soil type.' })}
            >
              <option value="">Choose your soil type</option>
              <option>Loamy</option>
              <option>Sandy</option>
              <option>Clay</option>
              <option>Silty</option>
              <option>Potting mix</option>
            </SelectField>
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold text-ink">
                Available space
              </legend>
              <div className="grid grid-cols-2 gap-2">
                {(
                  ['Balcony', 'Small Garden', 'Large Garden', 'Farm'] as const
                ).map((option) =>
                  buttonOption(
                    'availableSpace',
                    option,
                    values.availableSpace === option,
                  ),
                )}
              </div>
            </fieldset>
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold text-ink">
                Sunlight exposure
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(['Low light', 'Partial sun', 'Full sun'] as const).map(
                  (option) =>
                    buttonOption(
                      'sunlightExposure',
                      option,
                      values.sunlightExposure === option,
                    ),
                )}
              </div>
            </fieldset>
            <Controller
              control={control}
              name="waterAvailability"
              rules={{ min: 10 }}
              render={({ field }) => (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <FieldLabel htmlFor="water-availability">
                      Water availability
                    </FieldLabel>
                    <span className="rounded-lg bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand-dark">
                      {field.value}%
                    </span>
                  </div>
                  <input
                    aria-label="Water availability"
                    id="water-availability"
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-soft accent-brand"
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-muted">
                    <span>Limited</span>
                    <span>Reliable</span>
                  </div>
                </div>
              )}
            />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold text-ink">
                Gardening experience
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {(['Beginner', 'Intermediate', 'Experienced'] as const).map(
                  (option) =>
                    buttonOption(
                      'gardeningExperience',
                      option,
                      values.gardeningExperience === option,
                    ),
                )}
              </div>
            </fieldset>
            <Controller
              control={control}
              name="budget"
              render={({ field }) => (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <FieldLabel htmlFor="monthly-budget">
                      Monthly budget
                    </FieldLabel>
                    <span className="rounded-lg bg-brand-soft px-2 py-1 text-[11px] font-bold text-brand-dark">
                      ${field.value}
                    </span>
                  </div>
                  <input
                    aria-label="Monthly budget"
                    id="monthly-budget"
                    type="range"
                    min="10"
                    max="200"
                    step="10"
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-brand-soft accent-brand"
                  />
                  <div className="mt-2 flex justify-between text-[10px] font-medium text-muted">
                    <span>Simple essentials</span>
                    <span>Fully equipped</span>
                  </div>
                </div>
              )}
            />
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold text-ink">
                Preferred plant type
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(
                  [
                    'Vegetables',
                    'Fruits',
                    'Herbs',
                    'Flowers',
                    'Indoor Plants',
                  ] as const
                ).map((option) =>
                  buttonOption(
                    'preferredPlantType',
                    option,
                    values.preferredPlantType === option,
                  ),
                )}
              </div>
            </fieldset>
          </div>
        )}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
          {step > 0 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep((current) => current - 1)}
              leftIcon={<ArrowLeft size={16} />}
            >
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <Button type="button" onClick={next}>
              Continue <ArrowRight size={16} />
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoaderCircle size={16} className="animate-spin" />}
              {isLoading
                ? 'Finding your plants...'
                : 'Generate recommendations'}
              <SparklesMark />
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

function SparklesMark() {
  return <span className="text-sm">✦</span>;
}
