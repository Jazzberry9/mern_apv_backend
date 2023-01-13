import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config()
import connectingDB from "./config/db.js";

import veterinariosRouter from './routes/veterinario-routes.js'
import pacientesRouter from './routes/pacientes-routes.js'

// configurando express y asignando el puerto
const app = express();
const port = process.env.PORT;

// conecntaod db
connectingDB();

// configurar cors
const dominiosPermitidos = [ process.env.FRONTEND_URL ];
const corsOptions = {
    origin: function(origin, callback){
        if ( dominiosPermitidos.indexOf(origin) !== -1){
            // el origen del req, esta permitido
            callback(null, true)
        } else {
            callback(new Error('no permitido por CORS'))
        }
    },
}
app.use(cors(corsOptions))


// body parser
app.use( express.json())

// rutas necesarias
app.use('/api/veterinarios', veterinariosRouter )
app.use('/api/pacientes', pacientesRouter )

// escuchando puerto
app.listen( port || 4040, () =>{
    console.log(`Servidor establecido en el puerto ${port}`);
});