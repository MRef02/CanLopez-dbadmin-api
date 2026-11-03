import { Router } from 'express';
import { getUser, getUserById } from '../controllers/user.controller.js';

const router = Router();

router.get('/users', getUser);
router.get('/users/:id', getUserById);
router.get('/user', getUser);
router.get('/userGetId/:id', getUserById);

export default router;
// Rutas para el controlador de usuarios
