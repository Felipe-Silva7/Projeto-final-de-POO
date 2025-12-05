import Usuario from './Usuario';

class UsuarioComum extends Usuario {
	constructor(data = {}) {
		super(data);
	}

	recomendar() {
		// Lógica de exemplo; pode ser substituída por análise real
		return `Recomendações gerais para ${this.nome || 'usuário'} com objetivo "${this.objetivo || 'manutenção'}".`;
	}
    
    calcularIMC() {
		if (!this.altura) return null;
		const alturaMetros = this.altura / 100;
		return Number((this.peso / (alturaMetros * alturaMetros)).toFixed(2));
	}
}

export default UsuarioComum;