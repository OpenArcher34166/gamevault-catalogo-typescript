# GameVault — Catálogo interativo com TypeScript

Projeto acadêmico de catálogo de jogos desenvolvido com **HTML, CSS e TypeScript**, sem frameworks nem banco de dados.

## Funcionalidades

- Cadastrar jogo com nome, categoria, preço e status, com validação de campos.
- Exibir jogos em cards e mostrar mensagem quando não há resultados.
- Buscar por nome e filtrar por categoria e status.
- Alterar o status e excluir jogos (com confirmação).
- Mostrar total de jogos e contagem por status, atualizados após cada alteração.
- Armazenar dados no `localStorage` do navegador; seis exemplos aparecem no primeiro acesso.
- Interface responsiva para computador e celular.

## Tecnologias e conceitos

- **HTML5:** estrutura e formulário semântico.
- **CSS3:** layout responsivo, cards e estados visuais.
- **TypeScript:** `interface Jogo`, tipos `Categoria` e `StatusJogo`, `Jogo[]`, funções com parâmetros e retornos tipados, `filter`, `map`, eventos e manipulação do DOM com verificação de elementos.

## Como executar

Requer Node.js e npm instalados.

```bash
npm install
npm run build
npm start
```

Abra no navegador o endereço local mostrado no terminal. Para alterar o TypeScript durante o desenvolvimento, use `npm run watch` em outro terminal.

**Visualização rápida:** o ZIP já contém `dist/main.js` compilado. É possível abrir `index.html` diretamente no navegador moderno; se o navegador bloquear scripts locais, use o servidor do comando acima.

## Estrutura

```
index.html          Interface HTML
styles.css          Estilos e responsividade
src/main.ts         Código-fonte TypeScript
src/main.js         (não usado; não incluído)
dist/main.js        JavaScript compilado
package.json        Scripts e dependências
tsconfig.json       Configuração do compilador
README.md           Documentação
```

## Como testar

1. Cadastre um jogo com preço e categoria; verifique o total.
2. Tente cadastrar com nome vazio ou preço inválido; confira as mensagens.
3. Pesquise um título e filtre por categoria/status.
4. Mude o status de um jogo; observe o resumo.
5. Exclua um jogo e confira a atualização da lista.
6. Atualize a página; os dados continuam salvos no mesmo navegador.

## Autor e apresentação

Autor(a): **[preencher nome]**

Vídeo explicativo: **[inserir link após gravar]**

Repositório GitHub: **[inserir link após publicar]**

O vídeo pode apresentar o planejamento, a estrutura de arquivos, a interface `Jogo`, as funções tipadas, o DOM e a demonstração das funcionalidades.
