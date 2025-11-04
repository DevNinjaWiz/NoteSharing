import { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ROUTES } from '../config';

export const setUpApi = (app: Express) => {
  ROUTES.forEach((route) => {
    app.use(route.url, createProxyMiddleware(route.proxy));
  });
};