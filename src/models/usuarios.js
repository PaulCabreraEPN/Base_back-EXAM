import {Schema, model} from "mongoose";
import bcrypt from "bcryptjs";

//Esquema
const usuario = new Schema ({
    nombre:{
        type: String,
        minlength: 3,
        maxlength: 30,
        require: true,
        trim: true
    },
    apellido:{
        type: String,
        minlength: 3,
        maxlength: 20,
        require: true,
        trim: true
    },
    email:{
        type: String,
        minlength: 6,
        maxlength: 30,
        require: true,
        trim: true
    },
    password:{
        type: String,
        require: true,
        trim: true
    }
},{
    timestamps:true
});

//Métodos

//Encriptado
usuario.methods.encryptPassword = async function (password) {
    const salto = await bcrypt.genSalt(10);
    const passwordEncrypted = await bcrypt.hash(password, salto);
    return passwordEncrypted;
};

//Comparación
usuario.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default model('usuarios', usuario);