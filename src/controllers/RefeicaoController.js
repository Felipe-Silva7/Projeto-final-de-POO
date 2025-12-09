// src/controllers/RefeicaoController.js

import { db } from '../services/db.js';
import { Refeicao } from '../models/Refeicoes/Refeicao.js';
import { AnaliseRefeicao } from '../models/Analises/AnaliseRefeicao.js';
import { UsuarioController } from './UsuarioController.js';

export class RefeicaoController {
  
  static registrar(dados) {
    try {
      // Validações
      if (!dados.tipo || dados.tipo.trim() === '') {
        throw new Error('Tipo de refeição é obrigatório');
      }

      if (!dados.alimentos || dados.alimentos.length === 0) {
        throw new Error('Adicione pelo menos um alimento');
      }

      // Valida cada alimento
      dados.alimentos.forEach((alimento, index) => {
        if (!alimento.nome || alimento.nome.trim() === '') {
          throw new Error(`Nome do alimento ${index + 1} é obrigatório`);
        }
        if (!alimento.quantidade || alimento.quantidade.trim() === '') {
          throw new Error(`Quantidade do alimento ${index + 1} é obrigatória`);
        }
      });

      // Obtém usuário logado
      const usuario = UsuarioController.obterUsuarioLogado();
      
      if (!usuario) {
        throw new Error('Usuário não está logado');
      }

      // Cria a refeição
      const id = db.gerarId();
      const horario = dados.horario || db.obterHorarioAtual();
      const data = dados.data || db.obterDataAtual();

      const refeicao = new Refeicao(
        id,
        dados.tipo,
        dados.alimentos,
        horario,
        data
      );

      // Executa análise automática
      const analiseRefeicao = new AnaliseRefeicao(refeicao, usuario);
      const resultadoAnalise = analiseRefeicao.executarAnalise();

      // Salva no banco
      db.adicionarRefeicao(usuario.id, refeicao.toJSON());

      return {
        sucesso: true,
        mensagem: 'Refeição registrada com sucesso!',
        refeicao: refeicao.toJSON(),
        analise: resultadoAnalise
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }

  static listarPorData(usuarioId, data) {
    try {
      const refeicoes = db.obterRefeicoesPorData(usuarioId, data);
      
      return {
        sucesso: true,
        refeicoes,
        total: refeicoes.length
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message,
        refeicoes: []
      };
    }
  }

  static listarTodas(usuarioId) {
    try {
      const refeicoes = db.obterTodasRefeicoes(usuarioId);
      
      // Agrupa por data
      const refeicoesAgrupadas = {};
      refeicoes.forEach(refeicao => {
        if (!refeicoesAgrupadas[refeicao.data]) {
          refeicoesAgrupadas[refeicao.data] = [];
        }
        refeicoesAgrupadas[refeicao.data].push(refeicao);
      });

      return {
        sucesso: true,
        refeicoes,
        refeicoesAgrupadas,
        total: refeicoes.length
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message,
        refeicoes: []
      };
    }
  }

  static obterPorId(usuarioId, refeicaoId) {
    try {
      const todasRefeicoes = db.obterTodasRefeicoes(usuarioId);
      const refeicao = todasRefeicoes.find(r => r.id === refeicaoId);

      if (!refeicao) {
        throw new Error('Refeição não encontrada');
      }

      return {
        sucesso: true,
        refeicao
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }

  static excluir(usuarioId, refeicaoId) {
    try {
      const resultado = db.excluirRefeicao(usuarioId, refeicaoId);

      if (!resultado) {
        throw new Error('Refeição não encontrada');
      }

      return {
        sucesso: true,
        mensagem: 'Refeição excluída com sucesso!'
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }

  static obterRefeicoesDoDia(usuarioId) {
    const dataHoje = db.obterDataAtual();
    return this.listarPorData(usuarioId, dataHoje);
  }

  static obterHistorico(usuarioId, limite = 30) {
    try {
      const resultado = this.listarTodas(usuarioId);
      
      if (!resultado.sucesso) {
        throw new Error(resultado.mensagem);
      }

      // Ordena as datas do mais recente para o mais antigo
      const datas = Object.keys(resultado.refeicoesAgrupadas).sort().reverse();
      
      // Limita o número de dias
      const datasLimitadas = datas.slice(0, limite);
      
      const historico = datasLimitadas.map(data => {
        const refeicoesDia = resultado.refeicoesAgrupadas[data];
        
        return {
          data,
          totalRefeicoes: refeicoesDia.length,
          refeicoes: refeicoesDia,
          resumo: this.#gerarResumoRapido(refeicoesDia)
        };
      });

      return {
        sucesso: true,
        historico,
        totalDias: historico.length
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message,
        historico: []
      };
    }
  }

  static #gerarResumoRapido(refeicoes) {
    let adequadas = 0;
    let moderadas = 0;
    let inadequadas = 0;

    refeicoes.forEach(r => {
      if (r.analise) {
        if (r.analise.status === 'adequada') adequadas++;
        else if (r.analise.status === 'moderada') moderadas++;
        else inadequadas++;
      }
    });

    return {
      adequadas,
      moderadas,
      inadequadas,
      total: refeicoes.length
    };
  }

  static obterEstatisticas(usuarioId) {
    try {
      const resultado = this.listarTodas(usuarioId);
      
      if (!resultado.sucesso) {
        throw new Error(resultado.mensagem);
      }

      const refeicoes = resultado.refeicoes;
      
      // Estatísticas gerais
      let adequadas = 0;
      let moderadas = 0;
      let inadequadas = 0;

      refeicoes.forEach(r => {
        if (r.analise) {
          if (r.analise.status === 'adequada') adequadas++;
          else if (r.analise.status === 'moderada') moderadas++;
          else inadequadas++;
        }
      });

      // Tipos de refeição mais comuns
      const tiposContador = {};
      refeicoes.forEach(r => {
        tiposContador[r.tipo] = (tiposContador[r.tipo] || 0) + 1;
      });

      return {
        sucesso: true,
        estatisticas: {
          totalRefeicoes: refeicoes.length,
          adequadas,
          moderadas,
          inadequadas,
          percentualAdequadas: refeicoes.length > 0 
            ? Math.round((adequadas / refeicoes.length) * 100) 
            : 0,
          tiposMaisComuns: tiposContador,
          diasAtivos: Object.keys(resultado.refeicoesAgrupadas).length
        }
      };

    } catch (erro) {
      return {
        sucesso: false,
        mensagem: erro.message
      };
    }
  }
}