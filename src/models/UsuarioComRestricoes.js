import Usuario from './Usuario';

class UsuarioComRestricoes extends Usuario {
	constructor(data = {}) {
		super(data);
		this.restricoes = data.restricoes || []; // ex.: ['gluten', 'açúcar']
	}

	analisarRestricoes(refeicao) {
		// Refeição esperada: { tipo: 'almoço', alimentos: ['arroz', 'feijão', ...] }
		const problemas = [];
		if (!refeicao || !Array.isArray(refeicao.alimentos)) return problemas;
		for (const alimento of refeicao.alimentos) {
			for (const r of this.restricoes) {
				if (!r) continue;
				if (String(alimento).toLowerCase().includes(String(r).toLowerCase())) {
					problemas.push({ alimento, restricao: r });
				}
			}
		}
		return problemas;
	}
}

export default UsuarioComRestricoes;