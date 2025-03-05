import {Schema, model} from "mongoose";

//Esquema
const estudiante = new Schema ({
    nombre:{
        type: String,
        minlength: 2,
        maxlength: 20,
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
    cedula:{
        type: String,
        maxlength: 10,
        require: true,
        trim: true
    },
    fecha_nacimiento:{
        type: Date, //formato new Date("1995-06-15")
        require: true,
        trim: true
    },
    ciudad:{
        type: String,
        maxlength: 20,
        require: true,
        trim: true
    },
    direccion:{
        type: String,
        require: true,
        trim: true
    },
    telefono:{
        type: String,
        maxlength: 10,
        require: true,
        trim: true
    },
    email:{
        type: String,
        minlength: 6,
        require: true,
        trim: true
    }
},{
    timestamps:true
});

export default model('estudiantes', estudiante);