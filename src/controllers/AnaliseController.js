// src/controllers/AnaliseController.js

import { db } from '../services/db.js';
import { AnaliseUsuario } from '../models/Analises/AnaliseUsuario.js';
import { UsuarioController } from './UsuarioController.js';

export class AnaliseController {

    static gerarAnaliseDiaria(usuarioId, data) {
        try {
            // Obtém o usuário
            const usuario = this.#obterUsuarioCompleto(usuarioId);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            // Usa a data fornecida ou a data atual
            const dataAnalise = data || db.obterDataAtual();

            // Cria o analisador
            const analiseUsuario = new AnaliseUsuario(usuario, dataAnalise);

            // Gera a análise
            const resultado = analiseUsuario.gerarAnaliseDiaria();
            const relatorio = analiseUsuario.gerarRelatorio();

            return {
                sucesso: true,
                analise: resultado,
                relatorio
            };

        } catch (erro) {
            return {
                sucesso: false,
                mensagem: erro.message
            };
        }
    }

    static gerarAnaliseSemanal(usuarioId) {
        try {
            const usuario = this.#obterUsuarioCompleto(usuarioId);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            // Obtém os últimos 7 dias
            const hoje = new Date();
            const analisesSemana = [];

            for (let i = 6; i >= 0; i--) {
                const data = new Date(hoje);
                data.setDate(data.getDate() - i);
                const dataStr = data.toISOString().split('T')[0];

                const analiseUsuario = new AnaliseUsuario(usuario, dataStr);
                const analise = analiseUsuario.gerarAnaliseDiaria();

                analisesSemana.push({
                    data: dataStr,
                    diaSemana: this.#obterDiaSemana(data),
                    analise
                });
            }

            // Calcula médias da semana
            const indicesMedios = analisesSemana
                .map(a => a.analise.indice)
                .filter(i => i > 0);

            const indiceMedia = indicesMedios.length > 0
                ? Math.round(indicesMedios.reduce((a, b) => a + b, 0) / indicesMedios.length)
                : 0;

            const totalRefeicoes = analisesSemana
                .reduce((total, a) => total + a.analise.totalRefeicoes, 0);

            return {
                sucesso: true,
                semana: analisesSemana,
                resumoSemanal: {
                    indiceMedia,
                    totalRefeicoes,
                    mediaPorDia: (totalRefeicoes / 7).toFixed(1),
                    diasAtivos: analisesSemana.filter(a => a.analise.totalRefeicoes > 0).length
                }
            };

        } catch (erro) {
            return {
                sucesso: false,
                mensagem: erro.message
            };
        }
    }

    static gerarAnaliseMensal(usuarioId) {
        try {
            const usuario = this.#obterUsuarioCompleto(usuarioId);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            // Obtém os últimos 30 dias
            const hoje = new Date();
            const analisesMes = [];

            for (let i = 29; i >= 0; i--) {
                const data = new Date(hoje);
                data.setDate(data.getDate() - i);
                const dataStr = data.toISOString().split('T')[0];

                const analiseUsuario = new AnaliseUsuario(usuario, dataStr);
                const analise = analiseUsuario.gerarAnaliseDiaria();

                if (analise.totalRefeicoes > 0) {
                    analisesMes.push({
                        data: dataStr,
                        analise
                    });
                }
            }

            // Calcula estatísticas do mês
            const indices = analisesMes.map(a => a.analise.indice);
            const indiceMedia = indices.length > 0
                ? Math.round(indices.reduce((a, b) => a + b, 0) / indices.length)
                : 0;

            const totalRefeicoes = analisesMes
                .reduce((total, a) => total + a.analise.totalRefeicoes, 0);

            return {
                sucesso: true,
                mes: analisesMes,
                resumoMensal: {
                    indiceMedia,
                    totalRefeicoes,
                    diasAtivos: analisesMes.length,
                    mediaPorDia: analisesMes.length > 0
                        ? (totalRefeicoes / analisesMes.length).toFixed(1)
                        : 0
                }
            };

        } catch (erro) {
            return {
                sucesso: false,
                mensagem: erro.message
            };
        }
    }

