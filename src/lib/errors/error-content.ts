import type { ErrorContent, ErrorKind } from "./types";

const CONTENT: Record<ErrorKind, ErrorContent> = {
  NOT_FOUND: {
    code: "404",
    title: "Página não encontrada",
    description:
      "O endereço que você acessou não existe neste portal ou foi alterado.",
    why: "Isso costuma acontecer quando um link está desatualizado, foi digitado com erro ou a página foi removida após uma atualização do sistema.",
    suggestions: [
      "Confira se o endereço na barra do navegador está correto.",
      "Use o menu lateral para navegar pelas áreas do ambulatório.",
      "Volte à página inicial e tente acessar o conteúdo por lá.",
    ],
    primaryLabel: "Ir para a página inicial",
    primaryHref: "/",
    secondaryLabel: "Fazer login",
    secondaryHref: "/login",
  },
  UNAUTHORIZED: {
    code: "401",
    title: "Sessão expirada ou inválida",
    description:
      "Para continuar, é necessário entrar novamente com seu e-mail e senha.",
    why: "Sua sessão pode ter expirado, o cookie de acesso foi removido ou você abriu o sistema em outra aba sem estar autenticado.",
    suggestions: [
      "Faça login novamente com as mesmas credenciais do cadastro.",
      "Evite usar abas anônimas se precisar manter a sessão ativa.",
      "Se o problema persistir, peça à equipe para verificar seu cadastro.",
    ],
    primaryLabel: "Entrar no sistema",
    primaryHref: "/login",
    secondaryLabel: "Voltar à home",
    secondaryHref: "/",
  },
  FORBIDDEN: {
    code: "403",
    title: "Acesso não permitido",
    description:
      "Sua conta não tem permissão para abrir esta área do portal.",
    why: "Áreas de paciente e de funcionário são separadas. Você pode estar logado com um perfil que não corresponde à rota que tentou acessar.",
    suggestions: [
      "Pacientes devem usar as rotas em “Minha agenda”, “Histórico” e “Perfil”.",
      "Funcionários acessam cadastros, agenda clínica e gestão de conteúdo.",
      "Se acredita que deveria ter acesso, fale com a coordenação do ambulatório.",
    ],
    primaryLabel: "Ir para a página inicial",
    primaryHref: "/",
    secondaryLabel: "Trocar de conta",
    secondaryHref: "/login",
  },
  NETWORK: {
    code: "REDE",
    title: "Não foi possível conectar",
    description:
      "O navegador não conseguiu falar com o servidor do ambulatório.",
    why: "Isso pode ocorrer por instabilidade da internet, servidor em manutenção, VPN ou firewall bloqueando a conexão com o endereço da aplicação.",
    suggestions: [
      "Verifique se sua conexão com a internet está ativa.",
      "Atualize a página e tente de novo em alguns instantes.",
      "Se estiver na rede do hospital, confirme se o sistema está liberado.",
    ],
    primaryLabel: "Tentar novamente",
    secondaryLabel: "Ir para a página inicial",
    secondaryHref: "/",
  },
  DATABASE: {
    code: "BD",
    title: "Serviço temporariamente indisponível",
    description:
      "O sistema não conseguiu acessar o banco de dados para concluir sua solicitação.",
    why: "A conexão com o MongoDB pode estar incorreta (variável MONGODB_URI), o banco pode estar offline ou houve timeout na rede entre o servidor e o banco.",
    suggestions: [
      "Aguarde alguns minutos e tente novamente.",
      "Se você é da equipe técnica, confira se o MongoDB está rodando e se o .env está correto.",
      "Persistindo o erro, registre o horário e avise o suporte.",
    ],
    primaryLabel: "Tentar novamente",
    secondaryLabel: "Ir para a página inicial",
    secondaryHref: "/",
  },
  CHUNK_LOAD: {
    code: "CACHE",
    title: "Versão desatualizada do aplicativo",
    description:
      "Parte do sistema não carregou porque o navegador está usando arquivos antigos.",
    why: "Após uma publicação nova do site, abas abertas antes da atualização podem tentar carregar trechos de código que já não existem no servidor.",
    suggestions: [
      "Recarregue a página com Ctrl+F5 (ou Cmd+Shift+R no Mac).",
      "Feche abas antigas do ambulatório e abra o endereço de novo.",
      "Limpe o cache do navegador se o erro continuar aparecendo.",
    ],
    primaryLabel: "Recarregar página",
    secondaryLabel: "Ir para a página inicial",
    secondaryHref: "/",
  },
  SERVER: {
    code: "500",
    title: "Erro interno do servidor",
    description:
      "Algo inesperado impediu o processamento da sua solicitação.",
    why: "Pode ser uma falha temporária, dado inválido enviado ao servidor ou um problema no código que a equipe precisa corrigir.",
    suggestions: [
      "Tente a ação novamente em alguns segundos.",
      "Volte à tela anterior e refaça o caminho com calma.",
      "Se o erro se repetir, anote o que você estava fazendo e informe o suporte.",
    ],
    primaryLabel: "Tentar novamente",
    secondaryLabel: "Ir para a página inicial",
    secondaryHref: "/",
  },
  COMPONENT: {
    code: "UI",
    title: "Falha ao carregar esta tela",
    description:
      "A interface desta página não pôde ser montada corretamente.",
    why: "Isso geralmente indica arquivo de página corrompido ou vazio, erro de build ou importação quebrada após uma atualização incompleta do projeto.",
    suggestions: [
      "Recarregue a página completamente (Ctrl+F5).",
      "Se você desenvolve o sistema, verifique se o arquivo da rota exporta um componente React válido.",
      "Rode um novo build (npm run build) e reinicie o servidor de desenvolvimento.",
    ],
    primaryLabel: "Recarregar página",
    secondaryLabel: "Ir para a página inicial",
    secondaryHref: "/",
  },
  UNKNOWN: {
    code: "ERRO",
    title: "Algo deu errado",
    description:
      "Ocorreu um problema que não conseguimos classificar automaticamente.",
    why: "Erros inesperados podem vir de extensões do navegador, dados corrompidos na sessão ou falhas pontuais no servidor.",
    suggestions: [
      "Atualize a página e tente de novo.",
      "Teste em outra aba ou outro navegador.",
      "Se continuar, entre em contato com o suporte informando o que estava fazendo.",
    ],
    primaryLabel: "Tentar novamente",
    secondaryLabel: "Ir para a página inicial",
    secondaryHref: "/",
  },
};

export function getErrorContent(kind: ErrorKind): ErrorContent {
  return CONTENT[kind];
}
