// src/routes/index_route.js

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Página inicial (Login)
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/templates/login.html'));
});

// Página de login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/templates/login.html'));
});

// Página de cadastro
router.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/templates/cadastro.html'));
});

// Página do dashboard
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/templates/dashboard.html'));
});

// Página de registrar refeição
router.get('/registrar', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/templates/registrar.html'));
});

// Página de histórico
router.get('/historico', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/templates/historico.html'));
});

// Página de perfil
router.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/templates/perfil.html'));
});

// Rota de saúde da API
router.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'VivaBem API está rodando',
    timestamp: new Date().toISOString()
  });
});

export default router;