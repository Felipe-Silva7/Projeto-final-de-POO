class Usuario {
	#id;
	#nome;
	#idade;
	#peso; // em kg
	#altura; // em cm
	#objetivo;
	#sexo;
	#limitacoes;
	#refeicoes;

	constructor(id, nome, idade, peso, altura, objetivo, sexo, limitacoes = []) {
		this.#id = id;
		this.#nome = nome || '';
		this.#idade = idade || 0;
		this.#peso = peso || 0;
		this.#altura = altura || 0;
		this.#objetivo = objetivo || '';
		this.#sexo = sexo || '';
		this.#limitacoes = limitacoes;
		this.#refeicoes = [];
	}

	// --- Getters para acesso controlado ---
	get id() { return this.#id; }
	get nome() { return this.#nome; }
	get idade() { return this.#idade; }
	get peso() { return this.#peso; }
	get altura() { return this.#altura; }
	get objetivo() { return this.#objetivo; }
	get sexo() { return this.#sexo; }
	get limitacoes() { return [...this.#limitacoes]; } // Retorna uma cópia para proteger o array original
	get refeicoes() { return [...this.#refeicoes]; } // Retorna uma cópia

	// --- Métodos Públicos (Interface da classe) ---
	login() {
		console.log("Usuário " + this.#nome + " logado com sucesso!");
	}

	logout() {
		console.log("Usuário " + this.#nome + " deslogado com sucesso!");
	}

	adicionarRefeicao(refeicao) {
		this.#refeicoes.push(refeicao);
	}

	setPeso(novoPeso) {
		if (novoPeso > 0) {
			this.#peso = novoPeso;
		} else {
			console.error("O peso deve ser um valor positivo.");
		}
	}

	toJSON() {
		return {
			id: this.#id,
			nome: this.#nome,
			idade: this.#idade,
			peso: this.#peso,
			altura: this.#altura,
			objetivo: this.#objetivo,
			sexo: this.#sexo,
			limitacoes: this.#limitacoes,
			refeicoes: this.#refeicoes
		};
	}
}

export default Usuario;