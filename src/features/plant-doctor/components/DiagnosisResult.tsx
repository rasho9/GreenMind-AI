import { motion } from 'framer-motion';
import {
  BellRing,
  BookmarkCheck,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Droplets,
  FlaskConical,
  Leaf,
  Download,
  Share2,
  Sun,
  WandSparkles,
} from 'lucide-react';
import { Badge, Button, Card, SectionHeader } from '@/components/ui';
import { MarketplaceRecommendationBundle } from '@/features/marketplace/components';
import { marketplaceService } from '@/features/marketplace/services/marketplaceService';
import { HealthScore } from './HealthScore';
import type { PlantDoctorAnalysis } from '../types';
import type { ReportAction } from '../services/scanExportService';

type DiagnosisResultProps = {
  analysis: PlantDoctorAnalysis;
  onReport: (action: ReportAction) => void;
};

const statusStyles = {
  Healthy: 'status-success',
  Warning: 'status-warning',
  Critical: 'status-danger',
};

function AdviceCard({
  icon: Icon,
  label,
  detail,
}: {
  icon: typeof Droplets;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-[18px] border border-line bg-canvas/55 p-4">
      <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon size={17} />
      </span>
      <p className="mt-3 text-xs font-extrabold">{label}</p>
      <p className="mt-1.5 text-xs leading-5 text-muted">{detail}</p>
    </div>
  );
}

