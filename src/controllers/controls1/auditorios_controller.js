import Joi from "joi";
import mongoose from "mongoose";
import auditorio from "../../models/schem5/auditorios.js";


const audiSchema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(50)
        .trim()
        .required()
        .messages({
            "string.empty": "El nombre de la materia es obligatorio.",
            "string.min": "El nombre debe tener al menos 2 caracteres.",
            "string.max": "El nombre no puede tener más de 50 caracteres."
        }),

    codigo: Joi.string()
        .max(20)
        .trim()
        .required()
        .messages({
            "string.empty": "El código del auditorio es obligatorio.",
            "string.max": "El código no puede tener más de 20 caracteres."
        }),
    
    ubicacion: Joi.string()
        .max(100)
        .trim()
        .required()
        .messages({
            "string.empty": "La ubicación es obligatoria.",
            "string.max": "La ubicación no puede tener más de 100 caracteres."
        }),

    capacidad: Joi.number()
        .required()
        .messages({
            "string.empty": "La ubicación es obligatoria.",
            "string.length": "La capcidad solo puede contener números.",
        }),


    descripcion: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "La descripción es obligatoria.",
            "string.max": "La descripción no puede tener más de 100 caracteres."
        }),
});


const registrar = async (req, res) => {
    const { nombre, codigo, ubicacion, descripcion } = req.body;

    const areFieldsEmpty = (...fields) => fields.some(field => !field || (typeof field === 'string' && field.trim() === ""));

    if (areFieldsEmpty(nombre, codigo, ubicacion,descripcion)) {
        return res.status(400).json({ error: "Datos vacíos. Por favor, llene todos los campos." });
    }
    
    const { error } = audiSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }

    try {
        const verifyAudi = await auditorio.findOne({ codigo });
        if (!verifyAudi) {
            const newMateria = new auditorio(req.body);
            await newMateria.save();
            return res.status(200).json({ msg: "Auditorio registrado con éxito", data: newMateria });
        } else {
            return res.status(400).json({ msg: "Código de auditorio ya registrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al registrar auditorio", error: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const auditorios = await auditorio.find();
        res.status(200).json(auditorios);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los auditorios", error: error.message });
    }
};

const buscar = async (req, res) => {
    try {
        const { codigo } = req.params;

        const auditorioEncontrado = await auditorio.findOne({codigo});
        
        if (!auditorioEncontrado) return res.status(404).json({ msg: "Auditorio no encontrado" });

        res.status(200).json({msg: "Auditorio encontrada con éxito", data: auditorioEncontrado});
    } catch (error) {
        res.status(500).json({ msg: "Error al buscar auditorio", error: error.message });
    }
};

const actualizar = async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo, ubicacion, descripcion  } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    const areFieldsEmpty = (...fields) => fields.some(field => !field || (typeof field === 'string' && field.trim() === ""));

    if (areFieldsEmpty(nombre, codigo, ubicacion, descripcion )) {
        return res.status(400).json({ error: "Datos vacíos. Por favor, llene todos los campos." });
    }

    const { error } = audiSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }

    try {
        const updatedAuditorio = await auditorio.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedAuditorio) return res.status(404).json({ msg: "Auditorio no encontrado" });

        res.status(200).json({ msg: "Auditorio actualizado correctamente", data: updatedAuditorio });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar auditorio", error: error.message });
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    try {
        const deletedMAuditorio = await auditorio.findByIdAndDelete(id);

        if (!deletedMAuditorio) return res.status(404).json({ msg: "Auditorio no encontrado" });

        res.status(200).json({ msg: "Auditorio eliminada correctamente", data: deletedMAuditorio });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar auditorio", error: error.message });
    }
};

export { registrar, listar, buscar, actualizar, eliminar };
