"use strict";
const CATEGORIAS = ['Ação', 'Aventura', 'RPG', 'Estratégia', 'Esporte', 'Corrida', 'Simulação', 'Outros'];
const STATUS = ['nao-iniciado', 'jogando', 'concluido'];
const STATUS_LABEL = {
    'nao-iniciado': 'Não iniciado', jogando: 'Jogando', concluido: 'Concluído'
};
const ICONES = {
    'Ação': '⚡', 'Aventura': '🧭', 'RPG': '⚔️', 'Estratégia': '♟️', 'Esporte': '🏆', 'Corrida': '🏎️', 'Simulação': '🌐', 'Outros': '🎮'
};
const CORES = {
    'Ação': 'action', 'Aventura': 'adventure', 'RPG': 'rpg', 'Estratégia': 'strategy', 'Esporte': 'sports', 'Corrida': 'racing', 'Simulação': 'simulation', 'Outros': 'other'
};
const STORAGE_KEY = 'gamevault-jogos-v1';
const EXEMPLOS = [
    { id: 'demo-1', titulo: 'Minecraft', categoria: 'Aventura', preco: 99.90, status: 'jogando' },
    { id: 'demo-2', titulo: 'Valorant', categoria: 'Ação', preco: 0, status: 'jogando' },
    { id: 'demo-3', titulo: 'Red Dead Redemption 2', categoria: 'Aventura', preco: 249.90, status: 'nao-iniciado' },
    { id: 'demo-4', titulo: 'EA Sports FC 26', categoria: 'Esporte', preco: 299.00, status: 'concluido' },
    { id: 'demo-5', titulo: 'The Witcher 3', categoria: 'RPG', preco: 129.99, status: 'concluido' },
    { id: 'demo-6', titulo: 'Forza Horizon 5', categoria: 'Corrida', preco: 199.00, status: 'nao-iniciado' }
];
function carregarJogos() {
    try {
        const salvo = localStorage.getItem(STORAGE_KEY);
        if (salvo === null)
            return EXEMPLOS.map(jogo => ({ ...jogo }));
        const dados = JSON.parse(salvo);
        if (!Array.isArray(dados))
            return [];
        return dados.filter((item) => {
            if (typeof item !== 'object' || item === null)
                return false;
            const jogo = item;
            return typeof jogo.id === 'string' && typeof jogo.titulo === 'string' &&
                CATEGORIAS.includes(jogo.categoria) &&
                typeof jogo.preco === 'number' && Number.isFinite(jogo.preco) && jogo.preco >= 0 &&
                STATUS.includes(jogo.status);
        });
    }
    catch {
        return EXEMPLOS.map(jogo => ({ ...jogo }));
    }
}
let jogos = carregarJogos();
function elemento(id) {
    const encontrado = document.getElementById(id);
    if (!encontrado)
        throw new Error(`Elemento #${id} não encontrado`);
    return encontrado;
}
const grid = elemento('games-grid');
const busca = elemento('search');
const filtroCategoria = elemento('category-filter');
const filtroStatus = elemento('status-filter');
const formulario = elemento('game-form');
const precoBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
function salvarJogos() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jogos));
    }
    catch {
        mostrarToast('Não foi possível salvar no navegador.');
    }
}
function mostrarToast(mensagem) {
    const toast = elemento('toast');
    toast.textContent = mensagem;
    toast.classList.add('visible');
    window.setTimeout(() => toast.classList.remove('visible'), 3000);
}
function criarElemento(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe)
        el.className = classe;
    if (texto !== undefined)
        el.textContent = texto; // evita inserir HTML não confiável
    return el;
}
function criarCard(jogo) {
    const card = criarElemento('article', 'game-card');
    const capa = criarElemento('div', `game-cover ${CORES[jogo.categoria]}`);
    capa.append(criarElemento('span', 'cover-icon', ICONES[jogo.categoria]));
    capa.append(criarElemento('span', 'cover-category', jogo.categoria));
    const corpo = criarElemento('div', 'game-body');
    corpo.append(criarElemento('h3', 'game-name', jogo.titulo));
    const meta = criarElemento('div', 'game-meta');
    meta.append(criarElemento('span', 'game-price', precoBRL.format(jogo.preco)));
    const status = criarElemento('span', `status-badge ${jogo.status}`, STATUS_LABEL[jogo.status]);
    meta.append(status);
    corpo.append(meta);
    const acoes = criarElemento('div', 'game-actions');
    const select = criarElemento('select', 'status-select');
    select.setAttribute('aria-label', `Alterar status de ${jogo.titulo}`);
    STATUS.forEach(valor => {
        const option = criarElemento('option', undefined, STATUS_LABEL[valor]);
        option.value = valor;
        option.selected = valor === jogo.status;
        select.append(option);
    });
    select.addEventListener('change', () => atualizarStatus(jogo.id, select.value));
    const excluir = criarElemento('button', 'delete-btn', 'Excluir');
    excluir.type = 'button';
    excluir.setAttribute('aria-label', `Excluir ${jogo.titulo}`);
    excluir.addEventListener('click', () => removerJogo(jogo.id));
    acoes.append(select, excluir);
    corpo.append(acoes);
    card.append(capa, corpo);
    return card;
}
function atualizarResumo() {
    elemento('total-count').textContent = String(jogos.length);
    elemento('playing-count').textContent = String(jogos.filter(j => j.status === 'jogando').length);
    elemento('completed-count').textContent = String(jogos.filter(j => j.status === 'concluido').length);
    elemento('backlog-count').textContent = String(jogos.filter(j => j.status === 'nao-iniciado').length);
}
function renderizar() {
    const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
    const categoria = filtroCategoria.value;
    const status = filtroStatus.value;
    const visiveis = jogos.filter(j => j.titulo.toLocaleLowerCase('pt-BR').includes(termo) &&
        (!categoria || j.categoria === categoria) &&
        (!status || j.status === status));
    grid.replaceChildren(...visiveis.map(criarCard));
    elemento('library-count').textContent = String(visiveis.length);
    const vazio = elemento('empty-state');
    vazio.hidden = visiveis.length !== 0;
    if (visiveis.length === 0) {
        elemento('empty-title').textContent = jogos.length === 0 ? 'Sua biblioteca está vazia' : 'Nenhum jogo encontrado';
        elemento('empty-description').textContent = jogos.length === 0
            ? 'Adicione seu primeiro jogo no formulário abaixo.'
            : 'Tente buscar por outro nome ou alterar os filtros.';
    }
    atualizarResumo();
}
function atualizarStatus(id, novoStatus) {
    if (!STATUS.includes(novoStatus))
        return;
    const jogo = jogos.find(j => j.id === id);
    if (!jogo)
        return;
    jogo.status = novoStatus;
    salvarJogos();
    renderizar();
    mostrarToast(`Status de ${jogo.titulo} atualizado!`);
}
function removerJogo(id) {
    const jogo = jogos.find(j => j.id === id);
    if (!jogo)
        return;
    if (!window.confirm(`Excluir "${jogo.titulo}" da biblioteca?`))
        return;
    jogos = jogos.filter(j => j.id !== id);
    salvarJogos();
    renderizar();
    mostrarToast('Jogo removido com sucesso!');
}
function erroCampo(id, mensagem) {
    elemento(id).textContent = mensagem;
}
function cadastrarJogo(evento) {
    evento.preventDefault();
    const tituloInput = elemento('game-title');
    const categoriaInput = elemento('game-category');
    const precoInput = elemento('game-price');
    const statusInput = elemento('game-status');
    const titulo = tituloInput.value.trim();
    const categoria = categoriaInput.value;
    const preco = Number(precoInput.value);
    const status = statusInput.value;
    erroCampo('title-error', '');
    erroCampo('category-error', '');
    erroCampo('price-error', '');
    let valido = true;
    if (!titulo) {
        erroCampo('title-error', 'Informe o nome do jogo.');
        valido = false;
    }
    if (!CATEGORIAS.includes(categoria)) {
        erroCampo('category-error', 'Selecione uma categoria.');
        valido = false;
    }
    if (precoInput.value.trim() === '' || !Number.isFinite(preco) || preco < 0 || preco > 999999) {
        erroCampo('price-error', 'Informe um preço válido entre 0 e 999999.');
        valido = false;
    }
    if (!STATUS.includes(status))
        valido = false;
    if (!valido)
        return;
    const novoJogo = {
        id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        titulo, categoria, preco, status
    };
    jogos.unshift(novoJogo);
    salvarJogos();
    formulario.reset();
    busca.value = '';
    filtroCategoria.value = '';
    filtroStatus.value = '';
    renderizar();
    mostrarToast(`${titulo} adicionado à biblioteca!`);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
}
busca.addEventListener('input', renderizar);
filtroCategoria.addEventListener('change', renderizar);
filtroStatus.addEventListener('change', renderizar);
formulario.addEventListener('submit', cadastrarJogo);
elemento('clear-filters').addEventListener('click', () => {
    busca.value = '';
    filtroCategoria.value = '';
    filtroStatus.value = '';
    renderizar();
});
renderizar();
