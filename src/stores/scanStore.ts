import { create } from 'zustand';
import type {
  AnalysisDraft,
  AnalysisResult,
  PipelineStage,
  RiskLevel,
  ScanType,
} from '../types';
import {
  clearAnalysesInSupabase,
  fetchAnalysesFromSupabase,
  persistAnalysisToSupabase,
} from '../lib/analysesApi';

interface ScanState {
  scans: AnalysisResult[];
  isLoading: boolean;
  loadError: string | null;
  isScanning: boolean;
  currentScanId: string | null;
  currentPipelineStage: PipelineStage | null;
  pipelineProgress: number;
  currentUserId: string | null;
  hasLoadedForCurrentUser: boolean;
  loadScans: () => Promise<void>;
  saveScan: (draft: AnalysisDraft) => Promise<AnalysisResult>;
  resetForUser: (userId: string | null) => void;
  setScanning: (scanning: boolean) => void;
  setCurrentScanId: (id: string | null) => void;
  setCurrentPipelineStage: (stage: PipelineStage | null) => void;
  setPipelineProgress: (progress: number) => void;
  getScanById: (id: string) => AnalysisResult | undefined;
  getScansByType: (type: ScanType) => AnalysisResult[];
  getScansByRiskLevel: (level: RiskLevel) => AnalysisResult[];
  clearHistory: () => Promise<void>;
}

let hydrationRequestId = 0;

export const useScanStore = create<ScanState>((set, get) => ({
  scans: [],
  isLoading: false,
  loadError: null,
  isScanning: false,
  currentScanId: null,
  currentPipelineStage: null,
  pipelineProgress: 0,
  currentUserId: null,
  hasLoadedForCurrentUser: false,

  loadScans: async () => {
    const userIdAtStart = get().currentUserId;

    if (!userIdAtStart) {
      set({
        scans: [],
        isLoading: false,
        loadError: null,
        hasLoadedForCurrentUser: false,
      });
      return;
    }

    if (get().hasLoadedForCurrentUser || get().isLoading) return;

    const requestId = ++hydrationRequestId;
    set({ isLoading: true, loadError: null });

    try {
      const data = await fetchAnalysesFromSupabase();
      const current = get();

      if (
        current.currentUserId !== userIdAtStart ||
        requestId !== hydrationRequestId
      ) return;

      set({
        scans: data,
        isLoading: false,
        loadError: null,
        hasLoadedForCurrentUser: true,
      });
    } catch (error) {
      const current = get();

      if (
        current.currentUserId !== userIdAtStart ||
        requestId !== hydrationRequestId
      ) return;

      set({
        scans: [],
        isLoading: false,
        loadError:
          error instanceof Error
            ? error.message
            : 'Could not load your analyses.',
        hasLoadedForCurrentUser: false,
      });
    }
  },

  saveScan: async (draft) => {
    const userIdAtStart = get().currentUserId;
    if (!userIdAtStart) {
      throw new Error('You must be authenticated to save an analysis.');
    }

    const persisted = await persistAnalysisToSupabase(draft);
    const current = get();

    // Never attach a completed request to a different user's client state.
    if (current.currentUserId === userIdAtStart) {
      set((state) => ({
        scans: [
          persisted,
          ...state.scans.filter((scan) => scan.id !== persisted.id),
        ],
        loadError: null,
        hasLoadedForCurrentUser: true,
      }));
    }

    return persisted;
  },

  resetForUser: (userId) => {
    hydrationRequestId += 1;
    set({
      scans: [],
      isLoading: false,
      loadError: null,
      isScanning: false,
      currentScanId: null,
      currentPipelineStage: null,
      pipelineProgress: 0,
      currentUserId: userId,
      hasLoadedForCurrentUser: false,
    });
  },

  setScanning: (isScanning) => set({ isScanning }),

  setCurrentScanId: (currentScanId) => set({ currentScanId }),

  setCurrentPipelineStage: (currentPipelineStage) =>
    set({ currentPipelineStage }),

  setPipelineProgress: (progress) =>
    set({
      pipelineProgress: Math.max(0, Math.min(100, progress)),
    }),

  getScanById: (id) => get().scans.find((scan) => scan.id === id),

  getScansByType: (type) =>
    get().scans.filter((scan) => scan.scanType === type),

  getScansByRiskLevel: (level) =>
    get().scans.filter((scan) => scan.riskLevel === level),

  clearHistory: async () => {
    const userIdAtStart = get().currentUserId;
    if (!userIdAtStart) {
      throw new Error('You must be authenticated to clear analysis history.');
    }

    await clearAnalysesInSupabase();

    if (get().currentUserId !== userIdAtStart) return;

    set({
      scans: [],
      loadError: null,
      hasLoadedForCurrentUser: true,
    });
  },
}));
      
