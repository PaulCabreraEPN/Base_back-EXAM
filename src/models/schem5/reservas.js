import {Schema, model} from "mongoose";

//Esquema
const reserva = new Schema ({
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
    auditorio:{
        type: Schema.Types.ObjectId,
        ref: 'auditorios',
        require: true
    },
    conferencista:{
        type: Schema.Types.ObjectId,
        ref: 'conferencistas',
        require: true
    }
},{
    timestamps:true
});

export default model ('reservas', reserva);