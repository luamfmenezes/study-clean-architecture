import { apiKeyAuthSchema } from './schemas/';
import {
  badRequest,
  serverError,
  unauthorized,
  notFound,
  forbidden,
} from './components/index';

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema,
  },
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden,
};
