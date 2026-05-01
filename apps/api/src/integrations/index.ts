import { Hono } from 'hono';
import { trailbaseAuth, apiKeyAuth, combinedAuth } from '../middleware/auth';
import { createIntegrationsRouter, createIntegrationsTokenRouter } from './routes';
import { createCredentialRoutes } from './credential-routes';

const integrationsApp = new Hono();

// Credential management — works from both frontend (trailbase) and sandbox (api key)
integrationsApp.use('/credentials', combinedAuth);

integrationsApp.use('/apps', trailbaseAuth);
integrationsApp.use('/connect-token', trailbaseAuth);
integrationsApp.use('/connections/*', trailbaseAuth);
integrationsApp.use('/connections', trailbaseAuth);
integrationsApp.use('/connections/save', trailbaseAuth);

integrationsApp.use('/token', apiKeyAuth);
integrationsApp.use('/proxy', apiKeyAuth);
integrationsApp.use('/list', apiKeyAuth);
integrationsApp.use('/actions', apiKeyAuth);
integrationsApp.use('/run-action', apiKeyAuth);
integrationsApp.use('/connect', apiKeyAuth);
integrationsApp.use('/search-apps', apiKeyAuth);
integrationsApp.use('/triggers/*', apiKeyAuth);
integrationsApp.use('/triggers', apiKeyAuth);

integrationsApp.route('/', createCredentialRoutes());
integrationsApp.route('/', createIntegrationsRouter());
integrationsApp.route('/', createIntegrationsTokenRouter());

export { integrationsApp };
