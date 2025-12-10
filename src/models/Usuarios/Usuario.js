// src/models/Usuario/Usuario.js

export class Usuario {
  #id;
  #nome;
  #email;
  #idade;
  #peso;
  #altura;
  #tipo;
  #restricoes;
  #refeicoes;

  constructor(id, nome, email, idade, peso, altura, tipo, restricoes = []) {
    if (this.constructor === Usuario) {
      throw new Error("Classe Usuario é abstrata e não pode ser instanciada diretamente.");
    }
    this.#id = id;
    this.#nome = nome;
    this.#email = email;
    this.#idade = idade;
    this.#peso = peso;
    this.#altura = altura;
    this.#tipo = tipo;
    this.#restricoes = restricoes;
    this.#refeicoes = [];
    
  }

  // Getters
  get id() {
    return this.#id;
  }

  get nome() {
    return this.#nome;
  }

  get email() {
    return this.#email;
  }

  get idade() {
    return this.#idade;
  }

  get peso() {
    return this.#peso;
  }

  get altura() {
    return this.#altura;
  }

  get tipo() {
    return this.#tipo;
  }

  get restricoes() {
    return [...this.#restricoes];
  }

  get refeicoes() {
    return [...this.#refeicoes];
  }

  // Setters
  set nome(valor) {
    if (!valor || valor.trim() === '') {
      throw new Error('Nome não pode ser vazio');
    }
    this.#nome = valor;
  }

  set email(valor) {
    if (!valor || !valor.includes('@')) {
      throw new Error('Email inválido');
    }
    this.#email = valor;
  }

  set idade(valor) {
    if (valor <= 0 || valor > 120) {
      throw new Error('Idade inválida');
    }
    this.#idade = valor;
  }

  set peso(valor) {
    if (valor <= 0) {
      throw new Error('Peso inválido');
    }
    this.#peso = valor;
  }

  set altura(valor) {
    if (valor <= 0 || valor > 3) {
      throw new Error('Altura inválida');
    }
    this.#altura = valor;
  }

  set restricoes(valor) {
    this.#restricoes = Array.isArray(valor) ? valor : [valor];
  }

  // Métodos
  adicionarRefeicao(refeicao) {
    this.#refeicoes.push(refeicao);
  }

  obterRefeicoesDoDia(data) {
    return this.#refeicoes.filter(r => r.data === data);
  }

  calcularIMC() {
    return (this.#peso / (this.#altura * this.#altura)).toFixed(2);
  }

  analisarRefeicao(refeicao) {
    // Método base - será sobrescrito pelas subclasses
    return {
      status: 'adequada',
      mensagem: 'Refeição registrada com sucesso'
    };
  }

  gerarRecomendacoes() {
    // Método base - será sobrescrito pelas subclasses
    return ['Mantenha uma alimentação equilibrada'];
  }

  toJSON() {
    return {
      id: this.#id,
      nome: this.#nome,
      email: this.#email,
      idade: this.#idade,
      peso: this.#peso,
      altura: this.#altura,
      tipo: this.#tipo,
      restricoes: this.#restricoes,
      refeicoes: this.#refeicoes
    };
  }

  static fromJSON(data) {
    return new Usuario(
      data.id,
      data.nome,
      data.email,
      data.idade,
      data.peso,
      data.altura,
      data.tipo,
      data.restricoes
    );
  }
}