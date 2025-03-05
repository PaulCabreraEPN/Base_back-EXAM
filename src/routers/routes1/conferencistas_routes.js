import { Router } from "express";
import { verificarAutenticacion } from "../../middlewares/JWT.js";
import { actualizar, buscar, eliminar, listar, registrar } from "../../controllers/controls1/conferencistas_controllers.js";

const router = Router();

router.get('/conferencistas', verificarAutenticacion, listar);
router.get('/conferencistas/:cedula', verificarAutenticacion, buscar)
router.post('/conferencistas/registrar', verificarAutenticacion, registrar);
router.put('/conferencistas/actualizar/:id', verificarAutenticacion, actualizar);
router.delete('/conferencistas/eliminar/:id', verificarAutenticacion, eliminar)

export default router;