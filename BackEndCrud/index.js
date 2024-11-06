import express from 'express';
import flowerRoutes from './Routes/FlowersRoutes.js'; 
import cors from 'cors';

const app = express();

// Usar CORS
app.use(cors());

// Usar JSON no corpo da requisição
app.use(express.json());

// Rota para o cadastro de flores
app.use('/flowers', flowerRoutes); // Alteração para '/flowers'

app.listen(5000, () => { 
    console.log('Servidor Express rodando na porta 5000'); 
});
