export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API for auth user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/login',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account',
            },
          },
        },
      },
      400: {
        description: 'Bad Request',
      },
    },
  },
};
