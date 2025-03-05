import {model, Schema} from "mongoose";

//Esquema
const auditorio = new Schema({
    nombre:{
        type: String,
        minlength: 2,
        maxlength: 20,
        require: true,
        trim: true
    },
    cedula:{
        type: String,
        maxlength: 10,
        require: true,
        trim: true
    },
    ubicacion:{
        type: String,
        require: true,
        trim: true
    },
    capacidad:{
        type: Number,
        require: true,
        trim: true
    },
    descripcion:{
        type: String,
        maxlength: 100,
        require: true,
        trim: true
    }
},{
    timestamps:true
});

export default model('auditorios', auditorio)