// src/models/Usuario/UsuarioComum.js

import { Usuario } from './Usuario.js';

export class UsuarioComum extends Usuario {
  constructor(id, nome, email, idade, peso, altura, restricoes = []) {
    super(id, nome, email, idade, peso, altura, 'comum', restricoes);
  }

  analisarRefeicao(refeicao) {
    const analise = {
      status: 'adequada',
      mensagem: '',
      alertas: [],
      pontosPositivos: []
    };

    const alimentos = refeicao.alimentos.map(a => a.nome.toLowerCase());
    
    // Verificar alimentos ultraprocessados
    const ultraprocessados = ['refrigerante', 'salgadinho', 'biscoito recheado', 
                             'macarrão instantâneo', 'nuggets', 'salsicha'];
    const temUltraprocessado = alimentos.some(a => 
      ultraprocessados.some(u => a.includes(u))
    );

    if (temUltraprocessado) {
      analise.alertas.push('Evite alimentos ultraprocessados');
      analise.status = 'moderada';
    }

    // Verificar alimentos naturais
    const naturais = ['arroz', 'feijão', 'salada', 'fruta', 'legume', 'verdura', 
                     'carne', 'frango', 'peixe', 'ovo'];
    const temNatural = alimentos.some(a => 
      naturais.some(n => a.includes(n))
    );

    if (temNatural) {
      analise.pontosPositivos.push('Ótima escolha de alimentos naturais');
    }

    // Verificar porções
    const totalQuantidade = refeicao.alimentos.reduce((total, a) => {
      const qtd = parseInt(a.quantidade) || 0;
      return total + qtd;
    }, 0);

    if (totalQuantidade > 800) {
      analise.alertas.push('Porção muito grande. Considere reduzir');
      analise.status = 'moderada';
    } else if (totalQuantidade < 200) {
      analise.alertas.push('Porção pequena. Pode não ser suficiente');
      analise.status = 'moderada';
    } else {
      analise.pontosPositivos.push('Porção equilibrada');
    }

    // Verificar restrições do usuário
    this.restricoes.forEach(restricao => {
      const temRestricao = alimentos.some(a => a.includes(restricao.toLowerCase()));
      if (temRestricao) {
        analise.alertas.push(`Atenção: contém ${restricao} (restrição cadastrada)`);
        analise.status = 'inadequada';
      }
    });

    // Mensagem final
    if (analise.status === 'adequada') {
      analise.mensagem = 'Refeição adequada! Continue assim.';
    } else if (analise.status === 'moderada') {
      analise.mensagem = 'Refeição aceitável, mas pode melhorar.';
    } else {
      analise.mensagem = 'Atenção aos alertas desta refeição.';
    }

    return analise;
  }

  gerarRecomendacoes() {
    return [
      'Priorize alimentos naturais e minimamente processados',
      'Evite ultraprocessados e fast food',
      'Mantenha porções equilibradas',
      'Beba bastante água ao longo do dia',
      'Inclua frutas e verduras em suas refeições'
    ];
  }

  static fromJSON(data) {
    const usuario = new UsuarioComum(
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