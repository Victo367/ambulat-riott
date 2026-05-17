/** Slugs dos guias que vêm pré-cadastrados no site (inseridos no banco se ainda não existirem). */
export const SLUGS_GUIAS_PADRAO = [
  "terapia-hormonal",
  "identidade",
  "retificacao",
  "sus",
] as const;

export type GuiaPadrao = {
  slug: (typeof SLUGS_GUIAS_PADRAO)[number];
  title: string;
  description: string;
  content: string;
  image: string;
};

export const GUIAS_PADRAO: GuiaPadrao[] = [
  {
    slug: "terapia-hormonal",
    title: "Terapia hormonal segura",
    description:
      "A jornada da terapia hormonal para pessoas trans é altamente monitorada e segura, focando integralmente na melhoria da qualidade de vida, bem-estar psicossocial e na afirmação de gênero saudável.",
    image: "/th.jpg",
    content: `A terapia hormonal para pessoas trans é um cuidado de saúde reconhecido e oferecido no SUS, sempre com acompanhamento médico.

O tratamento busca alinhar características corporais à identidade de gênero, respeitando o ritmo e as necessidades de cada pessoa. Antes de iniciar, a equipe avalia histórico clínico, exames e expectativas — não existe um modelo único para todas as pessoas.

Durante o acompanhamento, são monitorados níveis hormonais, efeitos desejados e possíveis efeitos adversos. Consultas regulares são essenciais para ajustar doses e garantir segurança.

No Ambulatório TT, a hormonioterapia integra cuidado multiprofissional: médicos, enfermagem, psicologia e assistência social atuam de forma conjunta para apoiar saúde física e emocional.

Se você tem interesse em iniciar ou continuar a terapia hormonal, agende uma consulta para orientação individualizada.`,
  },
  {
    slug: "identidade",
    title: "Conceito & Identidade",
    description:
      "A transgeneridade compreende indivíduos cuja identidade difere do sexo atribuído ao nascer. O suporte clínico individualizado é um pilar essencial desse processo.",
    image: "",
    content: `Transgeneridade é um termo guarda-chuva que descreve pessoas cuja identidade de gênero não corresponde ao sexo que lhes foi atribuído ao nascer.

Cada trajetória é única: há pessoas trans, travestis e não binárias, entre outras identidades. Respeitar nomes, pronomes e expressão de gênero é parte fundamental do cuidado em saúde.

O suporte clínico no ambulatório inclui escuta qualificada, orientação sobre direitos, saúde mental e encaminhamentos quando necessário. O objetivo é reduzir sofrimento e promover autonomia.

Informação de qualidade combate preconceito e fake news. Por isso, este espaço reúne conteúdos confiáveis para pacientes, familiares e profissionais.

Dúvidas sobre identidade de gênero podem ser discutidas em consulta, com sigilo e acolhimento.`,
  },
  {
    slug: "retificacao",
    title: "Retificação de Nome e Gênero",
    description:
      "Entenda o passo a passo para alteração diretamente no Cartório de Registro Civil. Saiba quais documentos são mandatórios e como proceder diante de pendências.",
    image: "/retificacao.jpg",
    content: `A retificação de prenome e gênero no registro civil é um direito garantido por decisão do Supremo Tribunal Federal, sem necessidade de cirurgia ou laudos psiquiátricos.

O pedido é feito em cartório de registro civil, preferencialmente onde o nascimento foi registrado. A pessoa interessada deve comparecer com documento de identificação.

Em geral, são apresentados requerimento e documentos pessoais. O cartório orienta sobre taxas e prazos locais. Em caso de recusa indevida, é possível buscar orientação jurídica.

Após a retificação, é importante atualizar CPF, RG, Cartão SUS, carteira de trabalho e demais documentos para evitar inconsistências no atendimento de saúde.

O Ambulatório TT pode orientar sobre o processo e apoiar no acesso a serviços, mas a alteração registral é realizada no cartório.`,
  },
  {
    slug: "sus",
    title: "Processo Transexualizador no SUS",
    description:
      "O Sistema Único de Saúde assegura o cuidado integral especializado. Conheça a rede de hormonioterapia, amparo multiprofissional e cirurgias de afirmação regulamentadas.",
    image: "/cirurgia.jpg",
    content: `O Processo Transexualizador no SUS (Portaria GM nº 2.803/2011) organiza o cuidado à saúde de travestis e transexuais em todo o país.

O cuidado inclui hormonioterapia, acompanhamento psicossocial, procedimentos cirúrgicos de afirmação de gênero e tratamento de comorbidades, conforme critérios clínicos e protocolos nacionais.

O acesso começa na atenção básica ou em serviços de referência, com avaliação multiprofissional. Equipes definem o plano terapêutico individual, respeitando tempo e elegibilidade para cada etapa.

Cirurgias e procedimentos seguem fluxos específicos do SUS, com filas e regulamentação regional. Informe-se com a equipe sobre documentação, encaminhamentos e prazos na Paraíba.

O Ambulatório TT Marcela Prado integra essa rede em Campina Grande, oferecendo acolhimento, hormonioterapia e articulação com outros níveis de atenção quando necessário.`,
  },
];
