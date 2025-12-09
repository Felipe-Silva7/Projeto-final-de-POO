// src/models/Usuario/UsuarioAtleta.js

import { Usuario } from './Usuario.js';

export class UsuarioAtleta extends Usuario {
  constructor(id, nome, email, idade, peso, altura, restricoes = []) {
    super(id, nome, email, idade, peso, altura, 'atleta', restricoes);
  }

  analisarRefeicao(refeicao) {
    const analise = {
      status: 'adequada',
      mensagem: '',
      alertas: [],
      pontosPositivos: []
    };

    const alimentos = refeicao.alimentos.map(a => a.nome.toLowerCase());
    
    // Verificar proteínas (essencial para hipertrofia)
    const proteinas = ['carne', 'frango', 'peixe', 'ovo', 'whey', 'queijo', 
                      'iogurte', 'leite', 'atum', 'peito de frango'];
    const temProteina = alimentos.some(a => 
      proteinas.some(p => a.includes(p))
    );

    if (temProteina) {
      analise.pontosPositivos.push('💪 Excelente! Proteínas presentes');
      
      // Verificar quantidade de proteína
      const proteinasRefeicao = refeicao.alimentos.filter(a => {
        const nome = a.nome.toLowerCase();
        return proteinas.some(p => nome.includes(p));
      });
      
      const totalProteina = proteinasRefeicao.reduce((total, a) => {
        return total + (parseInt(a.quantidade) || 0);
      }, 0);
      
      if (totalProteina < 150) {
        analise.alertas.push('Aumente a quantidade de proteína (mínimo 150g)');
        analise.status = 'moderada';
      } else {
        analise.pontosPositivos.push('✓ Quantidade de proteína adequada');
      }
    } else {
      analise.alertas.push('⚠️ CRÍTICO: Falta de proteína! Essencial para hipertrofia');
      analise.status = 'inadequada';
    }

    // Verificar carboidratos complexos (energia para treino)
    const carboidratosComplexos = ['arroz', 'batata doce', 'aveia', 'macarrão', 
                                   'pão integral', 'banana', 'mandioca'];
    const temCarbo = alimentos.some(a => 
      carboidratosComplexos.some(c => a.includes(c))
    );

    if (temCarbo) {
      analise.pontosPositivos.push('✓ Carboidratos complexos para energia');
    } else {
      analise.alertas.push('Inclua carboidratos para energia no treino');
      if (analise.status === 'adequada') analise.status = 'moderada';
    }

    // Verificar calorias totais (estimativa básica)
    const totalQuantidade = refeicao.alimentos.reduce((total, a) => {
      return total + (parseInt(a.quantidade) || 0);
    }, 0);

    if (totalQuantidade < 300) {
      analise.alertas.push('⚠️ Refeição pequena! Evite déficit calórico');
      analise.status = 'inadequada';
    } else if (totalQuantidade >= 400) {
      analise.pontosPositivos.push('✓ Refeição volumosa, ótimo para ganho de massa');
    }

    // Verificar gorduras boas
    const gordurasBoas = ['abacate', 'castanha', 'amendoim', 'azeite', 'salmão'];
    const temGorduraBoa = alimentos.some(a => 
      gordurasBoas.some(g => a.includes(g))
    );

    if (temGorduraBoa) {
      analise.pontosPositivos.push('✓ Gorduras saudáveis presentes');
    }

    // Verificar horário (frequência de refeições)
    const hora = parseInt(refeicao.horario.split(':')[0]);
    const refeicoesHoje = this.obterRefeicoesDoDia(refeicao.data);
    
    if (refeicoesHoje.length < 4 && hora > 15) {
      analise.alertas.push('Aumente a frequência de refeições (5-6 por dia)');
      if (analise.status === 'adequada') analise.status = 'moderada';
    }

    // Verificar alimentos que atrapalham
    const evitar = ['refrigerante', 'fritura', 'fast food', 'álcool'];
    const temProblema = alimentos.some(a => 
      evitar.some(e => a.includes(e))
    );

    if (temProblema) {
      analise.alertas.push('Evite alimentos que atrapalham seus ganhos');
      analise.status = 'moderada';
    }

    // Mensagem final
    if (analise.status === 'adequada') {
      analise.mensagem = '💪 Refeição perfeita para hipertrofia! Continue assim!';
    } else if (analise.status === 'moderada') {
      analise.mensagem = 'Refeição boa, mas pode otimizar para melhores resultados.';
    } else {
      analise.mensagem = '⚠️ Refeição inadequada para seus objetivos de ganho de massa!';
    }

    return analise;
  }

  gerarRecomendacoes() {
    const pesoEmKg = this.peso;
    const proteinaMinima = (pesoEmKg * 2).toFixed(0); // 2g/kg
    
    return [
      `💪 Meta de proteína: ${proteinaMinima}g/dia (2g por kg)`,
      '✓ Faça 5-6 refeições por dia',
      '✓ Priorize: frango, carne, peixe, ovos, whey',
      '✓ Carboidratos: arroz, batata doce, aveia, macarrão',
      '✓ Inclua gorduras boas: abacate, castanhas, azeite',
      '⚠️ EVITE déficit calórico - coma mais!',
      '💧 Hidratação: mínimo 3L de água por dia',
      '⏰ Não pule refeições, especialmente pós-treino'
    ];
  }

  static fromJSON(data) {
    const usuario = new UsuarioAtleta(
      data.id,
      data.nome,
      data.email,
      data.idade,
      data.peso,
      data.altura,
      data.restricoes
    );
    
    if (data.refeicoes && data.refeicoes.length > 0) {
      data.refeicoes.forEach(r => usuario.adicionarRefeicao(r));
    }
    
    return usuario;
  }
}