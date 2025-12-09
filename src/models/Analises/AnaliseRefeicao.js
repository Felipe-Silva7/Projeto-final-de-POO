// src/models/Analise/AnaliseRefeicao.js

export class AnaliseRefeicao {
  #refeicao;
  #usuario;
  #resultado;

  constructor(refeicao, usuario) {
    this.#refeicao = refeicao;
    this.#usuario = usuario;
    this.#resultado = null;
  }

  executarAnalise() {
    // Delega a análise para o método polimórfico do usuário
    this.#resultado = this.#usuario.analisarRefeicao(this.#refeicao);
    
    // Adiciona análise à refeição
    this.#refeicao.analise = this.#resultado;
    
    return this.#resultado;
  }

  get resultado() {
    return this.#resultado;
  }

  get status() {
    return this.#resultado?.status || 'pendente';
  }

  get mensagem() {
    return this.#resultado?.mensagem || '';
  }

  get alertas() {
    return this.#resultado?.alertas || [];
  }

  get pontosPositivos() {
    return this.#resultado?.pontosPositivos || [];
  }

  gerarResumo() {
    if (!this.#resultado) {
      return 'Análise não realizada';
    }

    let resumo = `Refeição: ${this.#refeicao.tipo}\n`;
    resumo += `Status: ${this.#resultado.status}\n`;
    resumo += `Mensagem: ${this.#resultado.mensagem}\n\n`;

    if (this.#resultado.pontosPositivos.length > 0) {
      resumo += 'Pontos Positivos:\n';
      this.#resultado.pontosPositivos.forEach(p => {
        resumo += `- ${p}\n`;
      });
      resumo += '\n';
    }

    if (this.#resultado.alertas.length > 0) {
      resumo += 'Alertas:\n';
      this.#resultado.alertas.forEach(a => {
        resumo += `- ${a}\n`;
      });
    }

    return resumo;
  }

  toJSON() {
    return {
      refeicao: this.#refeicao.toJSON(),
      usuario: {
        id: this.#usuario.id,
        nome: this.#usuario.nome,
        tipo: this.#usuario.tipo
      },
      resultado: this.#resultado
    };
  }
}