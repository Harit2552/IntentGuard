export type ActivityStatus = 'Confirmed' | 'Pending' | 'Blocked' | 'Reverted';

export type ActivityRecord = {
  id: string;
  date: string;
  operation: string;
  network: string;
  amount: string;
  status: ActivityStatus;
  policy: 'Allowed' | 'Denied' | 'Not evaluated';
  risk: 'Low' | 'Moderate' | 'Unknown';
  transactionHash?: string;
};

export const sampleActivity: ActivityRecord[] = [
  { id: 'TX-2026-1048', date: '2026-11-26T20:42:00+05:30', operation: 'USDC transfer', network: 'Ethereum', amount: '250.00 USDC', status: 'Confirmed', policy: 'Allowed', risk: 'Low', transactionHash: '0x8e3f...2a91' },
  { id: 'TX-2026-1047', date: '2026-11-26T18:10:00+05:30', operation: 'ETH transfer', network: 'Ethereum', amount: '0.05 ETH', status: 'Pending', policy: 'Allowed', risk: 'Low', transactionHash: '0x3bb1...91ef' },
  { id: 'TX-2026-1046', date: '2026-11-26T15:33:00+05:30', operation: 'Contract approval', network: 'Base', amount: 'Unlimited USDC', status: 'Blocked', policy: 'Denied', risk: 'Moderate' },
  { id: 'TX-2026-1045', date: '2026-11-25T22:08:00+05:30', operation: 'ETH swap', network: 'Ethereum', amount: '0.40 ETH', status: 'Reverted', policy: 'Allowed', risk: 'Moderate', transactionHash: '0xa612...4c70' },
  { id: 'TX-2026-1044', date: '2026-11-25T12:21:00+05:30', operation: 'USDC transfer', network: 'Polygon', amount: '75.00 USDC', status: 'Confirmed', policy: 'Allowed', risk: 'Low', transactionHash: '0x72c9...0db4' },
];
