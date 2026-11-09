import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  FileText,
  Globe,
  Shield,
  Upload,
} from 'lucide-react';
import { Button, Card, CardContent, CardHeader } from '../components/ui';
import { useScanStore } from '../stores/scanStore';
import { useSettingsStore } from '../stores/settingsStore';
import { runAIAnalysis } from '../lib/aiService';
import { formatDate } from '../lib/utils';
import {
  PIPELINE_STAGES_ORDER,
  PIPELINE_STAGE_LABELS,
  type AnalysisDraft,
  type AnalysisResult,
  type PipelineStage,
  type ScanType,
} from '../types';

const scanModes: Array<{
  value: ScanType;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  { value: 'text', label: 'Text', description: 'Messages, emails and pasted content', icon: FileText },
  { value: 'url', label: 'URL', description: 'A link or domain to assess', icon: Globe },
];

function getRiskPresentation(level: AnalysisResult['riskLevel']) {
  if (level === 'high_risk') {
    return { label: 'High risk', className: 'text-danger-red bg-danger-red/10 border-danger-red/20' };
  }
  if (level === 'suspicious') {
    return { label: 'Suspicious', className: 'text-warning-amber bg-warning-amber/10 border-warning-amber/20' };
  }
  return { label: 'Safe', className: 'text-success-emerald bg-success-emerald/10 border-success-emerald/20' };
}

