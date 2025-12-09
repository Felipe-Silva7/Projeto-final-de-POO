// src/controllers/UsuarioController.js

import { db } from '../services/db.js';
import { UsuarioComum } from '../models/Usuarios/UsuarioComum.js';
import { UsuarioDiabetico } from '../models/Usuarios/UsuarioDiabetico.js';
import { UsuarioAtleta } from '../models/Usuarios/UsuarioAtleta.js';

export class UsuarioController {
  
  static cadastrar(dados) {
    try {
      // Validações
      if (!dados.nome || dados.nome.trim() === '') {
        throw new Error('Nome é obrigatório');
      }

      if (!dados.email || !dados.email.includes('@')) {
        throw new Error('Email inválido');
      }

      if (!dados.idade || dados.idade <= 0) {
        throw new Error('Idade inválida');
      }

      if (!dados.peso || dados.peso <= 0) {
        throw new Error('Peso inválido');
      }

      if (!dados.altura || dados.altura <= 0) {
        throw new Error('Altura inválida');
      }

      if (!dados.tipo) {
        throw new Error('Tipo de usuário é obrigatório');
      }

      // Verifica se email já existe
      if (db.buscarUsuarioPorEmail(dados.email)) {
        throw new Error('Email já cadastrado');
      }

      // Cria o usuário baseado no tipo
      const id = db.gerarId();
      const restricoes = dados.restricoes || [];

      let usuario;
      
      switch(dados.tipo.toLowerCase()) {
        case 'comum':
          usuario = new UsuarioComum(
            id, dados.nome, dados.email, dados.idade, 
            dados.peso, dados.altura, restricoes
          );
          break;
        
        case 'diabetico':
          usuario = new UsuarioDiabetico(
            id, dados.nome, dados.email, dados.idade, 
            dados.peso, dados.altura, restricoes
          );
          break;
        
        case 'atleta':
          usuario = new UsuarioAtleta(
            id, dados.nome, dados.email, dados.idade, 
            dados.peso, dados.altura, restricoes
          );
          break;
        
        default:
          throw new Error('Tipo de usuário inválido');
      }

      // Salva no banco
      db.salvarUsuario(usuario.toJSON());

      return {
        sucesso: true,
        mensagem: 'Usuário cadastrado com sucesso!',
        usuario: usuario.toJSON()
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }

  static login(credencial) {
    try {
      if (!credencial || credencial.trim() === '') {
        throw new Error('Informe o email ou nome');
      }

      // Busca por email ou nome
      let usuarioData = db.buscarUsuarioPorEmail(credencial);
      
      if (!usuarioData) {
        usuarioData = db.buscarUsuarioPorNome(credencial);
      }

      if (!usuarioData) {
        throw new Error('Usuário não encontrado');
      }

      // Reconstrói o objeto de usuário com a classe correta
      const usuario = this.#reconstruirUsuario(usuarioData);

      // Salva como logado
      db.salvarUsuarioLogado(usuario.toJSON());

      return {
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        usuario: usuario.toJSON()
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }

  static logout() {
    db.removerUsuarioLogado();
    return {
      sucesso: true,
      mensagem: 'Logout realizado com sucesso!'
    };
  }

  static obterUsuarioLogado() {
    const usuarioData = db.obterUsuarioLogado();
    
    if (!usuarioData) {
      return null;
    }

    return this.#reconstruirUsuario(usuarioData);
  }

  static estaLogado() {
    return db.estaLogado();
  }

  static atualizar(id, dadosAtualizados) {
    try {
      const resultado = db.atualizarUsuario(id, dadosAtualizados);
      
      if (!resultado) {
        throw new Error('Usuário não encontrado');
      }

      // Atualiza também o usuário logado se for o mesmo
      const usuarioLogado = db.obterUsuarioLogado();
      if (usuarioLogado && usuarioLogado.id === id) {
        db.salvarUsuarioLogado(resultado);
      }

      return {
        sucesso: true,
        mensagem: 'Usuário atualizado com sucesso!',
        usuario: resultado
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }

  static excluir(id) {
    try {
      const resultado = db.excluirUsuario(id);
      
      if (!resultado) {
        throw new Error('Usuário não encontrado');
      }

      // Remove do login se for o usuário logado
      const usuarioLogado = db.obterUsuarioLogado();
      if (usuarioLogado && usuarioLogado.id === id) {
        db.removerUsuarioLogado();
      }

      return {
        sucesso: true,
        mensagem: 'Usuário excluído com sucesso!'
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }

  static obterPerfil(id) {
    const usuarioData = db.buscarUsuarioPorId(id);
    
    if (!usuarioData) {
      return null;
    }

    const usuario = this.#reconstruirUsuario(usuarioData);
    const estatisticas = db.obterEstatisticas(id);

    return {
      ...usuario.toJSON(),
      imc: usuario.calcularIMC(),
      estatisticas,
      recomendacoes: usuario.gerarRecomendacoes()
    };
  }

  // Método privado para reconstruir o usuário com a classe correta
  static #reconstruirUsuario(data) {
    switch(data.tipo.toLowerCase()) {
      case 'comum':
        return UsuarioComum.fromJSON(data);
      case 'diabetico':
        return UsuarioDiabetico.fromJSON(data);
      case 'atleta':
        return UsuarioAtleta.fromJSON(data);
      default:
        return UsuarioComum.fromJSON(data);
    }
  }
}