function CareList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[18px] border border-line bg-surface p-4">
      <p className="text-xs font-extrabold">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-xs leading-5 text-muted">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-brand" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DiagnosisResult({ analysis, onReport }: DiagnosisResultProps) {
  const marketplaceRecommendation = marketplaceService.recommend({
    source: 'plant-doctor',
    plants: [analysis.plantName],
    disease: analysis.diseaseName,
  });
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="mt-9 space-y-6"
    >
      <SectionHeader
        eyebrow="AI diagnosis complete"
        title="Your plant health report"
        description="A structured visual screening with clear treatment and recovery actions."
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => onReport('PDF')}
              leftIcon={<Download size={17} />}
            >
              Download PDF
            </Button>
            <Button
              variant="secondary"
              onClick={() => onReport('Save')}
              leftIcon={<BookmarkCheck size={17} />}
            >
              Save Report
            </Button>
            <Button
              variant="secondary"
              onClick={() => onReport('Share')}
              leftIcon={<Share2 size={17} />}
            >
              Share Report
            </Button>
            <Button
              onClick={() => onReport('Reminder')}
              leftIcon={<BellRing size={17} />}
            >
              Add Reminder
            </Button>
          </div>
        }
      />
      <Card className="relative overflow-hidden bg-[radial-gradient(circle_at_88%_12%,rgb(var(--brand-soft)/.9),transparent_27%),linear-gradient(135deg,rgb(var(--surface)),rgb(var(--canvas)))] p-5 sm:p-7">
        <div className="absolute -right-10 bottom-0 size-40 rounded-full bg-brand-soft/45 blur-2xl" />
        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-5">
            <HealthScore
              score={analysis.healthScore}
              status={analysis.status}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={statusStyles[analysis.status]}>
                  {analysis.status}
                </Badge>
                <span className="text-[11px] font-bold text-muted">
                  {analysis.severity} severity - {analysis.overallHealth}{' '}
                  overall health
                </span>
              </div>
              <p className="mt-3 text-[13px] font-bold uppercase tracking-[0.11em] text-brand">
                Disease detection
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.045em] sm:text-3xl">
                {analysis.diseaseName}
              </h3>
              <p className="mt-1 text-sm font-semibold text-brand-dark">
                {analysis.plantName}{' '}
                <span className="font-normal text-muted">
                  - {analysis.plantPart} screening
                </span>
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                {analysis.description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:min-w-[245px]">
            <div className="rounded-[16px] border border-line bg-surface/75 p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                Confidence
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-brand-dark">
                {analysis.confidence}%
              </p>
            </div>
            <div className="rounded-[16px] border border-line bg-surface/75 p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                Overall health
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-brand-dark">
                {analysis.overallHealth}
              </p>
            </div>
            <div className="col-span-2 rounded-[16px] border border-brand/15 bg-brand-soft/55 px-3.5 py-3 text-xs font-semibold text-brand-dark">
              Diagnosis confidence {analysis.confidence}% - Recovery outlook{' '}
              {analysis.recoveryPercentage}%
            </div>
          </div>
        </div>
      </Card>

      <MarketplaceRecommendationBundle
        recommendation={marketplaceRecommendation}
        title="Recommended products for this screening"
        description={`A treatment-aware selection for ${analysis.diseaseName}, paired with your recovery and prevention guidance.`}
        marketplaceLabel="Open in AI Marketplace"
      />

      <div className="grid gap-5 xl:grid-cols-[1.02fr_.98fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <WandSparkles size={19} />
            </span>
            <div>
              <p className="text-[15px] font-extrabold tracking-[-0.025em]">
                GPT-5.6 insights
              </p>
              <p className="mt-1 text-xs text-muted">
                A provider-neutral narrative field, ready for vision
                integration.
              </p>
            </div>
          </div>
          <blockquote className="mt-5 rounded-[17px] border border-brand/15 bg-brand-soft/38 p-4 text-sm leading-6 text-brand-dark">
            “{analysis.gptInsight}”
          </blockquote>
          <div className="mt-5">
            <p className="text-xs font-extrabold">Detected symptoms</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.symptoms.map((symptom) => (
                <span
                  key={symptom}
                  className="status-warning rounded-lg px-2.5 py-1.5 text-[11px] font-semibold"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-5">
            <p className="text-xs font-extrabold">Likely causes</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {analysis.possibleCauses.map((cause) => (
                <span
                  key={cause}
                  className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-muted"
                >
                  {cause}
                </span>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="text-[15px] font-extrabold tracking-[-0.025em]">
            Care conditions
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
            <AdviceCard
              icon={Droplets}
              label="Watering"
              detail={analysis.wateringAdvice}
            />
            <AdviceCard
              icon={Sun}
              label="Sunlight"
              detail={analysis.sunlightAdvice}
            />
            <AdviceCard
              icon={FlaskConical}
              label="Fertilizer"
              detail={analysis.fertilizerAdvice}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <CareList title="Treatment plan" items={analysis.treatmentPlan} />
        <CareList title="Organic treatment" items={analysis.organicTreatment} />
        <CareList
          title="Chemical treatment"
          items={analysis.chemicalTreatment}
        />
      </div>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[15px] font-extrabold tracking-[-0.025em]">
              Treatment timeline
            </p>
            <p className="mt-1 text-xs text-muted">
              A calm, measurable recovery sequence over the next 30 days.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark">
            <CalendarDays size={15} /> Expected recovery:{' '}
            {analysis.recoveryTime}
          </span>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {analysis.timeline.map((milestone, index) => (
            <div
              key={milestone.day}
              className="relative rounded-[17px] border border-line bg-canvas/52 p-3.5"
            >
              <span className="grid size-7 place-items-center rounded-full bg-brand text-[10px] font-extrabold text-white">
                {index + 1}
              </span>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.09em] text-brand">
                {milestone.day}
              </p>
              <p className="mt-1.5 text-xs font-extrabold">{milestone.title}</p>
              <p className="mt-1.5 text-[11px] leading-5 text-muted">
                {milestone.detail}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-brand/15 bg-brand-soft/34 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-surface text-brand shadow-sm">
              <Leaf size={19} />
            </span>
            <div>
              <p className="text-sm font-extrabold">Prevention checklist</p>
              <ul className="mt-3 space-y-2">
                {analysis.preventionTips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-sm text-muted">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-brand"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark">
            <CircleAlert size={15} /> Monitor for spreading spots
          </span>
        </div>
      </Card>
      <p className="status-warning rounded-xl px-4 py-3 text-sm leading-6">
        <b>Important disclaimer:</b> This diagnosis is AI-generated and should
        be verified by an agricultural expert before applying chemicals.
      </p>
    </motion.section>
  );
}
