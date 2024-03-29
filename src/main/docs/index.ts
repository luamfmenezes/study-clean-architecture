import paths from './paths';
import schemas from './schemas';
import components from './components';

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
    {
      name: 'Surveys',
      description: 'API to manage surveys',
    },
  ],
  paths,
  schemas,
  components,
};
