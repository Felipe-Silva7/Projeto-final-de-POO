// src/app.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa as rotas
import indexRoute from './routes/index_route.js';
import usuarioRoute from './routes/usuario_route.js';
import refeicaoRoute from './routes/refeicao_route.js';
import analiseRoute from './routes/analise_route.js';

function createApp() {
  const app = express();

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Servir arquivos estáticos (CSS, JS do frontend, imagens)
  app.use(express.static(path.join(__dirname, 'views/static')));
  
  // Configurar view engine (se usar templates)
  app.set('views', path.join(__dirname, 'views/templates'));
  app.set('view engine', 'html');
  
  // Middleware para servir HTML como texto
  app.engine('html', (filePath, options, callback) => {
    import('fs').then(fs => {
      fs.readFile(filePath, (err, content) => {
        if (err) return callback(err);
        return callback(null, content.toString());
      });
    });
  });

  // Rotas
  app.use('/', indexRoute);
  app.use('/api/usuarios', usuarioRoute);
  app.use('/api/refeicoes', refeicaoRoute);
  app.use('/api/analises', analiseRoute);

  // Middleware de erro 404
  app.use((req, res) => {
    res.status(404).json({ 
      sucesso: false, 
      mensagem: 'Rota não encontrada' 
    });
  });

  // Middleware de erro geral
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro interno do servidor',
      erro: err.message 
    });
  });

  return app;
}

export default createApp;