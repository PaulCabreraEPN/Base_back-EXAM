// Requerir los módulos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuario_rutas from './routers/usuario_routes.js';
import conferencistas_routes from './routers/routes1/conferencistas_routes.js';
import auditorios_rutas from './routers/routes1/auditorios_routes.js';
import reservas_rutas from './routers/routes1/reservas_routes.js';
;
// Inicializaciones
const app = express();
dotenv.config();

// Configuraciones 
app.set('port',process.env.PORT || 3000);
app.use(cors());

// Middlewares 
app.use(express.json());


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on 👨‍💻✅");
});

app.use('/api', usuario_rutas);
app.use('/api', conferencistas_routes);
app.use('/api', auditorios_rutas);
app.use('/api', reservas_rutas);

//Rutas no encontradas
app.use((req,res)=>res.status(404).send("EndPoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default  app;