export function ScanCentrePage() {
  const [scanType, setScanType] = useState<ScanType>('text');
  const [inputContent, setInputContent] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeStage, setActiveStage] = useState<PipelineStage | null>(null);

  const { saveScan, setScanning, setCurrentPipelineStage, setPipelineProgress } = useScanStore();
  const { settings } = useSettingsStore();

  const trimmedContent = inputContent.trim();
  const isReady = trimmedContent.length > 0 && !isRunning;
  const risk = result ? getRiskPresentation(result.riskLevel) : null;

  const stageRows = useMemo(() => {
    if (!result) return [];
    return PIPELINE_STAGES_ORDER.map((stage) => ({
      stage,
      duration: result.pipelineStages[stage]?.durationMs,
      completed: result.pipelineStages[stage]?.status === 'completed',
    }));
  }, [result]);

  const handleTypeChange = (nextType: ScanType) => {
    setScanType(nextType);
    setInputContent('');
    setResult(null);
    setError(null);
  };

  const handleAnalyse = async () => {
    if (!trimmedContent || isRunning) return;

    setIsRunning(true);
    setScanning(true);
    setError(null);
    setResult(null);
    setActiveStage('INGESTING');
    setCurrentPipelineStage('INGESTING');
    setPipelineProgress(0);

    try {
      // Provider calls run in the Supabase Edge Function. No API key is read
      // from browser state or passed from this page.
      const analysis = await runAIAnalysis(
        trimmedContent,
        scanType,
        settings.aiProvider,
      );

      const pipelineStages: AnalysisDraft['pipelineStages'] = {};
      for (const stage of PIPELINE_STAGES_ORDER) {
        const duration = analysis.stageDurations[stage];
        if (typeof duration === 'number') {
          pipelineStages[stage] = { status: 'completed', durationMs: duration };
        }
      }
      pipelineStages.COMPLETE = { status: 'completed' };

      const draft: AnalysisDraft = {
        scanType,
        inputContent: trimmedContent,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        threatIndicators: analysis.threatIndicators,
        aiExplanation: analysis.aiExplanation,
        recommendedAction: analysis.recommendedAction,
        confidenceLevel: analysis.confidenceLevel,
        pipelineStages,
      };

      setActiveStage('REPORT_GENERATION');
      setCurrentPipelineStage('REPORT_GENERATION');
      setPipelineProgress(90);

      // The database returns the authoritative ID, owner and timestamp.
      const persisted = await saveScan(draft);
      setResult(persisted);
      setActiveStage('COMPLETE');
      setCurrentPipelineStage('COMPLETE');
      setPipelineProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The analysis could not be completed.');
      setActiveStage('ERROR');
      setCurrentPipelineStage('ERROR');
    } finally {
      setIsRunning(false);
      setScanning(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Scan Centre</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Submit content for server-side AI analysis and save the verified result to your history.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-text-primary">New analysis</h2>
            <p className="mt-1 text-xs text-text-muted">Choose an input type and provide the content to inspect.</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-2">
              {scanModes.map((mode) => {
                const Icon = mode.icon;
                const selected = scanType === mode.value;
                return (
                  <button
                    key={mode.value}
                    type="button"
                    onClick={() => handleTypeChange(mode.value)}
                    disabled={isRunning}
                    aria-pressed={selected}
                    className={`rounded-xl border p-3 text-left transition-colors ${
                      selected
                        ? 'border-accent-blue/40 bg-accent-blue/10'
                        : 'border-border-subtle bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className={`mb-2 h-5 w-5 ${selected ? 'text-accent-blue' : 'text-text-muted'}`} />
                    <span className="block text-sm font-medium text-text-primary">{mode.label}</span>
                    <span className="mt-1 block text-xs text-text-muted">{mode.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <label htmlFor="scan-content" className="block text-sm font-medium text-text-secondary">
                {scanType === 'url' ? 'URL or domain' : 'Content to analyse'}
              </label>
              <textarea
                id="scan-content"
                value={inputContent}
                onChange={(event) => setInputContent(event.target.value)}
                disabled={isRunning}
                rows={9}
                maxLength={20000}
                placeholder={
                  scanType === 'url'
                    ? 'https://example.com'
                    : 'Paste the suspicious message, email, or other text here…'
                }
                className="w-full resize-y rounded-xl border border-border-subtle bg-white/[0.04] px-3 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted/60 focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 disabled:opacity-60"
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>Maximum 20,000 characters</span>
                <span>{trimmedContent.length.toLocaleString()} characters</span>
              </div>
            </div>

            <div className="rounded-lg border border-warning-amber/20 bg-warning-amber/5 p-3 text-xs text-text-secondary">
              <div className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-amber" />
                <p>
                  Image, PDF and Office-document extraction is not enabled. Do not upload or rely on
                  simulated OCR output; only the text entered above is analysed.
                </p>
              </div>
            </div>

            {error && (
              <div role="alert" className="rounded-lg border border-danger-red/20 bg-danger-red/10 p-3 text-sm text-danger-red">
                {error}
              </div>
            )}

            <Button onClick={handleAnalyse} loading={isRunning} disabled={!isReady} className="w-full">
              {isRunning ? 'Analysing and saving…' : 'Run analysis'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isRunning && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-text-primary">Analysis in progress</h2>
                <p className="mt-1 text-xs text-text-muted">Waiting for the server-side analysis and persistence steps.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {PIPELINE_STAGES_ORDER.map((stage) => (
                  <div key={stage} className="flex items-center gap-3 text-sm">
                    {activeStage === stage ? (
                      <Brain className="h-4 w-4 animate-pulse text-accent-blue" />
                    ) : (
                      <Shield className="h-4 w-4 text-text-muted" />
                    )}
                    <span className={activeStage === stage ? 'text-text-primary' : 'text-text-muted'}>
                      {PIPELINE_STAGE_LABELS[stage]}
                    </span>
                  </div>
                ))}
                <p className="pt-2 text-xs text-text-muted">
                  Stage timings are shown only when returned by the analysis service; the interface does not invent them.
                </p>
              </CardContent>
            </Card>
          )}

          {result && risk && (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-text-primary">Analysis result</h2>
                    <p className="mt-1 text-xs text-text-muted">Saved {formatDate(result.createdAt)}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${risk.className}`}>
                    {risk.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-text-primary">{result.riskScore}</span>
                  <span className="pb-1 text-sm text-text-muted">/ 100 risk score</span>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">AI explanation</h3>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">{result.aiExplanation}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">Recommended action</h3>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">{result.recommendedAction}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                  <span>Confidence: {(result.confidenceLevel * 100).toFixed(0)}%</span>
                  <span>Type: {result.scanType}</span>
                  <span>ID: {result.id}</span>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-text-primary">Threat indicators</h3>
                  {result.threatIndicators.length ? (
                    <ul className="space-y-2">
                      {result.threatIndicators.map((indicator, index) => (
                        <li key={`${indicator.name}-${index}`} className="rounded-lg border border-border-subtle p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-text-primary">{indicator.name}</span>
                            <span className="text-xs text-text-muted">{indicator.detected ? indicator.severity : 'Not detected'}</span>
                          </div>
                          <p className="mt-1 text-xs text-text-secondary">{indicator.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-text-muted">No threat indicators were returned.</p>
                  )}
                </div>
                {stageRows.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-text-primary">Reported pipeline timings</h3>
                    <ul className="space-y-1">
                      {stageRows.filter((row) => row.duration !== undefined).map((row) => (
                        <li key={row.stage} className="flex justify-between text-xs text-text-muted">
                          <span className="flex items-center gap-2">
                            <CheckCircle className="h-3.5 w-3.5 text-success-emerald" />
                            {PIPELINE_STAGE_LABELS[row.stage]}
                          </span>
                          <span>{row.duration} ms</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!isRunning && !result && !error && (
            <Card>
              <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
                <Upload className="mb-3 h-8 w-8 text-text-muted" />
                <h2 className="text-sm font-semibold text-text-primary">Ready for input</h2>
                <p className="mt-1 max-w-xs text-xs text-text-muted">
                  Your completed analysis will appear here after the server returns a valid result and the database confirms it was saved.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
                  }
