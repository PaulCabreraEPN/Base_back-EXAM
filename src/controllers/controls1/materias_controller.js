import Joi from "joi";
import materia from "../../models/schem1/materias.js";
import mongoose from "mongoose";

const materiaSchema = Joi.object({
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
            "string.empty": "El código de la materia es obligatorio.",
            "string.max": "El código no puede tener más de 20 caracteres."
        }),

    descripcion: Joi.string()
        .max(100)
        .trim()
        .required()
        .messages({
            "string.empty": "La descripción es obligatoria.",
            "string.max": "La descripción no puede tener más de 100 caracteres."
        }),

    creditos: Joi.number()
        .integer()
        .min(1)
        .max(10)
        .required()
        .messages({
            "number.base": "Los créditos deben ser un número.",
            "number.min": "La materia debe tener al menos 1 crédito.",
            "number.max": "La materia no puede tener más de 10 créditos.",
            "any.required": "Los créditos son obligatorios."
        })
});


const registrar = async (req, res) => {
    const { nombre, codigo, descripcion, creditos } = req.body;

    const areFieldsEmpty = (...fields) => fields.some(field => !field || (typeof field === 'string' && field.trim() === ""));

    if (areFieldsEmpty(nombre, codigo, descripcion, creditos)) {
        return res.status(400).json({ error: "Datos vacíos. Por favor, llene todos los campos." });
    }
    
    const { error } = materiaSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }

    try {
        const verifyMateria = await materia.findOne({ codigo });
        if (!verifyMateria) {
            const newMateria = new materia(req.body);
            await newMateria.save();
            return res.status(200).json({ msg: "Materia registrada con éxito", data: newMateria });
        } else {
            return res.status(400).json({ msg: "Código de materia ya registrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al registrar materia", error: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const materias = await materia.find();
        res.status(200).json(materias);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener las materias", error: error.message });
    }
};

const buscar = async (req, res) => {
    try {
        const { codigo } = req.params;

        const materiaEncontrada = await materia.findOne({codigo});

        console.log(materiaEncontrada);
        
        if (!materiaEncontrada) return res.status(404).json({ msg: "Materia no encontrada" });

        res.status(200).json({msg: "Materia encontrada con éxito", data: materiaEncontrada});
    } catch (error) {
        res.status(500).json({ msg: "Error al buscar materia", error: error.message });
    }
};

const actualizar = async (req, res) => {
    const { id } = req.params;
    const { nombre, codigo, descripcion, creditos } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    const areFieldsEmpty = (...fields) => fields.some(field => !field || (typeof field === 'string' && field.trim() === ""));

    if (areFieldsEmpty(nombre, codigo, descripcion, creditos)) {
        return res.status(400).json({ error: "Datos vacíos. Por favor, llene todos los campos." });
    }

    const { error } = materiaSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }

    try {
        const updatedMateria = await materia.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedMateria) return res.status(404).json({ msg: "Materia no encontrada" });

        res.status(200).json({ msg: "Materia actualizada correctamente", data: updatedMateria });
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar materia", error: error.message });
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: "ID inválido" });

    try {
        const deletedMateria = await materia.findByIdAndDelete(id);
        if (!deletedMateria) return res.status(404).json({ msg: "Materia no encontrada" });

        res.status(200).json({ msg: "Materia eliminada correctamente", data: deletedMateria });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar materia", error: error.message });
    }
};

export { registrar, listar, buscar, actualizar, eliminar };
