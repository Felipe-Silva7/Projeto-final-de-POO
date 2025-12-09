// src/routes/usuario_route.js

import express from 'express';
import { UsuarioController } from '../controllers/UsuarioController.js';

const router = express.Router();

// POST /api/usuarios/cadastrar - Cadastrar novo usuário
router.post('/cadastrar', (req, res) => {
  try {
    const resultado = UsuarioController.cadastrar(req.body);
    
    if (resultado.sucesso) {
      res.status(201).json(resultado);
    } else {
      res.status(400).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao cadastrar usuário',
      erro: erro.message 
    });
  }
});

// POST /api/usuarios/login - Fazer login
router.post('/login', (req, res) => {
  try {
    const { credencial } = req.body;
    const resultado = UsuarioController.login(credencial);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(401).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao fazer login',
      erro: erro.message 
    });
  }
});

// POST /api/usuarios/logout - Fazer logout
router.post('/logout', (req, res) => {
  try {
    const resultado = UsuarioController.logout();
    res.status(200).json(resultado);
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao fazer logout',
      erro: erro.message 
    });
  }
});

// GET /api/usuarios/logado - Obter usuário logado
router.get('/logado', (req, res) => {
  try {
    const usuario = UsuarioController.obterUsuarioLogado();
    
    if (usuario) {
      res.status(200).json({ 
        sucesso: true, 
        usuario: usuario.toJSON() 
      });
    } else {
      res.status(404).json({ 
        sucesso: false, 
        mensagem: 'Nenhum usuário logado' 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao obter usuário logado',
      erro: erro.message 
    });
  }
});

// GET /api/usuarios/perfil/:id - Obter perfil do usuário
router.get('/perfil/:id', (req, res) => {
  try {
    const perfil = UsuarioController.obterPerfil(req.params.id);
    
    if (perfil) {
      res.status(200).json({ 
        sucesso: true, 
        perfil 
      });
    } else {
      res.status(404).json({ 
        sucesso: false, 
        mensagem: 'Usuário não encontrado' 
      });
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao obter perfil',
      erro: erro.message 
    });
  }
});

// PUT /api/usuarios/:id - Atualizar usuário
router.put('/:id', (req, res) => {
  try {
    const resultado = UsuarioController.atualizar(req.params.id, req.body);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(404).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao atualizar usuário',
      erro: erro.message 
    });
  }
});

// DELETE /api/usuarios/:id - Excluir usuário
router.delete('/:id', (req, res) => {
  try {
    const resultado = UsuarioController.excluir(req.params.id);
    
    if (resultado.sucesso) {
      res.status(200).json(resultado);
    } else {
      res.status(404).json(resultado);
    }
  } catch (erro) {
    res.status(500).json({ 
      sucesso: false, 
      mensagem: 'Erro ao excluir usuário',
      erro: erro.message 
    });
  }
});

export default router;