// src/models/Analise/AnaliseUsuario.js

export class AnaliseUsuario {
  #usuario;
  #data;
  #refeicoesDoDia;

  constructor(usuario, data) {
    this.#usuario = usuario;
    this.#data = data;
    this.#refeicoesDoDia = usuario.obterRefeicoesDoDia(data);
  }

  gerarAnaliseDiaria() {
    const analise = {
      data: this.#data,
      indice: 0,
      pontosPositivos: [],
      pontosNegativos: [],
      recomendacaoFinal: '',
      totalRefeicoes: this.#refeicoesDoDia.length,
      resumo: {}
    };

    // Análise básica
    if (this.#refeicoesDoDia.length === 0) {
      analise.indice = 0;
      analise.pontosNegativos.push('Nenhuma refeição registrada hoje');
      analise.recomendacaoFinal = 'Comece a registrar suas refeições para acompanhar sua alimentação';
      return analise;
    }

    // Contadores
    let refeicoesAdequadas = 0;
    let refeicoesModeradas = 0;
    let refeicoesInadequadas = 0;

    this.#refeicoesDoDia.forEach(refeicao => {
      if (refeicao.analise) {
        if (refeicao.analise.status === 'adequada') refeicoesAdequadas++;
        else if (refeicao.analise.status === 'moderada') refeicoesModeradas++;
        else refeicoesInadequadas++;
      }
    });

    // Cálculo do índice (0-100)
    const totalComAnalise = refeicoesAdequadas + refeicoesModeradas + refeicoesInadequadas;
    if (totalComAnalise > 0) {
      analise.indice = Math.round(
        ((refeicoesAdequadas * 100) + (refeicoesModeradas * 60) + (refeicoesInadequadas * 20)) 
        / totalComAnalise
      );
    }

    // Análise por tipo de usuário
    if (this.#usuario.tipo === 'atleta') {
      this.#analisarAtleta(analise);
    } else if (this.#usuario.tipo === 'diabetico') {
      this.#analisarDiabetico(analise);
    } else {
      this.#analisarComum(analise);
    }

    // Análise de frequência
    if (this.#refeicoesDoDia.length < 3) {
      analise.pontosNegativos.push('Poucas refeições no dia');
    } else if (this.#refeicoesDoDia.length >= 5) {
      analise.pontosPositivos.push('Boa frequência de refeições');
    }

    // Análise de consistência
    if (refeicoesAdequadas > refeicoesModeradas + refeicoesInadequadas) {
      analise.pontosPositivos.push('Maioria das refeições adequadas');
    }

    if (refeicoesInadequadas > refeicoesAdequadas) {
      analise.pontosNegativos.push('Muitas refeições inadequadas');
    }

    // Resumo
    analise.resumo = {
      adequadas: refeicoesAdequadas,
      moderadas: refeicoesModeradas,
      inadequadas: refeicoesInadequadas,
      total: this.#refeicoesDoDia.length
    };

    // Recomendação final baseada no índice
    if (analise.indice >= 80) {
      analise.recomendacaoFinal = 'Excelente dia! Continue assim!';
    } else if (analise.indice >= 60) {
      analise.recomendacaoFinal = 'Bom dia, mas há espaço para melhorias';
    } else if (analise.indice >= 40) {
      analise.recomendacaoFinal = 'Dia regular. Atenção aos alertas';
    } else {
      analise.recomendacaoFinal = 'Dia difícil. Tente melhorar amanhã';
    }

    return analise;
  }

  #analisarAtleta(analise) {
    // Verifica proteína total
    let temProteinaEmTodas = true;
    this.#refeicoesDoDia.forEach(refeicao => {
      const temProteina = refeicao.alimentos.some(a => {
        const nome = a.nome.toLowerCase();
        return nome.includes('carne') || nome.includes('frango') || 
               nome.includes('peixe') || nome.includes('ovo') || nome.includes('whey');
      });
      if (!temProteina) temProteinaEmTodas = false;
    });

    if (temProteinaEmTodas) {
      analise.pontosPositivos.push('Proteína em todas as refeições');
    } else {
      analise.pontosNegativos.push('Faltou proteína em algumas refeições');
    }

    if (this.#refeicoesDoDia.length < 5) {
      analise.pontosNegativos.push('Aumente frequência para 5-6 refeições');
      analise.recomendacaoFinal = 'Aumente a frequência de refeições para melhor ganho de massa';
    }
  }

  #analisarDiabetico(analise) {
    // Verifica carboidratos simples
    let temCarboSimples = false;
    this.#refeicoesDoDia.forEach(refeicao => {
      const temProblema = refeicao.alimentos.some(a => {
        const nome = a.nome.toLowerCase();
        return nome.includes('açúcar') || nome.includes('doce') || 
               nome.includes('refrigerante');
      });
      if (temProblema) temCarboSimples = true;
    });

    if (temCarboSimples) {
      analise.pontosNegativos.push('Carboidratos simples detectados');
      analise.recomendacaoFinal = 'Evite carboidratos simples para melhor controle glicêmico';
    } else {
      analise.pontosPositivos.push('Sem carboidratos simples detectados');
    }

    // Regularidade
    if (this.#refeicoesDoDia.length >= 4 && this.#refeicoesDoDia.length <= 6) {
      analise.pontosPositivos.push('Frequência regular de refeições');
    }
  }

  #analisarComum(analise) {
    // Variedade de alimentos
    const todosAlimentos = this.#refeicoesDoDia.flatMap(r => 
      r.alimentos.map(a => a.nome.toLowerCase())
    );
    const alimentosUnicos = new Set(todosAlimentos);

    if (alimentosUnicos.size > 10) {
      analise.pontosPositivos.push('Boa variedade de alimentos');
    } else {
      analise.pontosNegativos.push('Pouca variedade de alimentos');
    }

    // Ultraprocessados
    const ultraprocessados = ['refrigerante', 'salgadinho', 'fast food'];
    const temUltra = todosAlimentos.some(a => 
      ultraprocessados.some(u => a.includes(u))
    );

    if (temUltra) {
      analise.pontosNegativos.push('Presença de ultraprocessados');
      analise.recomendacaoFinal = 'Reduza o consumo de ultraprocessados';
    }
  }

  gerarRelatorio() {
    const analise = this.gerarAnaliseDiaria();
    
    let relatorio = `═══════════════════════════════════════════\n`;
    relatorio += `   ANÁLISE DIÁRIA - ${analise.data}\n`;
    relatorio += `═══════════════════════════════════════════\n\n`;
    relatorio += `Índice de Qualidade: ${analise.indice}/100\n`;
    relatorio += `Total de Refeições: ${analise.totalRefeicoes}\n\n`;
    
    relatorio += `Resumo:\n`;
    relatorio += `  ✓ Adequadas: ${analise.resumo.adequadas}\n`;
    relatorio += `  ~ Moderadas: ${analise.resumo.moderadas}\n`;
    relatorio += `  ✗ Inadequadas: ${analise.resumo.inadequadas}\n\n`;

    if (analise.pontosPositivos.length > 0) {
      relatorio += `Pontos Positivos:\n`;
      analise.pontosPositivos.forEach(p => {
        relatorio += `  ✓ ${p}\n`;
      });
      relatorio += '\n';
    }

    if (analise.pontosNegativos.length > 0) {
      relatorio += `Pontos a Melhorar:\n`;
      analise.pontosNegativos.forEach(p => {
        relatorio += `  ✗ ${p}\n`;
      });
      relatorio += '\n';
    }

    relatorio += `Recomendação: ${analise.recomendacaoFinal}\n`;
    relatorio += `═══════════════════════════════════════════\n`;

    return relatorio;
  }

  toJSON() {
    return this.gerarAnaliseDiaria();
  }
}