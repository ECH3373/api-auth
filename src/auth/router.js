import { Router } from 'express';
import { controller } from './controller.js';

export const router = Router();
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/me', controller.me);
router.post('/logout', controller.logout);
