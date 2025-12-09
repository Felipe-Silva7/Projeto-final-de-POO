class CadastroRefeicoes {
    #refeicoes;      // lista privada de refeições
    #usuario;        // usuário vinculado (opcional, depende do seu sistema)

    constructor(usuario = null) {
        this.#refeicoes = [];
        this.#usuario = usuario;
    }

    // ---------- GETTERS CONTROLADOS ----------
    get todasRefeicoes() {
        // retorna cópia para evitar alterações externas
        return [...this.#refeicoes];
    }

    // ---------- MÉTODO PÚBLICO PARA ADICIONAR ----------
    adicionarRefeicao(refeicao) {
        if (!this.#validarRefeicao(refeicao)) {
            throw new Error("Refeição inválida ou proibida para este usuário.");
        }

        const registro = {
            refeicao,
            data: new Date()
        };

        this.#refeicoes.push(registro);
        return registro;
    }

    // ---------- MÉTODO PÚBLICO PARA LISTAR POR DATA ----------
    buscarPorData(data) {
        const dia = new Date(data).toDateString();
        return this.#refeicoes.filter(r => r.data.toDateString() === dia);
    }

    // ---------- MÉTODO PRIVADO ----------
    #validarRefeicao(refeicao) {
        if (!refeicao || typeof refeicao !== "string") {
            return false;
        }

        // validação extra se houver usuário com restrições
        if (this.#usuario && this.#usuario.restricoes) {
            return !this.#usuario.restricoes.includes(refeicao.toLowerCase());
        }

        return true;
    }
}


export default CadastroRefeicoes;