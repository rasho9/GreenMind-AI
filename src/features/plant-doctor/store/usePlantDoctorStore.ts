import { create } from 'zustand';
import type { PlantScan } from '../types';

type PlantDoctorState = {
  scans: PlantScan[];
  addScan: (scan: PlantScan) => void;
  deleteScan: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

/** Session-level scan history; replace with authenticated persistence when the backend is ready. */
export const usePlantDoctorStore = create<PlantDoctorState>((set) => ({
  scans: [],
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
