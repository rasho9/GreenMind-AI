import { Database, ShieldCheck } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import { diseaseDatabase } from '../types';

export function DiseaseDatabase() {
  return (
    <section className="mt-9">
      <SectionHeader
        eyebrow="Knowledge foundation"
        title="Plant health database"
        description="Common issues modelled as structured data for a future diagnostic provider."
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {diseaseDatabase.map((disease) => (
          <Card
            key={disease.id}
            className="group p-4 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="grid size-8 place-items-center rounded-xl bg-brand-soft text-brand">
                <Database size={15} />
              </span>
              <span className="rounded-full bg-canvas px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-muted">
                {disease.category}
              </span>
            </div>
            <p className="mt-4 text-sm font-extrabold tracking-[-0.02em]">
              {disease.name}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-muted">
              {disease.symptoms.join(' · ')}
            </p>
            <p className="mt-3 flex gap-1.5 text-[10px] leading-4 text-brand-dark">
              <ShieldCheck size={13} className="mt-0.5 shrink-0 text-brand" />{' '}
              {disease.prevention}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
