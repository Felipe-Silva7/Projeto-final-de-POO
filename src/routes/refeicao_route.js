// src/routes/refeicao_route.js

import express from 'express';
import { RefeicaoController } from '../controllers/RefeicaoController.js';

const router = express.Router();

// POST /api/refeicoes/registrar - Registrar nova refeição
router.post('/registrar', (req, res) => {
  try {
    const resultado = RefeicaoController.registrar(req.body);
    
    if (resultado.sucesso) {
      res.status(201).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao registrar refeição',
      erro: erro.message 
    });
  }
});

// GET /api/refeicoes/usuario/:usuarioId - Listar todas refeições do usuário
router.get('/usuario/:usuarioId', (req, res) => {
  try {
    const resultado = RefeicaoController.listarTodas(req.params.usuarioId);
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao listar refeições',
      erro: erro.message 
    });
  }
});

// GET /api/refeicoes/usuario/:usuarioId/data/:data - Listar refeições por data
router.get('/usuario/:usuarioId/data/:data', (req, res) => {
  try {
    const resultado = RefeicaoController.listarPorData(
      req.params.usuarioId, 
      req.params.data
    );
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao listar refeições',
      erro: erro.message 
    });
  }
});

// GET /api/refeicoes/usuario/:usuarioId/hoje - Refeições do dia atual
router.get('/usuario/:usuarioId/hoje', (req, res) => {
  try {
    const resultado = RefeicaoController.obterRefeicoesDoDia(req.params.usuarioId);
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao obter refeições do dia',
      erro: erro.message 
    });
  }
});

// GET /api/refeicoes/usuario/:usuarioId/historico - Histórico de refeições
router.get('/usuario/:usuarioId/historico', (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 30;
    const resultado = RefeicaoController.obterHistorico(req.params.usuarioId, limite);
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao obter histórico',
      erro: erro.message 
    });
  }
});

// GET /api/refeicoes/usuario/:usuarioId/estatisticas - Estatísticas
router.get('/usuario/:usuarioId/estatisticas', (req, res) => {
  try {
    const resultado = RefeicaoController.obterEstatisticas(req.params.usuarioId);
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao obter estatísticas',
      erro: erro.message 
    });
  }
});

// GET /api/refeicoes/:usuarioId/:refeicaoId - Obter refeição específica
router.get('/:usuarioId/:refeicaoId', (req, res) => {
  try {
    const resultado = RefeicaoController.obterPorId(
      req.params.usuarioId,
      req.params.refeicaoId
    );
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(404).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao obter refeição',
      erro: erro.message 
    });
  }
});

// DELETE /api/refeicoes/:usuarioId/:refeicaoId - Excluir refeição
router.delete('/:usuarioId/:refeicaoId', (req, res) => {
  try {
    const resultado = RefeicaoController.excluir(
      req.params.usuarioId,
      req.params.refeicaoId
    );
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(404).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao excluir refeição',
      erro: erro.message 
    });
  }
});

export default router;