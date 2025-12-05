// src/routes/index.js
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// todas as rotas
import userRoutes from'./user_route.js';

// recria __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const index_route = new Router();

//apenas para tela inicial
index_route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'templates', 'index.html'));
});



const all_route = new Router();
all_route.use(index_route);
all_route.use(userRoutes);


export default all_route;
