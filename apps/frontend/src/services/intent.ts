export type StructuredIntent = {
  id: string;
  operation: 'transfer';
  asset: 'ETH';
  amount: string;
  recipient: string;
  network: 'Ethereum Mainnet';
  limit: string;
  draftVersion: number;
};

export type IntentResult =
  | { ok: true; intent: StructuredIntent; message: string; notices: string[] }
  | { ok: false; error: string };

export interface IntentService {
  generate(prompt: string): Promise<IntentResult>;
}

export const mockIntentService: IntentService = {
  async generate(prompt) {
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    const transferMatch = prompt.match(/([0-9]+(?:\.[0-9]+)?)\s*ETH/i);
    const addressMatch = prompt.match(/0x[a-fA-F0-9]{4,}/);
    if (!transferMatch || !prompt.toLowerCase().includes('transfer') && !prompt.toLowerCase().includes('send')) {
      return { ok: false, error: 'This mock assistant could not identify a supported ETH transfer instruction.' };
    }
    return {
      ok: true,
      intent: {
        id: `intent_${Date.now().toString(36)}`,
        operation: 'transfer',
        asset: 'ETH',
        amount: transferMatch[1],
        recipient: addressMatch?.[0] ?? '0x1234...recipient',
        network: 'Ethereum Mainnet',
        limit: prompt.toLowerCase().includes('daily') ? 'Daily limit applied' : 'No explicit limit provided',
        draftVersion: 1,
      },
      message: 'I parsed an ETH transfer draft. Review it carefully; this draft has not passed policy validation or authorized any transaction.',
      notices: ['Illustrative AI draft', 'Recipient format must be confirmed', 'Authoritative policy evaluation is pending'],
    };
  },
};
