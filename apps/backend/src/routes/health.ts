import type { JsonValue } from '@intentguard/shared';
import { Router } from 'express';

const router = Router();
const healthResponse: JsonValue = { status: 'ok' };

router.get('/health', (_request, response) => {
  response.json(healthResponse);
});

export { router as healthRouter };
