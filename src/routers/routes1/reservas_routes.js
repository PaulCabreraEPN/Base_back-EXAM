
import { actualizar, buscar, eliminar, listar, registrar } from "../../controllers/controls1/reservas_controller.js";
import { verificarAutenticacion } from "../../middlewares/JWT.js";
import { Router } from "express";

const router = Router();

router.post('/reservas/registrar', verificarAutenticacion, registrar);
router.get('/reservas', verificarAutenticacion, listar)
router.get('/reservas/:id', verificarAutenticacion, buscar)
router.put('/reservas/actualizar/:id', verificarAutenticacion, actualizar)
router.delete('/reservas/eliminar/:id', verificarAutenticacion, eliminar)

export default router;