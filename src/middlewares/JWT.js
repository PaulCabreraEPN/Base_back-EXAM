import jwt from "jsonwebtoken";
import usuario from "../models/usuarios.js";


const generarJWT = (id, nombre, apellido) => {
    return jwt.sign({id, nombre, apellido}, process.env.JWT_SECRET, {expiresIn:"8h"})
}

const verificarAutenticacion = (req, res, next) => {
    // Obtener el token desde la cabecera
    const authHeader = req.headers.authorization;

    // Si la cabecera Authorization no está presente
    if (!authHeader) {
        return res.status(401).json({ msg: "Acceso denegado. No hay token." });
    }

    // Validar formato del token (Bearer token)
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ msg: "Formato de token inválido." });
    }

    const token = tokenParts[1];

    try {
        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // Guardar los datos del usuario en el request
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido o expirado." });
    }
};

export {
    generarJWT,
    verificarAutenticacion
}