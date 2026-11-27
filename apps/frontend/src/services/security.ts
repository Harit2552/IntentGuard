export type PolicyDecision = 'allow' | 'deny' | 'indeterminate';

export type PolicyEvaluation = {
  evaluationId: string;
  intentId: string;
  decision: PolicyDecision;
  evaluatedAt: string;
  contextVersion: string;
  findings: Array<{ code: string; severity: 'info' | 'warning' | 'block'; message: string }>;
};

export type SimulationResult = {
  simulationId: string;
  status: 'succeeded' | 'failed' | 'unknown';
  simulatedAt: string;
  gasEstimate: string;
  affectedAssets: Array<{ asset: string; change: string }>;
  warnings: string[];
};

export type RiskResult = {
  analysisId: string;
  classification: 'low' | 'moderate' | 'high' | 'unknown';
  analyzedAt: string;
  findings: Array<{ severity: 'info' | 'warning' | 'critical'; title: string; evidence: string }>;
};

export interface PolicyService {
  evaluate(intentId: string): Promise<PolicyEvaluation>;
  listRules(): Promise<Array<{ name: string; limit: string; enabled: boolean }>>;
}

export interface SimulationService {
  simulate(intentId: string, evaluationId: string): Promise<SimulationResult>;
}

export interface RiskService {
  analyze(simulationId: string): Promise<RiskResult>;
}

export const mockPolicyService: PolicyService = {
  async evaluate(intentId) {
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    return {
      evaluationId: `eval_${intentId}`,
      intentId,
      decision: 'allow',
      evaluatedAt: new Date().toISOString(),
      contextVersion: 'mock-policy-v4',
      findings: [
        { code: 'DAILY_LIMIT', severity: 'info', message: 'Request remains within the configured daily limit.' },
        { code: 'RECIPIENT_ALLOWLIST', severity: 'info', message: 'Recipient is outside a restricted contract allowance.' },
      ],
    };
  },
  async listRules() {
    return [
      { name: 'Daily transfer limit', limit: '1.00 ETH', enabled: true },
      { name: 'Weekly spending limit', limit: '5.00 ETH', enabled: true },
      { name: 'Contract allowlist', limit: 'Trusted contracts only', enabled: true },
      { name: 'New recipient approval', limit: 'Manual review', enabled: true },
    ];
  },
};

export const mockSimulationService: SimulationService = {
  async simulate(intentId, evaluationId) {
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    if (!evaluationId) throw new Error('A policy evaluation is required before simulation.');
    return {
      simulationId: `sim_${intentId}`,
      status: 'succeeded',
      simulatedAt: new Date().toISOString(),
      gasEstimate: '0.0021 ETH',
      affectedAssets: [
        { asset: 'ETH', change: '-0.0521 ETH' },
        { asset: 'ETH', change: '+0.05 ETH to recipient' },
      ],
      warnings: ['Gas estimate is advisory and may change before execution.'],
    };
  },
};

export const mockRiskService: RiskService = {
  async analyze(simulationId) {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    return {
      analysisId: `risk_${simulationId}`,
      classification: 'low',
      analyzedAt: new Date().toISOString(),
      findings: [
        { severity: 'info', title: 'Native token transfer', evidence: 'No contract call or calldata was detected in the illustrative draft.' },
        { severity: 'info', title: 'Recipient context', evidence: 'No verified malicious address finding was returned by the mock backend.' },
        { severity: 'warning', title: 'Review limits', evidence: 'Risk output is advisory and not a substitute for policy or user approval.' },
      ],
    };
  },
};
