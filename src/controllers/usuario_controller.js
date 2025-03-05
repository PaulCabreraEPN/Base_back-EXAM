import { generarJWT } from "../middlewares/JWT.js";
import usuario from "../models/usuarios.js";
import mongoose from "mongoose";

//Login
const login = async (req, res) => {
    const {email, password} = req.body;
    if (Object.values(req.body).includes("")){
        return res.status(400).json({msg:"Existen campos vacíos"});
    };
    
    const verifyuser = await usuario.findOne({email});

    if(!verifyuser){
        return res.status(400).json({msg:"Usuario o contraseña incorrectos."}); 
    }else{
        const verifyPassword = await verifyuser.matchPassword(password);
        if(!verifyPassword){
            return res.status(400).json({msg:"Contraseña incorrecta"});
        }else{
            const userResponse = verifyuser.toObject();
            delete userResponse.password;
            const tokenJWT = generarJWT(userResponse._id, userResponse.nombre, userResponse.apellido)
            return res.status(200).json({ msg: "Éxito al iniciar sesión", verifyuser: userResponse, token: tokenJWT })  
        };
    }
}

//Ingresar usuarios a la bd
const register = async (req, res) => {
    try {

        const {nombre, apellido, email, password} = req.body;
        const newUser = new usuario();
        newUser.nombre = nombre;
        newUser.apellido = apellido;
        newUser.email = email;
        newUser.password = await newUser.encryptPassword(password);

        await newUser.save();
        return res.status(200).json({msg:"Exito al registrar"})

    } catch (error) {
        console.log(error);
        
        res.status(400).json({msg:error})
    } 
}

export {
    login,
    register
}