    static gerarRecomendacoes(usuarioId) {
        try {
            const usuario = this.#obterUsuarioCompleto(usuarioId);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            // Obtém recomendações personalizadas baseadas no tipo
            const recomendacoes = usuario.gerarRecomendacoes();

            // Análise dos últimos 7 dias para recomendações adicionais
            const analiseSemanalf = this.gerarAnaliseSemanal(usuarioId);

            const recomendacoesAdicionais = [];

            if (analiseSemanalf.sucesso) {
                const resumo = analiseSemanalf.resumoSemanal;

                if (resumo.diasAtivos < 5) {
                    recomendacoesAdicionais.push('⚠️ Aumente a consistência! Registre suas refeições todos os dias.');
                }

                if (resumo.mediaPorDia < 3) {
                    recomendacoesAdicionais.push('⚠️ Poucas refeições por dia. Tente fazer pelo menos 3-4 refeições.');
                }

                if (resumo.indiceMedia < 60) {
                    recomendacoesAdicionais.push('⚠️ Qualidade das refeições pode melhorar. Revise os alertas.');
                }
            }

            return {
                sucesso: true,
                recomendacoes: {
                    personalizadas: recomendacoes,
                    baseadasNoComportamento: recomendacoesAdicionais
                }
            };

        } catch (erro) {
            return {
                sucesso: false,
                mensagem: erro.message
            };
        }
    }

    static compararPeriodos(usuarioId, dataInicio1, dataFim1, dataInicio2, dataFim2) {
        try {
            const usuario = this.#obterUsuarioCompleto(usuarioId);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const periodo1 = this.#analisarPeriodo(usuario, dataInicio1, dataFim1);
            const periodo2 = this.#analisarPeriodo(usuario, dataInicio2, dataFim2);

            return {
                sucesso: true,
                periodo1,
                periodo2,
                comparacao: {
                    diferencaIndice: periodo2.indiceMedia - periodo1.indiceMedia,
                    diferencaRefeicoes: periodo2.totalRefeicoes - periodo1.totalRefeicoes,
                    melhorou: periodo2.indiceMedia > periodo1.indiceMedia
                }
            };

        } catch (erro) {
            return {
                sucesso: false,
                mensagem: erro.message
            };
        }
    }

    // === MÉTODOS PRIVADOS ===

    static #obterUsuarioCompleto(usuarioId) {
        const usuarioData = db.buscarUsuarioPorId(usuarioId);

        if (!usuarioData) {
            return null;
        }

        // Usa o UsuarioController para reconstruir com a classe correta
        const usuario = UsuarioController.obterUsuarioLogado();

        if (usuario && usuario.id === usuarioId) {
            return usuario;
        }

        // Se não for o usuário logado, reconstrói manualmente
        return this.#reconstruirUsuario(usuarioData);
    }

    static async #reconstruirUsuario(data) {
        // Importação dinâmica para evitar dependências circulares
        let usuario;

        switch (data.tipo.toLowerCase()) {
            case 'comum': {
                const module = await import('../models/Usuarios/UsuarioComum.js');
                usuario = module.UsuarioComum.fromJSON(data);
                break;
            }
            case 'diabetico': {
                const module = await import('../models/Usuarios/UsuarioDiabetico.js');
                usuario = module.UsuarioDiabetico.fromJSON(data);
                break;
            }
            case 'atleta': {
                const module = await import('../models/Usuarios/UsuarioAtleta.js');
                usuario = module.UsuarioAtleta.fromJSON(data);
                break;
            }
            default: {
                const module = await import('../models/Usuarios/UsuarioComum.js');
                usuario = module.UsuarioComum.fromJSON(data);
            }
        }


        return usuario;
    }

    static #analisarPeriodo(usuario, dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        const analises = [];

        for (let data = new Date(inicio); data <= fim; data.setDate(data.getDate() + 1)) {
            const dataStr = data.toISOString().split('T')[0];
            const analiseUsuario = new AnaliseUsuario(usuario, dataStr);
            const analise = analiseUsuario.gerarAnaliseDiaria();

            if (analise.totalRefeicoes > 0) {
                analises.push(analise);
            }
        }

        const indices = analises.map(a => a.indice);
        const indiceMedia = indices.length > 0
            ? Math.round(indices.reduce((a, b) => a + b, 0) / indices.length)
            : 0;

        const totalRefeicoes = analises.reduce((total, a) => total + a.totalRefeicoes, 0);

        return {
            dataInicio,
            dataFim,
            diasAtivos: analises.length,
            indiceMedia,
            totalRefeicoes,
            mediaPorDia: analises.length > 0
                ? (totalRefeicoes / analises.length).toFixed(1)
                : 0
        };
    }

    static #obterDiaSemana(data) {
        const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        return dias[data.getDay()];
    }
}