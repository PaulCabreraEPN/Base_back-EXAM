import { Router } from "express";
import { verificarAutenticacion } from "../../middlewares/JWT.js";
import { actualizar, buscar, eliminar, listar, registrar } from "../../controllers/controls1/auditorios_controller.js";

const router = Router();

router.get('/auditorios', verificarAutenticacion, listar);
router.get('/auditorios/:codigo', verificarAutenticacion, buscar)
router.post('/auditorios/registrar', verificarAutenticacion, registrar);
router.put('/auditorios/actualizar/:id', verificarAutenticacion, actualizar);
router.delete('/auditorios/eliminar/:id', verificarAutenticacion, eliminar)

export default router;