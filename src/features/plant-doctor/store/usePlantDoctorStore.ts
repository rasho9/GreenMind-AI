import { create } from 'zustand';
import { structuredMockAnalysis } from '../services/plantDoctorService';
import type { PlantScan } from '../types';

const initialScans: PlantScan[] = [
  {
    id: 'scan-tomato-0714',
    filename: 'tomato-leaf.jpg',
    date: '14 Jul 2026',
    favorite: true,
    analysis: { ...structuredMockAnalysis },
  },
  {
    id: 'scan-basil-0710',
    filename: 'tomato-canopy.jpg',
    date: '10 Jul 2026',
    favorite: false,
    analysis: {
      ...structuredMockAnalysis,
      plantName: 'Roma Tomato',
      scientificName: 'Solanum lycopersicum',
    },
  },
];

type PlantDoctorState = {
  scans: PlantScan[];
  addScan: (scan: PlantScan) => void;
  deleteScan: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

/** Session-level scan history; replace with authenticated persistence when the backend is ready. */
export const usePlantDoctorStore = create<PlantDoctorState>((set) => ({
  scans: initialScans,
  addScan: (scan) => set((state) => ({ scans: [scan, ...state.scans] })),
  deleteScan: (id) =>
    set((state) => ({ scans: state.scans.filter((scan) => scan.id !== id) })),
  toggleFavorite: (id) =>
    set((state) => ({
      scans: state.scans.map((scan) =>
        scan.id === id ? { ...scan, favorite: !scan.favorite } : scan,
      ),
    })),
}));
