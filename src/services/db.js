// src/services/db.js

import { LocalStorage } from 'node-localstorage';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria o localStorage que salvará em ./data (você pode mudar o caminho)
const localStorage = new LocalStorage(path.join(__dirname, '../../data'));

class Database {
  constructor() {
    this.usuariosKey = 'vivabem_usuarios';
    this.usuarioLogadoKey = 'vivabem_usuario_logado';
    this.localStorage = localStorage;
    this.inicializar();
  }

  inicializar() {
    if (!this.localStorage.getItem(this.usuariosKey)) {
      this.localStorage.setItem(this.usuariosKey, JSON.stringify([]));
    }
  }

  // === OPERAÇÕES COM USUÁRIOS ===
  
  obterTodosUsuarios() {
    const dados = this.localStorage.getItem(this.usuariosKey);
    return dados ? JSON.parse(dados) : [];
  }

  salvarUsuario(usuario) {
    const usuarios = this.obterTodosUsuarios();
    
    // Verifica se já existe
    const index = usuarios.findIndex(u => u.id === usuario.id);
    
    if (index !== -1) {
      usuarios[index] = usuario;
    } else {
      usuarios.push(usuario);
    }
    
    this.localStorage.setItem(this.usuariosKey, JSON.stringify(usuarios));
    return usuario;
  }

  buscarUsuarioPorId(id) {
    const usuarios = this.obterTodosUsuarios();
    return usuarios.find(u => u.id === id) || null;
  }

  buscarUsuarioPorEmail(email) {
    const usuarios = this.obterTodosUsuarios();
    return usuarios.find(u => u.email === email) || null;
  }

  buscarUsuarioPorNome(nome) {
    const usuarios = this.obterTodosUsuarios();
    return usuarios.find(u => u.nome.toLowerCase() === nome.toLowerCase()) || null;
  }

  excluirUsuario(id) {
    let usuarios = this.obterTodosUsuarios();
    usuarios = usuarios.filter(u => u.id !== id);
    this.localStorage.setItem(this.usuariosKey, JSON.stringify(usuarios));
    return true;
  }

  atualizarUsuario(id, dadosAtualizados) {
    const usuarios = this.obterTodosUsuarios();
    const index = usuarios.findIndex(u => u.id === id);
    
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], ...dadosAtualizados };
      this.localStorage.setItem(this.usuariosKey, JSON.stringify(usuarios));
      return usuarios[index];
    }
    
    return null;
  }

  // === USUÁRIO LOGADO ===
  
  salvarUsuarioLogado(usuario) {
    this.localStorage.setItem(this.usuarioLogadoKey, JSON.stringify(usuario));
  }

  obterUsuarioLogado() {
    const dados = this.localStorage.getItem(this.usuarioLogadoKey);
    return dados ? JSON.parse(dados) : null;
  }

  removerUsuarioLogado() {
    this.localStorage.removeItem(this.usuarioLogadoKey);
  }

  estaLogado() {
    return this.obterUsuarioLogado() !== null;
  }

  // === OPERAÇÕES COM REFEIÇÕES ===
  
  adicionarRefeicao(usuarioId, refeicao) {
    const usuarios = this.obterTodosUsuarios();
    const usuario = usuarios.find(u => u.id === usuarioId);
    
    if (usuario) {
      if (!usuario.refeicoes) {
        usuario.refeicoes = [];
      }
      
      usuario.refeicoes.push(refeicao);
      this.salvarUsuario(usuario);
      
      // Atualiza também o usuário logado se for o mesmo
      const usuarioLogado = this.obterUsuarioLogado();
      if (usuarioLogado && usuarioLogado.id === usuarioId) {
        this.salvarUsuarioLogado(usuario);
      }
      
      return refeicao;
    }
    
    return null;
  }

  obterRefeicoesPorData(usuarioId, data) {
    const usuario = this.buscarUsuarioPorId(usuarioId);
    
    if (usuario && usuario.refeicoes) {
      return usuario.refeicoes.filter(r => r.data === data);
    }
    
    return [];
  }

  obterTodasRefeicoes(usuarioId) {
    const usuario = this.buscarUsuarioPorId(usuarioId);
    return usuario?.refeicoes || [];
  }

  excluirRefeicao(usuarioId, refeicaoId) {
    const usuarios = this.obterTodosUsuarios();
    const usuario = usuarios.find(u => u.id === usuarioId);
    
    if (usuario && usuario.refeicoes) {
      usuario.refeicoes = usuario.refeicoes.filter(r => r.id !== refeicaoId);
      this.salvarUsuario(usuario);
      
      // Atualiza também o usuário logado se for o mesmo
      const usuarioLogado = this.obterUsuarioLogado();
      if (usuarioLogado && usuarioLogado.id === usuarioId) {
        this.salvarUsuarioLogado(usuario);
      }
      
      return true;
    }
    
    return false;
  }

  // === UTILIDADES ===
  
  gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  obterDataAtual() {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  }

  obterHorarioAtual() {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  limparTodosDados() {
    this.localStorage.removeItem(this.usuariosKey);
    this.localStorage.removeItem(this.usuarioLogadoKey);
    this.inicializar();
  }

  exportarDados() {
    return {
      usuarios: this.obterTodosUsuarios(),
      usuarioLogado: this.obterUsuarioLogado(),
      dataExportacao: new Date().toISOString()
    };
  }

  importarDados(dados) {
    if (dados.usuarios) {
      this.localStorage.setItem(this.usuariosKey, JSON.stringify(dados.usuarios));
    }
    if (dados.usuarioLogado) {
      this.localStorage.setItem(this.usuarioLogadoKey, JSON.stringify(dados.usuarioLogado));
    }
  }

  // === ESTATÍSTICAS ===
  
  obterEstatisticas(usuarioId) {
    const usuario = this.buscarUsuarioPorId(usuarioId);
    
    if (!usuario || !usuario.refeicoes) {
      return {
        totalRefeicoes: 0,
        diasAtivos: 0,
        mediaPorDia: 0
      };
    }

    const refeicoes = usuario.refeicoes;
    const diasUnicos = new Set(refeicoes.map(r => r.data));

    return {
      totalRefeicoes: refeicoes.length,
      diasAtivos: diasUnicos.size,
      mediaPorDia: diasUnicos.size > 0 ? (refeicoes.length / diasUnicos.size).toFixed(1) : 0
    };
  }
}

// Exporta uma instância única (Singleton)
export const db = new Database();