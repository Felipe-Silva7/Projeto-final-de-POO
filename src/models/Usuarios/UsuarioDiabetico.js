// src/models/Usuario/UsuarioDiabetico.js

import { Usuario } from './Usuario.js';

export class UsuarioDiabetico extends Usuario {
  constructor(id, nome, email, idade, peso, altura, restricoes = []) {
    super(id, nome, email, idade, peso, altura, 'diabetico', restricoes);
  }

  analisarRefeicao(refeicao) {
    const analise = {
      status: 'adequada',
      mensagem: '',
      alertas: [],
      pontosPositivos: []
    };

    const alimentos = refeicao.alimentos.map(a => a.nome.toLowerCase());
    
    // Carboidratos simples (alto IG)
    const carboidratosSimples = ['açúcar', 'doce', 'refrigerante', 'suco', 
                                 'pão branco', 'arroz branco', 'batata', 
                                 'massa branca', 'bolo', 'sorvete'];
    const temCarboSimples = alimentos.some(a => 
      carboidratosSimples.some(c => a.includes(c))
    );

    if (temCarboSimples) {
      analise.alertas.push('⚠️ ATENÇÃO: Carboidratos simples detectados. Alto índice glicêmico!');
      analise.status = 'inadequada';
    }

    // Carboidratos complexos (baixo IG)
    const carboidratosComplexos = ['arroz integral', 'aveia', 'quinoa', 
                                   'batata doce', 'feijão', 'lentilha', 
                                   'grão de bico', 'pão integral'];
    const temCarboComplexo = alimentos.some(a => 
      carboidratosComplexos.some(c => a.includes(c))
    );

    if (temCarboComplexo) {
      analise.pontosPositivos.push('✓ Ótima escolha: carboidratos complexos');
    }

    // Verificar quantidade total de carboidratos
    const carboidratos = refeicao.alimentos.filter(a => {
      const nome = a.nome.toLowerCase();
      return carboidratosSimples.some(c => nome.includes(c)) ||
             carboidratosComplexos.some(c => nome.includes(c)) ||
             nome.includes('arroz') || nome.includes('pão') || nome.includes('massa');
    });

    const totalCarbo = carboidratos.reduce((total, a) => {
      return total + (parseInt(a.quantidade) || 0);
    }, 0);

    if (totalCarbo > 150) {
      analise.alertas.push('Quantidade de carboidratos muito alta. Controle necessário!');
      analise.status = 'inadequada';
    } else if (totalCarbo > 0 && totalCarbo <= 100) {
      analise.pontosPositivos.push('Quantidade de carboidratos controlada');
    }

    // Verificar proteínas (importante para controle)
    const proteinas = ['carne', 'frango', 'peixe', 'ovo', 'queijo'];
    const temProteina = alimentos.some(a => 
      proteinas.some(p => a.includes(p))
    );

    if (temProteina) {
      analise.pontosPositivos.push('✓ Proteínas presentes (ajudam no controle glicêmico)');
    }

    // Verificar fibras
    const fibras = ['salada', 'verdura', 'legume', 'brócolis', 'couve'];
    const temFibra = alimentos.some(a => 
      fibras.some(f => a.includes(f))
    );

    if (temFibra) {
      analise.pontosPositivos.push('✓ Fibras presentes (melhoram absorção de glicose)');
    } else {
      analise.alertas.push('Inclua mais fibras para melhor controle glicêmico');
      if (analise.status === 'adequada') analise.status = 'moderada';
    }

    // Horário da refeição
    const hora = parseInt(refeicao.horario.split(':')[0]);
    if (hora > 21) {
      analise.alertas.push('Refeição muito tarde. Evite carboidratos à noite');
      if (analise.status === 'adequada') analise.status = 'moderada';
    }

    // Mensagem final
    if (analise.status === 'adequada') {
      analise.mensagem = '✓ Refeição adequada para controle glicêmico!';
    } else if (analise.status === 'moderada') {
      analise.mensagem = 'Refeição aceitável, mas atenção aos alertas.';
    } else {
      analise.mensagem = '⚠️ ATENÇÃO: Refeição pode afetar sua glicemia!';
    }

    return analise;
  }

  gerarRecomendacoes() {
    return [
      '🚫 EVITE: açúcares, doces, refrigerantes e carboidratos simples',
      '✓ PRIORIZE: carboidratos complexos (arroz integral, aveia, quinoa)',
      '✓ Inclua proteínas em todas as refeições',
      '✓ Aumente o consumo de fibras (verduras, legumes)',
      '⏰ Mantenha horários regulares para as refeições',
      '💧 Hidrate-se bem ao longo do dia',
      '📊 Monitore sempre a quantidade de carboidratos'
    ];
  }

  static fromJSON(data) {
    const usuario = new UsuarioDiabetico(
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