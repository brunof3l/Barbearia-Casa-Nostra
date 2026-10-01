# Casa Nostra Barbearia

Site de apresentação da Casa Nostra, feito com HTML, CSS e JavaScript. O código está organizado em arquivos separados, com indentação e funções distribuídas em linhas para facilitar a leitura e a manutenção.

## Recursos

- Página inicial com a identidade visual e a logo da barbearia.
- Cards de serviços que abrem um popup para escolher o atendimento.
- Solicitação de agendamento pelo WhatsApp com o serviço selecionado.
- Carrossel com fotos e vídeos reais, miniaturas e navegação por teclado/toque.
- Fotos com avanço a cada 3 segundos; vídeos automáticos sem áudio e avanço ao terminar. Controle de pausa e botão para ativar o som.
- Menu responsivo, localização no Google Maps e links de Instagram.
- Animações com respeito à preferência de movimento reduzido.

O site solicita o agendamento pelo WhatsApp; a equipe confirma o horário e o valor. Não há backend, banco de dados, cobrança ou reserva automática.

## Executar

Extraia ou clone o projeto. Abra `index.html` no navegador ou inicie um servidor local:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`. Não é necessário npm ou compilação.

## Estrutura

```text
index.html       Página e popup, com comentários por seção
style.css        Layout, molduras, animações e estilos responsivos
fonts.css        Fontes locais
app.js           Menu, carrossel, animações e seleção de serviços
config.js        Contatos e tabela de serviços
assets/          Logo, fotos, vídeos, fontes e licenças das fontes
```

## Editar contatos e valores

Altere `window.BARBEARIA` em `config.js`. Os ids dos serviços precisam coincidir com os inputs do popup em `index.html`.

- `valor: null` mostra **Sob consulta**.
- `valor: 50` mostra **R$ 50,00**. Esse número é apenas um exemplo; use a tabela confirmada pela barbearia.

## Publicação

O projeto pode ser servido por uma hospedagem de arquivos estáticos. Publique `index.html` na raiz e preserve os caminhos dos arquivos. Configure HTTPS e o domínio do cliente.

Para GitHub Pages, selecione a branch do site e a pasta raiz nas configurações de Pages do repositório.

## Antes da entrega comercial

Confirme os contatos, endereço, serviços e valores com a equipe. Confirme autorização de uso das mídias publicadas no Instagram e das pessoas retratadas. Fotos e vídeos no projeto possuem links para as publicações originais; as licenças das fontes estão em `assets/fonts/`.

## Validação

Código JavaScript verificado com `node --check`; arquivo HTML com recursos locais e âncoras conferidos. Prévia visual do Site em navegador indisponível no ambiente que gerou esta versão; revise o projeto em celular e computador antes da entrega final.
