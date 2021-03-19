import { loginPath } from './paths/login-path';
import { accountSchema } from './schemas/account-doc-schema';
import { loginParamsSchema } from './schemas/login-params-doc-schema';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node Api',
    description: 'API Clean archtecture course',
    version: '1.0.0',
  },
  servers: [
    {
      url: '/api',
    },
  ],
  tags: [
    {
      name: 'Login',
      description: 'API to manage login',
    },
  ],
  paths: {
    '/login': loginPath,
  },
  schemas: {
    account: accountSchema,
    login: loginParamsSchema,
  },
};
