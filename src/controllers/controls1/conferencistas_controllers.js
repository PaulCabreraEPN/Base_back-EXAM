import Joi from "joi";
import mongoose from "mongoose";
import conferencista from "../../models/schem5/conferencistas.js";


//Validaciones
const schema = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(20)
        .trim()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            "string.pattern.base": "El nombre solo puede contener letras y espacios.",
            "string.empty": "El nombre es obligatorio.",
            "string.min": "El nombre debe tener al menos 2 caracteres.",
            "string.max": "El nombre no puede tener más de 20 caracteres."
        }),

    apellido: Joi.string()
        .min(2)
        .max(20)
        .trim()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            "string.pattern.base": "El apellido solo puede contener letras y espacios.",
            "string.empty": "El apellido es obligatorio.",
            "string.min": "El apellido debe tener al menos 2 caracteres.",
            "string.max": "El apellido no puede tener más de 20 caracteres."
        }),

    cedula: Joi.string()
        .length(10)
        .pattern(/^\d+$/)
        .required()
        .messages({
            "string.length": "La cédula debe tener exactamente 10 dígitos.",
            "string.pattern.base": "La cédula solo puede contener números."
        }),

    genero: Joi.string()
        .max(20)
        .trim()
        .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
        .required()
        .messages({
            "string.empty": "El género es obligatorio.",
            "string.max": "El género no puede tener más de 20 caracteres.",
            "string.pattern.base": "El apellido solo puede contener letras y espacios.",
        }),

    fecha_nacimiento: Joi.date()
        .less('now')
        .required()
        .messages({
            "date.less": "La fecha de nacimiento no puede ser en el futuro.",
            "date.base": "Formato de fecha inválido. Usa YYYY-MM-DD."
        }),
    
    ciudad: Joi.string()
        .max(20)
        .trim()
        .required()
        .messages({
            "string.empty": "La ciudad es obligatoria.",
            "string.max": "La ciudad no puede tener más de 20 caracteres."
        }),


    direccion: Joi.string()
        .max(100)
        .trim()
        .required()
        .messages({
            "string.empty": "La dirección es obligatoria.",
            "string.max": "La dirección no puede tener más de 100 caracteres."
        }),

    telefono: Joi.string()
        .length(10)
        .pattern(/^\d+$/)
        .required()
        .messages({
            "string.length": "El teléfono debe tener 10 dígitos.",
            "string.pattern.base": "El teléfono solo puede contener números."
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Ingrese un email válido.",
            "string.empty": "El email es obligatorio."
        }),
    
    empresa: Joi.string()
        .min(2)
        .max(50)
        .trim()
        .required()
        .messages({
            "string.empty": "El nombre de la empresa es obligatorio.",
            "string.min": "El nombre de la empresa debe tener al menos 2 caracteres.",
            "string.max": "El nombre de la empresa no puede tener más de 50 caracteres."
        }),
});

const registrar = async (req, res) => {

    const {nombre, apellido, cedula, genero, fecha_nacimiento, ciudad, direccion, telefono, email, empresa} = req.body;

    // Función para verificar si hay campos vacíos
    const areFieldsEmpty = (...fields) => 
        fields.some(field => !field || (typeof field === 'string' && field.trim() === ""));

    // Validar campos obligatorios
    if (areFieldsEmpty(nombre, apellido, cedula, genero, fecha_nacimiento, ciudad, direccion, telefono, email, empresa)) {
        return res.status(400).json({
            error: "Datos vacíos. Por favor, llene todos los campos."
        });
    }


    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({ msg: "Errores de validación", errores: error.details.map(err => err.message) });
    }


    try {
        const verifyconf = await conferencista.findOne({cedula});
        if (!verifyconf){
            const newconf = new conferencista(req.body);
            newconf.fecha_nacimiento = new Date(fecha_nacimiento)
            await newconf.save()
            return res.status(200).json({msg:"Exito al registrar", data: newconf});
        }else{
            return res.status(400).json({msg:"Cédula ya registrada"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Error al registrar conferencista",error: error.message})
    }
}

const listar = async (req, res) => {
    try {
        const conferencistas = await conferencista.find();
        res.status(200).json({data: conferencistas})
    } catch (error) {
        res.status(500).json({msg: "Error al acceder a los conferencistas",error: error.message}) 
    }
}

const buscar = async (req, res) => {
    try {
        const {cedula} = req.params;

        const verifyconf = await conferencista.findOne({cedula});

        if (!verifyconf) {
            return res.status(404).json({
                msg: `No se encontró el conferencista con la cedula ${cedula}`
            });
        }

        return res.status(200).json({
            msg: "Conferencista encontrado con éxito",
            data: verifyconf,
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
}


const actualizar = async (req, res) => {
    const {id} = req.params;
    const {nombre, apellido, cedula, genero, fecha_nacimiento, ciudad, direccion, telefono, email, empresa} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
        msg: `Por favor, ingrese un ID válido para actualizar.`
    });

    // Función para verificar si hay campos vacíos
    const areFieldsEmpty = (...fields) => 
        fields.some(field => !field || (typeof field === 'string' && field.trim() === ""));

    // Validar campos obligatorios
    if (areFieldsEmpty(nombre, apellido, cedula, genero, fecha_nacimiento, ciudad, direccion, telefono, email, empresa)) {
        return res.status(400).json({
            error: "Datos vacíos. Por favor, llene todos los campos."
        });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({ msg: "Errores de validación", errores: error.details.map(err => err.message) });
    }

    try {
        const newdata = {
            nombre, 
            apellido, 
            cedula, 
            genero, 
            fecha_nacimiento, 
            ciudad, direccion, 
            telefono, 
            email, 
            empresa
        }
        const verifyconf = await conferencista.findByIdAndUpdate(id, newdata, {new: true})
        if (!verifyconf) {
            return res.status(404).json({
                msg: `No se encontró el conferencista con el id ${id}`
            });
        }
        return res.status(200).json({
            msg: "Conferencista actualizado correctamente",
            data: newdata, 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }

}

const eliminar = async (req, res) => {
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({
        msg: `Por favor, ingrese un ID válido para eliminar.`
    });
    try {
        const verifystudent = await conferencista.findByIdAndDelete(id);
        if(!verifystudent){
            return res.status(404).json({
                msg: `No se encontró el conferencista con el id ${id}`
            });
        }

        return res.status(200).json({
            msg: "Conferencista eliminado correctamente",
            data: verifystudent
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error interno del servidor", error: error.message });
    }
}

export {
    registrar,
    listar,
    buscar,
    actualizar,
    eliminar
}