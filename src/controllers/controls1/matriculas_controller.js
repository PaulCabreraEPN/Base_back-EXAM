import mongoose from "mongoose";
import materia from "../../models/schem1/materias.js";
import matricula from "../../models/schem1/matriculas.js";
import estudiante from "../../models/schem1/estudiantes.js";
import Joi from "joi";

const matriculaSchema = Joi.object({
    codigo: Joi.string()
        .max(20)
        .trim()
        .required()
        .messages({
            "string.empty": "El código de la matrícula es obligatorio.",
            "string.max": "El código no puede tener más de 20 caracteres."
        }),

    descripcion: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "La descripción es obligatoria."
        }),

    creditos: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .required()
        .messages({
            "number.base": "Los créditos deben ser un número.",
            "number.min": "Debe haber al menos 1 crédito.",
            "number.max": "No puede haber más de 10 créditos.",
            "any.required": "Los créditos son obligatorios."
        }),

    estudiante: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message("El ID del estudiante no es válido.");
            }
            return value;
        })
        .required()
        .messages({
            "string.empty": "El ID del estudiante es obligatorio."
        }),

    materia: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message("El ID de la materia no es válido.");
            }
            return value;
        })
        .required()
        .messages({
            "string.empty": "El ID de la materia es obligatorio."
        })
});

const registrar = async (req, res) => {
    const { codigo, descripcion, creditos, estudiante: estudianteId, materia: materiaId} = req.body;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Existen campos vacíos" });
    }

    const { error } = matriculaSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }

    const verifyMatricula = await matricula.findOne({codigo})

    if(verifyMatricula){
        return res.status(400).json({ msg: "Código exitente, ingrese uno nuevo." });
    }

    try {
    
        const estudianteExiste = await estudiante.findById(estudianteId);
        const materiaExiste = await materia.findById(materiaId);
    
        if (!estudianteExiste || !materiaExiste) {
            return res.status(404).json({ msg: "Estudiante o materia no encontrados" });
        }
    
        const newMatricula = new matricula(req.body);
        await newMatricula.save();
        return res.status(200).json({ msg: "Matrícula registrada con éxito", data: newMatricula });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al registrar matrícula", error: error.message });
    }
}

const listar = async (req, res) => {
    try {
    const matriculas = await matricula.find().populate("estudiante").populate("materia");
    res.status(200).json(matriculas);
    } catch (error) {
    res.status(500).json({ msg: "Error al acceder a las matrículas", error: error.message });
    }
};

const buscar = async (req, res) => {
    try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de matrícula no válido" });
    }
    
        const matriculaEncontrada = await matricula.findById(id).populate("estudiante").populate("materia");
    
        if (!matriculaEncontrada) {
            return res.status(404).json({ msg: "Matrícula no encontrada" });
        }
    
        return res.status(200).json({msg: "Matrícula encontrada con éxito", data: matriculaEncontrada});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
    
}    

const actualizar = async (req, res) => {
    const { id } = req.params;
    const { codigo, descripcion, creditos, estudiante: estudianteId, materia: materiaId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID de matrícula no válido" });
    }
    
    const { error } = matriculaSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }
    
    try {
        const estudianteExiste = await estudiante.findById(estudianteId);
        const materiaExiste = await materia.findById(materiaId);
    
        if (!estudianteExiste || !materiaExiste) {
            return res.status(404).json({ msg: "Estudiante o materia no encontrados" });
        }
    
        const updatedMatricula = await matricula.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMatricula) {
            return res.status(404).json({ msg: "Matrícula no encontrada" });
        }
    
        return res.status(200).json({ msg: "Matrícula actualizada con éxito", data: updatedMatricula });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
}

const eliminar = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de matrícula no válido" });
    }
    try {
    const deletedMatricula = await matricula.findByIdAndDelete(id);
    if (!deletedMatricula) {
    return res.status(404).json({ msg: "Matrícula no encontrada" });
    }
    return res.status(200).json({ msg: "Matrícula eliminada con éxito", data: deletedMatricula});
    } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
    };

export {
    registrar,
    listar,
    buscar,
    actualizar,
    eliminar
}