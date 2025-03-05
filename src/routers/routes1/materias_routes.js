import { Router } from "express";
import { verificarAutenticacion } from "../../middlewares/JWT.js";
import { actualizar, buscar, eliminar, listar, registrar } from "../../controllers/controls1/materias_controller.js";

const router = Router();

router.get('/materias', verificarAutenticacion, listar);
router.get('/materias/:codigo', verificarAutenticacion, buscar)
router.post('/materias/registrar', verificarAutenticacion, registrar);
router.put('/materias/actualizar/:id', verificarAutenticacion, actualizar);
router.delete('/materias/eliminar/:id', verificarAutenticacion, eliminar)

export default router;