import {Schema, model} from "mongoose";

//Esquema
const materia = new Schema ({
    nombre:{
        type: String,
        minlength: 2,
        require: true,
        trim: true
    },
    codigo:{
        type: String,
        maxlength: 20,
        require: true,
        trim: true
    },
    descripcion:{
        type: String,
        require: true,
        trim: true
    },
    creditos:{
        type: Number,
        require: true,
        trim: true
    }
},{
    timestamps:true
});

export default model ('materias', materia);