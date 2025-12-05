// src/app.js
import express from 'express';
import routes from './routes/index.js';

function createApp() {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // arquivos estáticos (opcional)
    app.use(express.static('src/views/static'));

    // registra todas as rotas
    app.use(routes);

    return app;
}

export default createApp;
