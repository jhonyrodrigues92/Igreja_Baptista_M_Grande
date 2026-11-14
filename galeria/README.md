# Fotografias da igreja

A galeria mostra diretamente as fotografias de cada tema, sem obrigar a abrir outro álbum.

Temas disponíveis:
- cultos-celebracoes: cultos, aniversários e celebrações.
- momentos-comunhao: refeições, passeios, convívios e encontros.
- batismo: fotografias de batismos.

Adicione as fotografias em assets/albums/ e registe-as em galeria/albums.json:
{
  "id": "identificador-unico",
  "topic": "batismo",
  "title": "Título do conjunto",
  "cover": "../assets/albums/conjunto/foto-01.jpg",
  "photos": [
    {"src": "../assets/albums/conjunto/foto-01.jpg", "alt": "Descrição da fotografia"}
  ]
}

Não é necessário indicar data. Os conjuntos são apresentados na ordem do ficheiro.
Os temas antigos Comunidade e Vida da igreja redirecionam para Momentos de comunhão.
Eventos especiais redireciona para Cultos e celebrações.
As fotografias podem ser ampliadas e fechadas com o botão ou Escape.
