import { IRoute } from './utils/models';

export const ROUTES: IRoute[] = [
  {
    url: '/notes',
    auth: false,
    proxy: {
      target: 'http://notes-service:3333/api',
      changeOrigin: true,
      pathRewrite: {
        [`^/notes`]: '/notes',
      },
    },
  },
];