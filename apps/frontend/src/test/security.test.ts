import { describe, expect, it } from 'vitest';
import { mockIntentService } from '../services/intent';
import { mockPolicyService, mockSimulationService, mockRiskService } from '../services/security';

describe('mock security services', () => {
  it('keeps AI output as an unvalidated draft', async () => {
    const result = await mockIntentService.generate('Send 0.05 ETH to 0x1234');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.intent.amount).toBe('0.05');
      expect(result.notices).toContain('Illustrative AI draft');
    }
  });

  it('requires an evaluation context before simulation', async () => {
    await expect(mockSimulationService.simulate('intent_test', '')).rejects.toThrow();
  });

  it('returns an explicit mock policy evaluation', async () => {
    const result = await mockPolicyService.evaluate('intent_test');
    expect(result.intentId).toBe('intent_test');
    expect(result.decision).toBe('allow');
  });

  it('returns advisory risk findings rather than a safety guarantee', async () => {
    const result = await mockRiskService.analyze('sim_test');
    expect(result.classification).toBe('low');
    expect(result.findings.length).toBeGreaterThan(0);
  });
});
