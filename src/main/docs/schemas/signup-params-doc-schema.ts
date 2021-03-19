export const signUpParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    password: {
      type: 'string',
    },
    passwordConfirmation: {
      type: 'string',
    },
  },
  required: ['email', 'name', 'password', 'passwordConfirmation'],
};
