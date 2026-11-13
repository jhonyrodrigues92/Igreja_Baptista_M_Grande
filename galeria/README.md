# Álbuns da igreja

Cada tema tem uma página em galeria/. Os dados dos eventos ficam em galeria/albums.json.
Não foram criados eventos fictícios: a lista começa vazia. As imagens de IA existentes são apenas capas de tema.

Para publicar um álbum, adicione fotografias aprovadas em assets/albums/ e acrescente um objeto à lista "albums":
{
  "id": "identificador-unico",
  "topic": "eventos-especiais",
  "title": "Título real do evento",
  "date": "2026-11-13",
  "cover": "../assets/albums/evento/capa.jpg",
  "photos": [
    {"src": "../assets/albums/evento/foto-01.jpg", "alt": "Descrição da fotografia"}
  ]
}

topic deve ser um dos nomes dos cinco ficheiros HTML, sem extensão.
date usa AAAA-MM-DD. Os álbuns são apresentados do mais recente para o mais antigo.
Use caminhos relativos com ../assets/ para as imagens. Cada álbum pode ser aberto através de ?album=identificador-unico.
Os visitantes podem ampliar fotografias, fechar com o botão ou Escape e regressar à página inicial.
