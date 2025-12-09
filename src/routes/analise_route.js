// src/routes/analise_route.js

import express from 'express';
import { AnaliseController } from '../controllers/AnaliseController.js';

const router = express.Router();

// GET /api/analises/diaria/:usuarioId - Análise diária (hoje)
router.get('/diaria/:usuarioId', (req, res) => {
  try {
    const resultado = AnaliseController.gerarAnaliseDiaria(req.params.usuarioId);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao gerar análise diária',
      erro: erro.message 
    });
  }
});

// GET /api/analises/diaria/:usuarioId/:data - Análise diária de data específica
router.get('/diaria/:usuarioId/:data', (req, res) => {
  try {
    const resultado = AnaliseController.gerarAnaliseDiaria(
      req.params.usuarioId,
      req.params.data
    );
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao gerar análise diária',
      erro: erro.message 
    });
  }
});

// GET /api/analises/semanal/:usuarioId - Análise semanal
router.get('/semanal/:usuarioId', (req, res) => {
  try {
    const resultado = AnaliseController.gerarAnaliseSemanal(req.params.usuarioId);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao gerar análise semanal',
      erro: erro.message 
    });
  }
});

// GET /api/analises/mensal/:usuarioId - Análise mensal
router.get('/mensal/:usuarioId', (req, res) => {
  try {
    const resultado = AnaliseController.gerarAnaliseMensal(req.params.usuarioId);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao gerar análise mensal',
      erro: erro.message 
    });
  }
});

// GET /api/analises/recomendacoes/:usuarioId - Recomendações personalizadas
router.get('/recomendacoes/:usuarioId', (req, res) => {
  try {
    const resultado = AnaliseController.gerarRecomendacoes(req.params.usuarioId);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao gerar recomendações',
      erro: erro.message 
    });
  }
});

// POST /api/analises/comparar/:usuarioId - Comparar períodos
router.post('/comparar/:usuarioId', (req, res) => {
  try {
    const { dataInicio1, dataFim1, dataInicio2, dataFim2 } = req.body;
    
    const resultado = AnaliseController.compararPeriodos(
      req.params.usuarioId,
      dataInicio1,
      dataFim1,
      dataInicio2,
      dataFim2
    );
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao comparar períodos',
      erro: erro.message 
    });
  }
});

export default router;