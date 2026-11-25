/**
 * NARRATIVA CENTRAL — NOSSA HISTÓRIA (TEXTO INTEGRAL)
 * -------------------------------------------------------------------------
 * Texto integral preservado fielmente de MarceloAniversario.docx,
 * estruturado com marcações editoriais discretas para ritmo de leitura.
 */

export const STORY_CONTENT = {
  chapterNumber: '02',
  chapterLabel: 'NOSSA HISTÓRIA',
  salutation: 'Marcelo —',
  opening: 'Oi, Marcelo. Tudo bem?',

  /**
   * Unidades narrativas em ordem cronológica e emocional.
   * - `marker`: detalhe tipográfico discreto opcional (sans-serif leve)
   * - `pause`: pausa visual silenciosa entre lembranças (sem rótulo)
   * - `paragraphs`: array de parágrafos integrais (string ou objeto com `emphasis`)
   */
  passages: [
    {
      id: '300-meses',
      marker: '300 MESES',
      paragraphs: [
        'Hoje você chega à marca dos vinte e cinco anos. Para ser mais exato, são 300 meses de vida, de tempo, escolhas, momentos, dúvidas e tantas outras coisas que fazem parte dessa jornada.',
        'Você passou por grandes mudanças. Deixou de ser um garoto e se tornou um homem, encontrou o amor da sua vida e, desse amor, nasceu algo ainda mais poderoso: um filho.',
        'Passamos por tantos momentos juntos. Íamos à academia (na maior parte do tempo, para ficar zanzando por lá), fizemos trilhas loucas, perigosas e divertidas (algumas das nossas escolhas foram, no mínimo, questionáveis) e até aprendemos a cuidar de uma vida recém-chegada ao nosso mundo.',
        'Sabe, eu gosto de recordar as coisas. Às vezes, me pego lembrando de alguns momentos e dando risada sozinho.',
      ],
    },
    {
      id: 'quinta-feira',
      marker: 'QUINTA-FEIRA À NOITE',
      paragraphs: [
        'Lembro de uma quinta-feira à noite em que decidimos andar de bicicleta elétrica. Estávamos você, o Cristian e eu. Lembro que, naquele dia, montei na bicicleta e passamos pela rua do Sítio Agar, uma das minhas favoritas, porque o vento soprava e as árvores dançavam. Sim, foi nesse dia que caí com a sua bicicleta (foi mal).',
        'Sabe o que mais me marcou naquele dia? Não foi você apostando corrida com o Cristian, nem eu olhando para a tela da bicicleta e me perguntando se teria que empurrá-la até chegar à sua casa. Foi simplesmente o fato de estarmos ali, nos divertindo juntos.',
      ],
    },
    {
      id: 'primeira-cachoeira',
      marker: 'A PRIMEIRA CACHOEIRA',
      paragraphs: [
        'Um dos meus dias favoritos foi quando fomos à cachoeira pela primeira vez. Lembro que acordamos cedo, pegamos as bicicletas e começamos nosso trajeto. Lembra daquela ponte cheia de pó, onde tiramos fotos? Ou do colchão jogado no meio do mato (suspeito)? E de quando estávamos em dúvida sobre o caminho e você foi perguntar ao pessoal onde ficava a cachoeira, até que finalmente seguimos todos juntos?',
        'Algum tempo depois, levamos o Lucas para conhecer o lugar. E que dia! Gosto de recordar como o sol queimava a pele, como as árvores escondiam a água e deixavam passar apenas alguns pontos de luz. Eu via tantas borboletas por lá.',
        {
          text: 'Nunca foi sobre chegar até a cachoeira. Acho que a melhor parte sempre foi poder estar com vocês, olhar para frente e ver que estavam ali, cansados de tanto pedalar, mas ainda com força para continuar.',
          emphasis: 'reflective',
        },
      ],
    },
    {
      id: 'domingo-bicicleta',
      pause: true,
      paragraphs: [
        'Teve também aquele domingo em que eu estava andando de bicicleta quando ela quebrou. Caí no barro e estava voltando para casa empurrando-a. Lembro de olhar ao longe e ver uma pessoa descendo de bicicleta. Pensei: é o Marcelo, tenho certeza. Quando você passou por mim e me olhou, parou logo em seguida, voltou e veio perguntar o que tinha acontecido. E eu estava lá, todo sujo.',
      ],
    },
    {
      id: 'barueri',
      marker: 'BARUERI',
      paragraphs: [
        'Também gosto de lembrar do dia em que pedalamos até Barueri para visitar a Mylena no hospital. Que dia, hein! Achei que fosse morrer. Lembro de chegarmos a um centro comercial, onde encontramos uma sorveteria e ficamos ali tomando sorvete e conversando.',
        'Depois, chegamos ao quarto da Mylena. Eu estava morrendo de vergonha porque estava todo suado, mas acabamos ficando por lá, jogando e aproveitando aquele momento. Foi um dia tão bom. Difícil mesmo foi voltar para casa. Só de lembrar que ainda havia tantas ruas pela frente, mas já era noite e o clima estava tão gostoso...',
      ],
    },
    {
      id: 'quem-voce-e',
      pause: true,
      paragraphs: [
        'Sabe, gosto de como você é. Da força que transmite, mesmo diante de tantas pedras pelo caminho. Seus olhos carregam esperança. Você olha para um problema e parece saber que, de alguma forma, ele será resolvido. Talvez demore um pouco, talvez o caminho seja mais complicado do que deveria, mas você sempre encontra um jeito.',
        'Gosto também de saber que, mesmo sem falar muito ou demonstrar seus sentimentos com facilidade, eles estão ali. Na maneira como cuida da sua família, na forma como pensa nos seus amigos e nas pequenas maneiras com que sempre tenta manter todos por perto.',
        'Gosto quando você me conta sobre algo que é seu, como seu jogo de RPG. É nesses momentos que percebo que também existe um mundo inteiro de invenções, ideias e sonhos dentro de você. Talvez você não seja o melhor com as palavras, mas muitas vezes suas atitudes revelam um homem honrado. Talvez essa seja uma das suas formas de dizer que ama.',
        {
          text: 'E o melhor de tudo é que, em todos esses momentos, sempre estivemos juntos.',
          emphasis: 'reflective',
        },
        'A vida é sobre isso. Sobre quantos momentos podemos compartilhar com as pessoas que amamos. Momentos bons e ruins, tempos de sol e tempos de tempestade. São essas pequenas histórias, algumas engraçadas, outras inesperadas, que acabam se tornando parte de quem somos.',
      ],
    },
  ],

  closing: {
    wish: 'Feliz aniversário, Marcelo.',
    honor: 'É uma honra estar ao seu lado.',
  },
};
