import { checkHealth } from '@syner/api/health';

export const healthRoute = () => Response.json(checkHealth());

