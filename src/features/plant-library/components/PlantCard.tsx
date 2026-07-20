import { ArrowRight, Bookmark, Heart, Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge, Card } from '@/components/ui';
import type { Plant } from '../types';
import { PlantVisual } from './PlantVisual';

const difficultyTone = {
  Easy: 'bg-[#e4f3e8] text-[#237245]',
  Moderate: 'bg-[#f6efd8] text-[#93712e]',
  Advanced: 'bg-[#f7e4df] text-[#a64e42]',
};

type PlantCardProps = {
  plant: Plant;
  favorite: boolean;
  bookmarked: boolean;
  compared: boolean;
  compareDisabled: boolean;
  onFavorite: () => void;
  onBookmark: () => void;
  onCompare: () => void;
};

export function PlantCard({
  plant,
  favorite,
  bookmarked,
  compared,
  compareDisabled,
  onFavorite,
  onBookmark,
  onCompare,
}: PlantCardProps) {
  return (
    <motion.article
      layout
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
    >
      <Card className="group h-full overflow-hidden p-3 transition-shadow duration-300 hover:shadow-elevated">
        <PlantVisual plant={plant} />
        <div className="px-2 pb-2 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-extrabold tracking-[-0.03em]">
                {plant.name}
              </h3>
              <p className="mt-1 truncate text-[11px] italic text-muted">
                {plant.scientificName}
              </p>
            </div>
            {plant.source === 'provider' ? (
              <Badge className="shrink-0 bg-brand-soft text-brand-dark">
                Live data
              </Badge>
            ) : (
              <Badge className="shrink-0 bg-brand-soft text-brand-dark">
                {plant.suitability}%
              </Badge>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className={`rounded-lg px-2 py-1 text-[10px] font-bold ${difficultyTone[plant.difficulty]}`}
            >
              {plant.difficulty}
            </span>
            <span className="rounded-lg bg-canvas px-2 py-1 text-[10px] font-semibold text-muted">
              {plant.category}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-muted">
            {plant.description}
          </p>
          <div className="mt-4 flex items-center justify-between gap-1">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={onFavorite}
                className={`focus-ring grid size-8 place-items-center rounded-lg border transition-colors ${favorite ? 'border-[#e7bbb6] bg-[#fff1ef] text-[#c85b50]' : 'border-line text-muted hover:border-[#e7bbb6] hover:text-[#c85b50]'}`}
                aria-label={
                  favorite
                    ? `Remove ${plant.name} from favorites`
                    : `Favorite ${plant.name}`
                }
              >
                <Heart size={15} fill={favorite ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={onBookmark}
                className={`focus-ring grid size-8 place-items-center rounded-lg border transition-colors ${bookmarked ? 'border-brand/30 bg-brand-soft text-brand-dark' : 'border-line text-muted hover:border-brand/30 hover:text-brand-dark'}`}
                aria-label={
                  bookmarked
                    ? `Remove ${plant.name} bookmark`
                    : `Bookmark ${plant.name}`
                }
              >
                <Bookmark
                  size={15}
                  fill={bookmarked ? 'currentColor' : 'none'}
                />
              </button>
              <button
                type="button"
                onClick={onCompare}
                disabled={compareDisabled && !compared}
                className={`focus-ring grid size-8 place-items-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${compared ? 'border-brand bg-brand text-white' : 'border-line text-muted hover:border-brand/30 hover:text-brand-dark'}`}
                aria-label={
                  compared
                    ? `Remove ${plant.name} from comparison`
                    : `Compare ${plant.name}`
                }
              >
                <Scale size={15} />
              </button>
            </div>
            <Link
              to={`/plant-library/${plant.id}`}
              className="focus-ring inline-flex items-center gap-1 rounded-lg px-1 text-[11px] font-bold text-brand transition-colors hover:text-brand-dark"
            >
              View details <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}
