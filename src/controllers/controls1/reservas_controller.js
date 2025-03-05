import mongoose from "mongoose";
import Joi from "joi";
import reserva from "../../models/schem5/reservas.js";
import conferencista from "../../models/schem5/conferencistas.js";
import auditorio from "../../models/schem5/auditorios.js";

const reservaSchema = Joi.object({
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

    conferencista: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message("El ID del conferencista no es válido.");
            }
            return value;
        })
        .required()
        .messages({
            "string.empty": "El ID del estudiante es obligatorio."
        }),

    auditorio: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return helpers.message("El ID del auditorio no es válido.");
            }
            return value;
        })
        .required()
        .messages({
            "string.empty": "El ID de la materia es obligatorio."
        })
});

const registrar = async (req, res) => {
    const { codigo, conferencista: conferencistaId, auditorio: auditorioId} = req.body;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Existen campos vacíos" });
    }

    const { error } = reservaSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }

    const verifyRes = await reserva.findOne({codigo})

    if(verifyRes){
        return res.status(400).json({ msg: "Código exitente, ingrese uno nuevo." });
    }

    try {
    
        const conferencistaExiste = await conferencista.findById(conferencistaId);
        const auditorioExiste = await auditorio.findById(auditorioId);
    
        if (!conferencistaExiste || !auditorioExiste) {
            return res.status(404).json({ msg: "Conferencista o auditorio no encontrados" });
        }
    
        const newReserva = new reserva(req.body);
        await newReserva.save();
        return res.status(200).json({ msg: "Reserva registrada con éxito", data: newReserva });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al registrar reserva", error: error.message });
    }
}

const listar = async (req, res) => {
    try {
    const reservas = await reserva.find().populate("conferencista").populate("auditorio");
    res.status(200).json(reservas);
    } catch (error) {
    res.status(500).json({ msg: "Error al acceder a las reservas", error: error.message });
    }
};

const buscar = async (req, res) => {
    try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de reserva no válido" });
    }
    
        const reservaEncontrada = await reserva.findById(id).populate("conferencista").populate("auditorio");
    
        if (!reservaEncontrada) {
            return res.status(404).json({ msg: "Auditorio no encontrado" });
        }
    
        return res.status(200).json({msg: "Reserva encontrada con éxito", data: reservaEncontrada});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
    
}    

const actualizar = async (req, res) => {
    const { id } = req.params;
    const { conferencista: conferencistaId, auditorio: auditorioId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ID de reserva no válido" });
    }
    
    const { error } = reservaSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ 
            msg: "Errores de validación", 
            errores: error.details.map(err => err.message) 
        });
    }
    
    try {
        const conferencistaExiste = await conferencista.findById(conferencistaId);
        const auditorioExiste = await auditorio.findById(auditorioId);
    
        if (!conferencistaExiste || !auditorioExiste) {
            return res.status(404).json({ msg: "Conferencista o auditorio no encontrados" });
        }
    
        const updatedReserva = await reserva.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedReserva) {
            return res.status(404).json({ msg: "Reserva no encontrada" });
        }
    
        return res.status(200).json({ msg: "Reserva actualizada con éxito", data: updatedReserva });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
}

const eliminar = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID de reserva no válido" });
    }
    try {
    const deletedReserva = await reserva.findByIdAndDelete(id);
    if (!deletedReserva) {
    return res.status(404).json({ msg: "Reserva no encontrada" });
    }
    return res.status(200).json({ msg: "Reserva eliminada con éxito", data: deletedReserva});
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