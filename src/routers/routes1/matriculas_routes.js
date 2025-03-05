
import { actualizar, buscar, eliminar, listar, registrar } from "../../controllers/controls1/matriculas_controller.js";
import { verificarAutenticacion } from "../../middlewares/JWT.js";
import { Router } from "express";

const router = Router();

router.post('/matriculas/registrar', verificarAutenticacion, registrar);
router.get('/matriculas', verificarAutenticacion, listar)
router.get('/matriculas/:id', verificarAutenticacion, buscar)
router.put('/matriculas/actualizar/:id', verificarAutenticacion, actualizar)
router.delete('/matriculas/eliminar/:id', verificarAutenticacion, eliminar)

export default router;