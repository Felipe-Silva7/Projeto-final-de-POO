// src/models/Refeicao/Refeicao.js

export class Refeicao {
  #id;
  #tipo;
  #alimentos;
  #horario;
  #data;
  #analise;

  constructor(id, tipo, alimentos, horario, data) {
    this.#id = id;
    this.#tipo = tipo;
    this.#alimentos = alimentos;
    this.#horario = horario;
    this.#data = data;
    this.#analise = null;
  }

  // Getters
  get id() {
    return this.#id;
  }

  get tipo() {
    return this.#tipo;
  }

  get alimentos() {
    return [...this.#alimentos];
  }

  get horario() {
    return this.#horario;
  }

  get data() {
    return this.#data;
  }

  get analise() {
    return this.#analise;
  }

  // Setters
  set tipo(valor) {
    const tiposValidos = ['café da manhã', 'lanche da manhã', 'almoço', 
                          'lanche da tarde', 'jantar', 'ceia'];
    if (!tiposValidos.includes(valor.toLowerCase())) {
      throw new Error('Tipo de refeição inválido');
    }
    this.#tipo = valor;
  }

  set alimentos(valor) {
    if (!Array.isArray(valor) || valor.length === 0) {
      throw new Error('Deve haver pelo menos um alimento');
    }
    this.#alimentos = valor;
  }

  set horario(valor) {
    // Validação básica de formato HH:MM
    if (!/^\d{2}:\d{2}$/.test(valor)) {
      throw new Error('Horário inválido. Use formato HH:MM');
    }
    this.#horario = valor;
  }

  set analise(valor) {
    this.#analise = valor;
  }

  // Métodos
  adicionarAlimento(alimento) {
    this.#alimentos.push(alimento);
  }

  removerAlimento(index) {
    if (index >= 0 && index < this.#alimentos.length) {
      this.#alimentos.splice(index, 1);
    }
  }

  calcularQuantidadeTotal() {
    return this.#alimentos.reduce((total, alimento) => {
      const quantidade = parseInt(alimento.quantidade) || 0;
      return total + quantidade;
    }, 0);
  }

  toJSON() {
    return {
      id: this.#id,
      tipo: this.#tipo,
      alimentos: this.#alimentos,
      horario: this.#horario,
      data: this.#data,
      analise: this.#analise
    };
  }

  static fromJSON(data) {
    const refeicao = new Refeicao(
      data.id,
      data.tipo,
      data.alimentos,
      data.horario,
      data.data
    );
    
    if (data.analise) {
      refeicao.analise = data.analise;
    }
    
    return refeicao;
  }
}