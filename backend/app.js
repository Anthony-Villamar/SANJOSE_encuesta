import express from 'express';
import cors from 'cors';
import encuestasRoutes from './routes/encuestas.js';
import loginRoutes from './routes/login.js';
import usuariosRoutes from './routes/usuarios.js';
import estadisticasRoutes from './routes/estadisticas.js';


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/encuestas', encuestasRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/estadisticas', estadisticasRoutes);


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor activo en http://localhost:${PORT}`));
