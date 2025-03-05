import {Schema, model} from "mongoose";

//Esquema
const matricula = new Schema ({
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
    },
    estudiante:{
        type: Schema.Types.ObjectId,
        ref: 'estudiantes',
        require: true
    },
    materia:{
        type: Schema.Types.ObjectId,
        ref: 'materias',
        require: true
    }
},{
    timestamps:true
});

export default model ('matriculas', matricula);