# Atualizar eventos, mural e fotografias

A página inicial lê content/community.json.
- events: atividades realizadas na nossa igreja; exibe eventos atuais ou futuros por data.
- notices: anúncios de outras igrejas, cursos, estudos de teologia e oportunidades; ordenados por publicação.
- expires: último dia de exibição, opcional. As datas usam AAAA-MM-DD e a referência de dia é Europe/London.
- As listas começam vazias porque não foram fornecidos eventos reais. Não publique os exemplos abaixo sem substituir os dados.

Estrutura de um evento:
{"title":"Título real","description":"Descrição","date":"2026-12-01","endDate":"2026-12-01","location":"Local","url":"https://endereco-real","linkLabel":"Mais informações"}

Estrutura de um aviso:
{"title":"Título real","description":"Descrição","category":"Formação","organizer":"Entidade responsável","published":"2026-11-13","date":"2026-12-01","expires":"2026-12-01","location":"Local ou online","url":"https://endereco-real"}

Fotografias:
A entrada única da página inicial abre galeria/index.html, que reúne as imagens e todos os álbuns.
Os álbuns reais continuam em galeria/albums.json, com a estrutura documentada em galeria/README.md.
As imagens atuais da coleção são as capas geradas por IA; não são fotografias documentais de eventos.
As antigas páginas por tema são preservadas para não quebrar ligações já partilhadas.
