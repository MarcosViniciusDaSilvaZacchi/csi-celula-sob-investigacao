// ==========================================
// 1. CONFIGURAÇÕES INICIAIS E VARIÁVEIS GERAIS
// ==========================================
const grade = document.getElementById('grade-tabuleiro');
const colunas = 47; 
const linhas = 20;

const salas = {
    "Setor Genético":       { minX: 0,  maxX: 4,  minY: 0,  maxY: 3 },
    "Zona Tóxica":          { minX: 41, maxX: 46, minY: 0,  maxY: 3 },
    "Laboratório Central":  { minX: 21, maxX: 26, minY: 7,  maxY: 9 },
    "Ciclo de Krebs":       { minX: 2,  maxX: 6,  minY: 7,  maxY: 10 },
    "Zona Oxidativa":       { minX: 41, maxX: 45, minY: 8,  maxY: 10 },
    "Núcleo":               { minX: 43, maxX: 46, minY: 16, maxY: 19 },
    "COA (Garagem)":        { minX: 22, maxX: 26, minY: 16, maxY: 19 },
    "Sala de Arquivos":     { minX: 32, maxX: 35, minY: 0,  maxY: 3 },
    "Portão Principal":     { minX: 13, maxX: 18, minY: 0,  maxY: 3 },
    "Setor de Produção":    { minX: 0,  maxX: 4,  minY: 15, maxY: 18 }
};

const bancoDeCasos = [
    { id: 1, suspeito: "Oxigênio Explosivo", local: "Ciclo de Krebs", problema: "Excesso de oxigênio causou estresse oxidativo", pistasNoMapa: { "Setor Genético": "O culpado estava tentando ajudar a célula a produzir energia, mas causou um problema.", "Zona Tóxica": "A falha aconteceu perto de um lugar onde o oxigênio é usado.", "Sala de Arquivos": "O culpado parecia inofensivo, mas bagunçou tudo sem querer." }, explicacaoCientifica: "O oxigênio é vital para a respiração celular. Porém, quando há um desequilíbrio, parte desse oxigênio se transforma em 'Radicais Livres' (moléculas instáveis). Esse fenômeno é o Estresse Oxidativo. Esses radicais atacam e destroem as enzimas que fazem o Ciclo de Krebs girar, paralisando a produção de energia." },
    { id: 2, suspeito: "Mitocôndria Zumbi", local: "Setor Genético", problema: "Mutação destruiu DNA mitocondrial", pistasNoMapa: { "Núcleo": "O culpado tentou corrigir o processo de produção de energia, mas não teve sucesso.", "Zona Oxidativa": "O culpado deixou algo escapar que era essencial.", "Portão Principal": "O culpado consumia nutrientes mas não devolvia energia." }, explicacaoCientifica: "Você sabia que a mitocôndria tem seu próprio DNA (herdado da sua mãe)? Se esse DNA sofre uma mutação genética severa, a mitocôndria perde a capacidade de produzir as peças necessárias para gerar energia. Ela continua viva absorvendo nutrientes, mas vira uma 'zumbi' inútil para o corpo." },
    { id: 3, suspeito: "RNA Mutante", local: "Cadeia transportadora", problema: "Produção de proteínas defeituosas", pistasNoMapa: { "Glicólise": "O culpado confundiu os caminhos da célula com informações erradas.", "COA (Garagem)": "A falha aconteceu porque peças erradas foram usadas na fabricação.", "Ciclo de Krebs": "O culpado chegou antes do esperado e atrapalhou tudo." }, explicacaoCientifica: "O RNA funciona como um 'mensageiro' que leva a receita do DNA para fabricar proteínas. Se esse mensageiro sofre mutação e carrega a receita errada, a célula fabrica proteínas com o formato torto. Na Cadeia Transportadora, se a proteína não tem o formato perfeito, os elétrons não passam e a energia trava." },
    { id: 4, suspeito: "Mito Energético", local: "Ciclo de Krebs", problema: "Falta de insumos para funcionar", pistasNoMapa: { "Setor de Produção": "O culpado está sobrecarregado de trabalho, mas sem material.", "Reserva de glicose": "Faltou os ingredientes básicos para a missão ser cumprida.", "Portão Principal": "Ele não consegue trabalhar e a energia parou de ser feita." }, explicacaoCientifica: "A mitocôndria é uma usina poderosa, mas nenhuma usina funciona sem carvão. Se falta alimentação adequada (glicose) ou oxigênio devido a uma falha na respiração do corpo, falta 'matéria-prima' (insumos). Sem o combustível básico, o Ciclo de Krebs para completamente de girar." },
    { id: 5, suspeito: "Enzima Congelada", local: "Descarboxilação do Piruvato", problema: "Falha na formação de acetil-coa", pistasNoMapa: { "Sala de Arquivos": "Uma peça essencial faltou para o trabalho de conversão.", "Glicólise": "O material principal ficou preso e não conseguiu se transformar.", "Núcleo": "Sem essa transformação, o ciclo inteiro de energia foi paralisado." }, explicacaoCientifica: "As enzimas são os operários acelerados do nosso corpo. O Piruvato (gerado pela quebra do açúcar) precisa de uma enzima específica para se transformar em Acetil-CoA e ganhar permissão para entrar na mitocôndria. Se essa enzima 'congela' ou falha, o alimento fica barrado na porta de entrada da usina." },
    { id: 6, suspeito: "Radical Raivoso", local: "Zona Tóxica", problema: "Danos às membranas mitocondriais", pistasNoMapa: { "Setor de Produção": "O culpado invadiu a área mais perigosa e causou destruição.", "COA (Garagem)": "Houve quebra agressiva de partes importantes da fábrica.", "Zona Oxidativa": "Toda a fábrica de energia foi paralisada pelos estragos nas paredes." }, explicacaoCientifica: "A mitocôndria possui uma membrana dupla vital para segurar as cargas elétricas da energia. Radicais livres descontrolados são extremamente reativos e atacam a gordura (lipídios) dessa membrana, um processo chamado peroxidação lipídica. Isso fura a parede da usina, vazando toda a energia." },
    { id: 7, suspeito: "Organoide Clonado", local: "Produção de Acetil-CoA", problema: "Desvio do processo por estrutura falsa", pistasNoMapa: { "Setor Genético": "Uma cópia imperfeita confundiu todo o processo logístico.", "Ciclo de Krebs": "Os componentes entregaram os materiais no lugar errado.", "Sala de Arquivos": "A linha de produção parou por causa de um grande impostor." }, explicacaoCientifica: "Imagine uma estrutura celular com defeito que imita as originais. Esse organoide age como um impostor que 'rouba' o Piruvato da célula para si, mas por ser falho, não consegue finalizar a conversão química. Ele gasta os nutrientes do corpo e devolve apenas lixo metabólico." },
    { id: 8, suspeito: "Mitocôndria Zumbi", local: "Cadeia transportadora", problema: "Consome oxigênio sem gerar ATP", pistasNoMapa: { "Zona Oxidativa": "Parece estar viva e trabalhando, mas é só uma ilusão.", "Núcleo": "Consome todos os recursos da célula, mas não devolve nada.", "Portão Principal": "Tornou-se um peso morto gigante que apenas drena a fábrica." }, explicacaoCientifica: "Existe um defeito chamado 'Desacoplamento Mitocondrial'. Nele, a cadeia transportadora funciona normalmente puxando o oxigênio e queimando calorias, mas a máquina de fazer energia (ATP Sintase) está quebrada. O corpo respira ofegante, gera muito calor, mas a célula continua sem a moeda de energia (ATP)." },
    { id: 9, suspeito: "ATP Mutante", local: "Fosforilação Oxidativa", problema: "ATP defeituoso inutilizável", pistasNoMapa: { "Glicólise": "A energia fabricada tem a forma certa, mas é totalmente inútil.", "Zona Tóxica": "Tentar usar essa energia é como plugar um equipamento em uma bateria vazia.", "COA (Garagem)": "O produto final saiu com defeito terrível de fabricação." }, explicacaoCientifica: "O ATP (Adenosina Trifosfato) é a verdadeira 'bateria' da célula. Se ocorre uma falha na etapa final (Fosforilação Oxidativa) e essa molécula é montada com defeito, ela perde a capacidade de estocar energia nas suas ligações químicas. O corpo tenta usar essa bateria para se mover, mas ela está viciada." },
    { id: 10, suspeito: "RNA Mutante", local: "Setor Genético", problema: "Proteínas mitocondriais defeituosas", pistasNoMapa: { "Setor de Produção": "Houve uma falha grave na leitura dos moldes de montagem.", "Sala de Arquivos": "As peças da máquina estão sendo construídas com o formato torto.", "Ciclo de Krebs": "O funcionamento foi corrompido desde a raiz das instruções do projeto." }, explicacaoCientifica: "Mutações no código genético levam à transcrição de RNA falhos. Com a instrução errada, o ribossomo fabrica proteínas com falhas estruturais brutais. Como a membrana da mitocôndria é recheada dessas proteínas que agem como 'catracas', a estrutura desmorona de dentro para fora." },
    { id: 11, suspeito: "Radical Livre Solto", local: "Zona Tóxica", problema: "Acúmulo de radicais danificou as enzimas", pistasNoMapa: { "Glicólise": "O culpado saiu do controle e começou a corroer a fábrica como ácido.", "Núcleo": "Partes importantes do processo foram quebradas em pedaços irreversíveis.", "Portão Principal": "O ambiente ficou totalmente impossível para quem tentava trabalhar." }, explicacaoCientifica: "As enzimas precisam de um formato 3D perfeito (como uma chave fechadura) para funcionar. Radicais livres altamente tóxicos não neutralizados pelos antioxidantes alteram a forma física dessas proteínas. Uma vez deformada, a enzima nunca mais se encaixa no seu substrato, causando pane geral no metabolismo." },
    { id: 12, suspeito: "Célula Organizada", local: "Reserva de glicose", problema: "Incapacidade de mobilizar energia", pistasNoMapa: { "Setor Genético": "Tão desorientada que perdeu a chave da própria despensa.", "Zona Oxidativa": "O estoque de comida está cheio, mas ficou trancado justo na hora da fome.", "COA (Garagem)": "Incapaz de acessar e usar os próprios nutrientes que guardou para si." }, explicacaoCientifica: "O nosso corpo guarda o excesso de açúcar na forma de 'Glicogênio' no fígado e músculos. Se a célula não produz as enzimas que quebram esse estoque de volta para glicose (glicogenólise), ela não consegue acessar sua própria reserva. É como morrer de fome com a geladeira cheia e trancada." }
];

let casoAtual = null; 
let salaAtual = null; 
let jogadorPos = { x: 23, y: 9 };
let partidaAtual = 0; 
let historicoVencedores = [null, null, null]; 
let casosResolvidosGlobais = []; 
let jogadores = [];
let turnoAtual = 0;
let passosDisponiveis = 0;

let somMutado = false;
let modoFacil = false;

// ==========================================
// 2. SISTEMA DE SAVE STATE (AUTO-SAVE)
// ==========================================
function salvarEstado() {
    // Não salva se o jogo nem começou direito
    if (jogadores.length === 0 || !casoAtual) return;
    
    const estadoJogo = {
        jogadores, turnoAtual, partidaAtual, historicoVencedores, casoAtual, casosResolvidosGlobais, modoFacil
    };
    localStorage.setItem('csi_savegame', JSON.stringify(estadoJogo));
}

function verificarSaveExistente() {
    const save = localStorage.getItem('csi_savegame');
    return save ? true : false;
}

function retomarPartida() {
    const save = JSON.parse(localStorage.getItem('csi_savegame'));
    jogadores = save.jogadores;
    turnoAtual = save.turnoAtual;
    partidaAtual = save.partidaAtual;
    historicoVencedores = save.historicoVencedores;
    casoAtual = save.casoAtual;
    casosResolvidosGlobais = save.casosResolvidosGlobais;
    modoFacil = save.modoFacil;
    
    if(modoFacil) {
        document.getElementById('btn-toggle-modo').innerText = 'Modo: FÁCIL Ativado';
        document.getElementById('btn-toggle-modo').style.color = '#8b0000';
    }

    document.getElementById('modal-save').style.display = 'none';
    document.getElementById('tela-menu').classList.remove('ativa');
    document.getElementById('tela-menu').style.display = 'none';
    
    document.getElementById('tela-tabuleiro').classList.add('ativa');
    document.getElementById('dado-flutuante').style.display = 'block';
    
    passosDisponiveis = 0; 
    document.getElementById('btn-rolar-dado').style.display = 'block';
    document.getElementById('btn-passar-turno').style.display = 'none';
    document.getElementById('dado-resultado').innerText = '-';

    atualizarPlacarMD3();
    atualizarListaCasosResolvidos();
    atualizarTurno();
    criarGrade();
}

function ignorarSave() {
    localStorage.removeItem('csi_savegame');
    document.getElementById('modal-save').style.display = 'none';
    document.getElementById('tela-menu').classList.remove('ativa'); 
    document.getElementById('tela-menu').style.display = 'none';    
    document.getElementById('tela-setup').style.display = 'flex'; 
}

// ==========================================
// 3. GERENCIAMENTO DE TELAS E MENUS
// ==========================================
const btnJogar = document.getElementById('btn-jogar');
const telaMenu = document.getElementById('tela-menu');
const telaTabuleiro = document.getElementById('tela-tabuleiro');
const telaSetup = document.getElementById('tela-setup');

btnJogar.addEventListener('click', function() {
    if (verificarSaveExistente()) {
        document.getElementById('modal-save').style.display = 'flex';
    } else {
        telaMenu.classList.remove('ativa'); 
        telaMenu.style.display = 'none';    
        telaSetup.style.display = 'flex';   
    }
});

document.getElementById('btn-configuracoes').addEventListener('click', () => {
    atualizarTabelaRanking(); 
    document.getElementById('modal-configuracoes').style.display = 'flex';
});

const menuInGame = document.getElementById('menu-in-game');
const modalGlossario = document.getElementById('modal-glossario');
const modalSuspeitos = document.getElementById('modal-suspeitos');

document.addEventListener('keydown', function(event) {
    if (telaTabuleiro.classList.contains('ativa')) {
        if (event.key === 'm' || event.key === 'M') {
            if (menuInGame.style.display === 'flex') {
                menuInGame.style.display = 'none';
            } else {
                menuInGame.style.display = 'flex';
                modalGlossario.style.display = 'none';
                modalSuspeitos.style.display = 'none';
                atualizarQuadroDePistas();
            }
        }
    }
});

document.getElementById('btn-in-voltar').addEventListener('click', () => {
    menuInGame.style.display = 'none';       
    telaTabuleiro.classList.remove('ativa'); 
    telaMenu.style.display = ''; 
    telaMenu.classList.add('ativa');         
    document.getElementById('dado-flutuante').style.display = 'none';
});

document.getElementById('btn-in-glossario').addEventListener('click', () => {
    menuInGame.style.display = 'none';       
    modalGlossario.style.display = 'flex';   
    voltarMenuGlossario();
});

document.getElementById('btn-in-suspeitos').addEventListener('click', () => {
    menuInGame.style.display = 'none';       
    modalSuspeitos.style.display = 'flex';   
});

const botoesFecharSubmodal = document.querySelectorAll('.fechar-submodal');
botoesFecharSubmodal.forEach(botao => {
    botao.addEventListener('click', (e) => {
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'none';
        if (telaTabuleiro.classList.contains('ativa') && targetId !== 'modal-configuracoes') {
            menuInGame.style.display = 'flex'; 
        }
    });
});

// Configurações e Modo Fácil
function toggleSom() {
    somMutado = !somMutado;
    const btn = document.getElementById('btn-toggle-som');
    if (somMutado) {
        btn.innerText = '🔇 Som: MUDO';
        btn.style.color = '#8b0000';
    } else {
        btn.innerText = '🔊 Som: LIGADO';
        btn.style.color = '#333';
    }
}

function tentarToggleModo() {
    if (!modoFacil) {
        document.getElementById('modal-aviso-facil').style.display = 'flex';
    } else {
        modoFacil = false;
        document.getElementById('btn-toggle-modo').innerText = 'Modo: NORMAL';
        document.getElementById('btn-toggle-modo').style.color = '#333';
        salvarEstado();
    }
}

function confirmarModoFacil() {
    modoFacil = true;
    document.getElementById('btn-toggle-modo').innerText = 'Modo: FÁCIL Ativado';
    document.getElementById('btn-toggle-modo').style.color = '#8b0000';
    fecharAvisoFacil();
    salvarEstado();
}
function fecharAvisoFacil() { document.getElementById('modal-aviso-facil').style.display = 'none'; }

// ==========================================
// 4. INÍCIO DA PARTIDA E TURNOS
// ==========================================
function proximoPassoSetup() {
    document.getElementById('setup-passo-1').style.display = 'none';
    document.getElementById('setup-passo-2').style.display = 'block';
    document.getElementById('campos-nomes').innerHTML = `
        <input type="text" id="nome-p1" class="input-nome" placeholder="Nome do Detetive Verde">
        <input type="text" id="nome-p2" class="input-nome" placeholder="Nome do Detetive Azul">
    `;
}

function iniciarPartidaComp() {
    const p1 = document.getElementById('nome-p1').value || 'Detetive Verde';
    const p2 = document.getElementById('nome-p2').value || 'Detetive Azul';
    
    jogadores = [
        { id: 0, nome: p1, pos: { x: 23, y: 9 }, cor: '#4CAF50', pistasEncontradas: [], checklist: {}, turnosJogados: 0 },
        { id: 1, nome: p2, pos: { x: 23, y: 9 }, cor: '#2196F3', pistasEncontradas: [], checklist: {}, turnosJogados: 0 }
    ];

    document.getElementById('tela-setup').style.display = 'none';
    document.getElementById('tela-tabuleiro').classList.add('ativa');
    document.getElementById('dado-flutuante').style.display = 'block'; 
    
    partidaAtual = 0;
    historicoVencedores = [null, null, null];
    atualizarPlacarMD3();

    sortearCasoEGerarDica();
    
    turnoAtual = 0; 
    atualizarTurno();
    criarGrade();
    salvarEstado(); // Salva o início
}

function sortearCasoEGerarDica() {
    const indexSorteado = Math.floor(Math.random() * bancoDeCasos.length);
    casoAtual = bancoDeCasos[indexSorteado];
    
    casoAtual.dicaFacil = `
        <strong>Suspeitos:</strong> ${gerarOpcoesEmbaralhadas(casoAtual.suspeito, bancoDeArquivos.suspeitos.map(s=>s.nome))}<br>
        <strong>Locais:</strong> ${gerarOpcoesEmbaralhadas(casoAtual.local, bancoDeArquivos.locais.map(l=>l.nome))}<br>
        <strong>Problemas:</strong> ${gerarOpcoesEmbaralhadas(casoAtual.problema, dadosBloco[2].itens)}
    `;
}

function gerarOpcoesEmbaralhadas(correta, listaCompleta) {
    let errados = listaCompleta.filter(x => x !== correta);
    errados.sort(() => 0.5 - Math.random());
    let misturados = [correta, errados[0], errados[1]];
    misturados.sort(() => 0.5 - Math.random());
    return misturados.join(' / ');
}

function atualizarTurno() {
    if(jogadores.length === 0) return;
    const jogadorAtual = jogadores[turnoAtual];
    jogadorPos = jogadorAtual.pos; 
    
    const divNome = document.getElementById('nome-jogador-atual');
    if(divNome) {
        divNome.innerText = `Vez de: ${jogadorAtual.nome}`;
        divNome.style.color = jogadorAtual.cor;
    }
    
    document.getElementById('dado-resultado').innerText = '-';
    document.getElementById('btn-rolar-dado').style.display = 'block';
    document.getElementById('btn-passar-turno').style.display = 'none';

    atualizarVisualChecklist();
    atualizarQuadroDePistas();
}

function passarTurno() {
    jogadores[turnoAtual].turnosJogados++; 
    turnoAtual = (turnoAtual + 1) % jogadores.length;
    salaAtual = null; 
    atualizarTurno();
    criarGrade(); 
    salvarEstado(); // Salva o fim do turno
}

function atualizarPlacarMD3() {
    for (let i = 0; i < 3; i++) {
        const dot = document.getElementById(`md3-${i+1}`);
        if (dot) {
            if (historicoVencedores[i] === 0) dot.style.backgroundColor = '#4CAF50'; 
            else if (historicoVencedores[i] === 1) dot.style.backgroundColor = '#2196F3'; 
            else dot.style.backgroundColor = 'white';
        }
    }
}

// ==========================================
// 5. ALERTAS CUSTOMIZADOS E TRANSIÇÃO MD3
// ==========================================
function mostrarModalVitoria(titulo, texto, callback) {
    const modal = document.getElementById('modal-vitoria');
    document.getElementById('vitoria-titulo').innerText = titulo;
    document.getElementById('vitoria-texto').innerHTML = texto;
    modal.style.display = 'flex';
    
    const btn = document.getElementById('btn-vitoria-ok');
    const novoBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(novoBtn, btn);
    
    novoBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        if(callback) callback();
    });
}

function iniciarProximoRound(vencedorId) {
    salvarNoRanking(jogadores[vencedorId].nome, casoAtual.suspeito, jogadores[vencedorId].turnosJogados);
    casosResolvidosGlobais.push({ caso: casoAtual, vencedor: jogadores[vencedorId].nome });
    atualizarListaCasosResolvidos();

    historicoVencedores[partidaAtual] = vencedorId;
    atualizarPlacarMD3();
    
    const vitorias = historicoVencedores.filter(id => id === vencedorId).length;
    if (vitorias >= 2) {
        mostrarModalVitoria(
            "🏆 CAMPEÃO DA MD3! 🏆", 
            `<p>Parabéns, <strong style="color: ${jogadores[vencedorId].cor};">${jogadores[vencedorId].nome}</strong>!</p><p>Você resolveu 2 casos primeiro e é o grande detetive da Célula!</p>`,
            () => {
                localStorage.removeItem('csi_savegame'); // Limpa o save
                location.reload(); 
            }
        );
        return;
    }

    mostrarModalVitoria(
        "📂 CASO ENCERRADO!", 
        `<p style="margin-bottom: 10px;">O culpado era <strong>${casoAtual.suspeito}</strong> no <strong>${casoAtual.local}</strong>.</p>
         <p style="margin-bottom: 20px;">👉 Ponto para <strong style="color: ${jogadores[vencedorId].cor};">${jogadores[vencedorId].nome}</strong>!</p>
         <p style="font-size: 0.9em; font-style: italic;">Preparando o Round ${partidaAtual + 2}...</p>`,
        () => {
            partidaAtual++;
            jogadores.forEach(j => {
                j.pos = { x: 23, y: 9 };
                j.pistasEncontradas = [];
                j.checklist = {}; 
                j.turnosJogados = 0; 
            });
            
            sortearCasoEGerarDica();
            turnoAtual = partidaAtual % 2; 
            
            document.getElementById('modal-investigacao').style.display = 'none';
            document.getElementById('modal-suspeitos').style.display = 'none';
            document.getElementById('menu-in-game').style.display = 'none';

            atualizarTurno();
            criarGrade();
            salvarEstado();
        }
    );
}

function salvarNoRanking(nome, caso, turnos) {
    let ranking = JSON.parse(localStorage.getItem('csi_ranking')) || [];
    ranking.push({ nome: nome, caso: caso, turnos: turnos });
    ranking.sort((a, b) => a.turnos - b.turnos); 
    localStorage.setItem('csi_ranking', JSON.stringify(ranking));
    atualizarTabelaRanking();
}

function atualizarTabelaRanking() {
    const lista = document.getElementById('lista-ranking');
    let ranking = JSON.parse(localStorage.getItem('csi_ranking')) || [];
    
    if (ranking.length === 0) {
        lista.innerHTML = '<li class="pista-vazia">Nenhum caso resolvido ainda.</li>';
        return;
    }

    lista.innerHTML = '';
    ranking.forEach((r, index) => {
        let li = document.createElement('li');
        li.innerHTML = `<strong>${index + 1}º - ${r.nome}</strong><br>Caso: ${r.caso} <br>Resolvido em: <span style="color:#8b0000;">${r.turnos} turnos</span>`;
        li.style.cursor = 'default';
        lista.appendChild(li);
    });
}

// ==========================================
// 6. LÓGICA DO TABULEIRO (MOVIMENTO E SALAS)
// ==========================================
function criarGrade() {
    grade.innerHTML = ''; 
    for (let y = 0; y < linhas; y++) {
        for (let x = 0; x < colunas; x++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            celula.dataset.x = x;
            celula.dataset.y = y;
            
            for (const [nomeDaSala, limites] of Object.entries(salas)) {
                if (x >= limites.minX && x <= limites.maxX && y >= limites.minY && y <= limites.maxY) {
                    celula.classList.add('area-sala');
                }
            }
            
            let cellHasPlayer = false;
            let pColor = '';
            jogadores.forEach(jog => {
                if (x === jog.pos.x && y === jog.pos.y) {
                    cellHasPlayer = true;
                    if(jog.id === turnoAtual || pColor === '') pColor = jog.cor;
                }
            });

            if (cellHasPlayer) {
                celula.classList.add('jogador');
                celula.style.setProperty('background-color', pColor, 'important');
                celula.style.setProperty('box-shadow', `0 0 10px ${pColor}`, 'important');
            }

            celula.addEventListener('click', () => moverJogador(x, y));
            grade.appendChild(celula);
        }
    }
}

function moverJogador(novoX, novoY) {
    if (passosDisponiveis === 0) return; 

    const dist = Math.abs(novoX - jogadorPos.x) + Math.abs(novoY - jogadorPos.y);
    if (dist > 0 && dist <= passosDisponiveis) {
        jogadores[turnoAtual].pos = { x: novoX, y: novoY };
        jogadorPos = jogadores[turnoAtual].pos;
        
        passosDisponiveis = 0; 
        
        document.getElementById('btn-rolar-dado').style.display = 'none';
        document.getElementById('btn-passar-turno').style.display = 'block';

        criarGrade(); 
        verificarSala(novoX, novoY);
        salvarEstado(); // Salva o passo andado
    }
}

function verificarSala(x, y) {
    let pisouEmAlgumaSala = false;
    for (const [nomeDaSala, limites] of Object.entries(salas)) {
        if (x >= limites.minX && x <= limites.maxX && y >= limites.minY && y <= limites.maxY) {
            pisouEmAlgumaSala = true;
            if (salaAtual !== nomeDaSala) {
                salaAtual = nomeDaSala; 
                abrirModalInvestigacao(nomeDaSala); 
            }
            return true; 
        }
    }
    if (!pisouEmAlgumaSala) { salaAtual = null; return false; }
}

function abrirModalInvestigacao(nomeDaSala) {
    const modal = document.getElementById('modal-investigacao');
    let conteudoSala = "";

    if (nomeDaSala === "Laboratório Central") {
        conteudoSala = `<p style="color: #555; font-weight: bold; font-size: 1.1em;">Este é o ponto inicial da sua missão. Aqui não há pistas. Siga para outras organelas, detetive!</p>`;
    } else if (casoAtual && casoAtual.pistasNoMapa[nomeDaSala]) {
        const textoDaPista = casoAtual.pistasNoMapa[nomeDaSala]; 
        
        const pistaJaExiste = jogadores[turnoAtual].pistasEncontradas.some(p => p.texto.includes(textoDaPista));
        if (!pistaJaExiste) {
            jogadores[turnoAtual].pistasEncontradas.push({ texto: `(${nomeDaSala}) ${textoDaPista}` });
            salvarEstado(); // Salva a pista achada
        }

        conteudoSala = `
            <div style="border: 2px dashed #8b0000; padding: 15px; background-color: rgba(255,255,255,0.3);">
                <p style="color: #8b0000; font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">📜 VOCÊ ENCONTROU UMA PISTA!</p>
                <p style="font-size: 1.1em; font-style: italic;">"${textoDaPista}"</p>
            </div>
        `;
    } else {
        conteudoSala = `<p style="color: #555; font-style: italic; font-size: 1.1em;">Não há nada por aqui, continue a investigação detetive.</p>`;
    }

    modal.innerHTML = `
        <div class="conteudo-modal" style="background-color: #d8c3a5; color: #333; border: 3px solid #333; font-family: 'Courier New', Courier, monospace; box-shadow: 0 15px 30px rgba(0,0,0,0.8);">
            <h2 style="color: #8b0000; border-bottom: 2px dashed #333; padding-bottom: 10px; margin-top: 0;">📍 ${nomeDaSala}</h2>
            ${conteudoSala}
            <button id="fechar-modal-investigacao" style="margin-top: 25px; padding: 12px 25px; cursor: pointer; background-color: transparent; color: #333; border: 2px solid #333; font-weight: bold; font-family: 'Courier New'; transition: 0.2s;">Continuar Explorando</button>
        </div>
    `;
    
    modal.style.display = 'flex';

    const btnFechar = document.getElementById('fechar-modal-investigacao');
    btnFechar.onmouseover = () => { btnFechar.style.backgroundColor = '#333'; btnFechar.style.color = '#d8c3a5'; };
    btnFechar.onmouseout = () => { btnFechar.style.backgroundColor = 'transparent'; btnFechar.style.color = '#333'; };
    btnFechar.addEventListener('click', () => { modal.style.display = 'none'; });
}

// ==========================================
// 7. BANCO DE DADOS DO GLOSSÁRIO (SUBMENUS)
// ==========================================
const bancoDeArquivos = {
    suspeitos: [
        { id: 'S-atpMutante', nome: 'ATP Mutante' }, { id: 'S-celulaOrganizada', nome: 'Célula Organizada' },
        { id: 'S-enzimaCatalizadora', nome: 'Enzima Catalizadora' }, { id: 'S-mitocondriaZumbi', nome: 'Mitocôndria Zumbi' },
        { id: 'S-mitoEnergetico', nome: 'Mito Energético' }, { id: 'S-organoideClonado', nome: 'Organoide Clonado' },
        { id: 'S-oxigenioExplosivo', nome: 'Oxigênio Explosivo' }, { id: 'S-radicalLivreSolto', nome: 'Radical Livre Solto' },
        { id: 'S-radicalRaivoso', nome: 'Radical Raivoso' }, { id: 'S-rnaMutante', nome: 'RNA Mutante' }
    ],
    locais: [
        { id: 'L-cadeiaTransportadoraDeEletrons', nome: 'Cadeia de Elétrons' }, { id: 'L-cicloDeKrebs', nome: 'Ciclo de Krebs' },
        { id: 'L-descarboxilacaoDoPiruvato', nome: 'Descarboxilação do Piruvato' }, { id: 'L-fosforilacaoOxidativa', nome: 'Fosforilação Oxidativa' },
        { id: 'L-glicolise', nome: 'Glicólise' }, { id: 'L-laboratorioCentral', nome: 'Laboratório Central' },
        { id: 'L-producaoDeAcetil-coa', nome: 'Produção de Acetil-CoA' }, { id: 'L-reservaDeGlicose', nome: 'Reserva de Glicose' },
        { id: 'L-setorGenetico', nome: 'Setor Genético' }, { id: 'L-zonaToxica', nome: 'Zona Tóxica' }
    ]
};

function abrirSubmenuGlossario(menu) {
    document.getElementById('glossario-menu-principal').style.display = 'none';
    document.getElementById('glossario-submenu-suspeitos').style.display = 'none';
    document.getElementById('glossario-submenu-locais').style.display = 'none';
    document.getElementById('glossario-submenu-casos').style.display = 'none';
    document.getElementById(`glossario-submenu-${menu}`).style.display = 'block';
}

function voltarMenuGlossario() {
    document.getElementById('glossario-submenu-suspeitos').style.display = 'none';
    document.getElementById('glossario-submenu-locais').style.display = 'none';
    document.getElementById('glossario-submenu-casos').style.display = 'none';
    document.getElementById('glossario-menu-principal').style.display = 'block';

    document.getElementById('detalhe-imagem-container').style.display = 'none';
    document.getElementById('detalhe-texto-container').style.display = 'none';
    document.getElementById('detalhe-titulo').style.display = 'none';
    document.getElementById('detalhe-descricao').style.display = 'block';
}

function inicializarGlossario() {
    const listaSuspeitos = document.getElementById('lista-suspeitos');
    const listaLocais = document.getElementById('lista-locais');

    bancoDeArquivos.suspeitos.forEach(item => {
        let li = document.createElement('li'); li.innerText = item.nome;
        li.onclick = () => carregarArquivo(item.id, item.nome, 'Perfil do Suspeito');
        listaSuspeitos.appendChild(li);
    });
    bancoDeArquivos.locais.forEach(item => {
        let li = document.createElement('li'); li.innerText = item.nome;
        li.onclick = () => carregarArquivo(item.id, item.nome, 'Relatório do Local');
        listaLocais.appendChild(li);
    });
}

function carregarArquivo(id, nome, tipo) {
    document.getElementById('detalhe-titulo').style.display = 'none';
    document.getElementById('detalhe-texto-container').style.display = 'none'; 
    document.getElementById('detalhe-descricao').style.display = 'none';

    const imgEl = document.getElementById('detalhe-imagem');
    imgEl.src = `assets/img/${id}.png`; 
    imgEl.style.display = 'block';
    document.getElementById('detalhe-imagem-container').style.display = 'flex';
}

function atualizarListaCasosResolvidos() {
    const ul = document.getElementById('lista-casos-resolvidos');
    if(casosResolvidosGlobais.length === 0) {
        ul.innerHTML = '<li class="pista-vazia">Nenhum caso resolvido ainda.</li>';
        return;
    }
    ul.innerHTML = '';
    casosResolvidosGlobais.forEach((item, index) => {
        let li = document.createElement('li');
        li.innerText = `Caso ${index + 1}: ${item.caso.suspeito}`;
        li.onclick = () => carregarCasoResolvido(index);
        ul.appendChild(li);
    });
}

function carregarCasoResolvido(index) {
    const casoData = casosResolvidosGlobais[index];
    const caso = casoData.caso;

    const titulo = document.getElementById('detalhe-titulo');
    titulo.style.display = 'block';
    titulo.innerText = `Dossiê: Caso ${index + 1}`;
    titulo.style.color = '#8b0000';
    titulo.style.borderBottom = '2px dashed #333';
    titulo.style.paddingBottom = '10px';

    document.getElementById('detalhe-imagem-container').style.display = 'none';
    document.getElementById('detalhe-descricao').style.display = 'none';

    const textoContainer = document.getElementById('detalhe-texto-container');
    textoContainer.style.display = 'block';

    textoContainer.innerHTML = `
        <p style="margin-bottom: 5px;"><strong>👨‍🔬 Detetive:</strong> ${casoData.vencedor}</p>
        <p style="margin-bottom: 5px; color: #8b0000;"><strong>🕵️‍♂️ Culpado:</strong> ${caso.suspeito}</p>
        <p style="margin-bottom: 5px;"><strong>📍 Local:</strong> ${caso.local}</p>
        <p style="margin-bottom: 15px;"><strong>⚠️ Problema:</strong> ${caso.problema}</p>
        
        <div style="background-color: rgba(255,255,255,0.4); padding: 15px; border: 2px dashed #333; border-radius: 5px; margin-top: 20px;">
            <h3 style="color: #00008b; margin-top: 0; text-transform: uppercase;">🔬 Relatório Científico Oficial</h3>
            <p style="text-align: justify; font-style: italic;">${caso.explicacaoCientifica}</p>
        </div>
    `;
}

const hitboxGlossarioMenu = document.querySelector('.hitbox-glossario');
if (hitboxGlossarioMenu) {
    hitboxGlossarioMenu.addEventListener('click', () => { 
        document.getElementById('modal-glossario').style.display = 'flex'; 
        voltarMenuGlossario(); 
    });
}
inicializarGlossario();

// ==========================================
// 8. SISTEMA DE BLOCO DE ANOTAÇÕES MÚLTIPLO
// ==========================================
const dadosBloco = [
    { titulo: "SUSPEITOS", itens: [ "Célula Organizada", "Enzima Congelada", "Oxigênio Explosivo", "ATP Mutante", "Mitocôndria Zumbi", "Mito Energético", "Radical Raivoso", "Organoide Clonado", "Radical Livre Solto", "RNA Mutante" ] },
    { titulo: "LOCAIS", itens: [ "Reserva de glicose", "Glicólise", "Descarboxilação do Piruvato", "Produção de Acetil-CoA", "Ciclo de Krebs", "Cadeia transportadora", "Fosforilação Oxidativa", "Zona Tóxica", "Setor Genético", "Laboratório Central" ] },
    { titulo: "PROBLEMAS", itens: [ "Consome oxigênio sem gerar ATP", "Acúmulo de radicais danificou as enzimas", "ATP defeituoso inutilizável", "Falha na formação de acetil-coa", "Incapacidade de mobilizar energia", "Falta de insumos para funcionar", "Mutação destruiu DNA mitocondrial", "Produção de proteínas defeituosas", "Excesso de oxigênio causou estresse oxidativo", "Desvio do processo por estrutura falsa", "Danos às membranas mitocondriais", "Proteínas mitocondriais defeituosas" ] }
];

function montarBlocoAnotacoes() {
    const conteinerBloco = document.getElementById('bloco-conteudo');
    dadosBloco.forEach(secao => {
        const divSecao = document.createElement('div'); divSecao.classList.add('secao-bloco');
        const tituloSecao = document.createElement('div'); tituloSecao.classList.add('secao-titulo'); tituloSecao.innerText = secao.titulo;
        const divLista = document.createElement('div'); divLista.classList.add('secao-lista');

        secao.itens.forEach(texto => {
            const linha = document.createElement('div'); linha.classList.add('linha-item');
            const spanTexto = document.createElement('span'); spanTexto.innerText = texto;
            const bolinhas = document.createElement('div'); bolinhas.classList.add('container-bolinhas');
            
            const bolinha = document.createElement('div'); bolinha.classList.add('bolinha-status', 'vazio'); bolinha.dataset.estado = '0'; 

            bolinha.addEventListener('click', function() {
                let proximoEstado = (parseInt(this.dataset.estado) + 1) % 4;
                this.dataset.estado = proximoEstado;
                this.classList.remove('vazio', 'certo', 'errado', 'duvida');

                if (proximoEstado === 0) this.classList.add('vazio');
                else if (proximoEstado === 1) this.classList.add('certo');
                else if (proximoEstado === 2) this.classList.add('errado');
                else if (proximoEstado === 3) this.classList.add('duvida');

                jogadores[turnoAtual].checklist[texto] = proximoEstado;
                salvarEstado(); // Salva sempre que anotar algo no bloco

                if (proximoEstado === 1 && casoAtual) {
                    setTimeout(() => { verificarVitoriaInstantanea(); }, 100);
                }
            });

            bolinhas.appendChild(bolinha); linha.appendChild(spanTexto); linha.appendChild(bolinhas); divLista.appendChild(linha);
        });
        divSecao.appendChild(tituloSecao); divSecao.appendChild(divLista); conteinerBloco.appendChild(divSecao);
    });
}
montarBlocoAnotacoes();

function atualizarVisualChecklist() {
    if (jogadores.length === 0) return;
    const todasLinhas = document.querySelectorAll('.linha-item');
    todasLinhas.forEach(linha => {
        const texto = linha.querySelector('span').innerText;
        const bolinha = linha.querySelector('.container-bolinhas .bolinha-status');
        
        const estadoSalvo = jogadores[turnoAtual].checklist[texto] || 0;
        
        bolinha.dataset.estado = estadoSalvo;
        bolinha.classList.remove('vazio', 'certo', 'errado', 'duvida');
        if (estadoSalvo === 0) bolinha.classList.add('vazio');
        else if (estadoSalvo === 1) bolinha.classList.add('certo');
        else if (estadoSalvo === 2) bolinha.classList.add('errado');
        else if (estadoSalvo === 3) bolinha.classList.add('duvida');
    });
}

// ==========================================
// 9. DADO D12 ANIMADO E MOVIMENTAÇÃO
// ==========================================
document.getElementById('btn-rolar-dado').addEventListener('click', () => {
    if (passosDisponiveis > 0) return; 

    const btn = document.getElementById('btn-rolar-dado');
    const display = document.getElementById('dado-resultado');
    
    // Trava o botão para não clicarem mil vezes
    btn.disabled = true;
    btn.innerText = "Rolando...";
    btn.style.opacity = '0.5';
    
    let tempo = 0;
    // Animação de suspense rolando os números
    const animacao = setInterval(() => {
        display.innerText = Math.floor(Math.random() * 12) + 1;
        tempo += 50;
        
        if(tempo >= 600) { // Dura 0.6 segundos
            clearInterval(animacao);
            
            // Resultado final real
            const resultado = Math.floor(Math.random() * 12) + 1; 
            display.innerText = resultado;
            passosDisponiveis = resultado;
            
            // Libera o botão
            btn.disabled = false;
            btn.innerText = "Rolar D12";
            btn.style.opacity = '1';
            
            destacarCasasAlcancaveis();
        }
    }, 50);
});

document.getElementById('btn-passar-turno').addEventListener('click', () => {
    passarTurno();
});

function destacarCasasAlcancaveis() {
    const celulas = document.querySelectorAll('.celula');
    celulas.forEach(c => {
        const x = parseInt(c.dataset.x); const y = parseInt(c.dataset.y);
        const dist = Math.abs(x - jogadorPos.x) + Math.abs(y - jogadorPos.y);

        if (dist > 0 && dist <= passosDisponiveis) {
            let ehSala = false;
            for (const [nomeDaSala, limites] of Object.entries(salas)) {
                if (x >= limites.minX && x <= limites.maxX && y >= limites.minY && y <= limites.maxY) { ehSala = true; break; }
            }
            if (ehSala) c.classList.add('alcancavel-sala'); 
            else c.classList.add('alcancavel');      
        }
    });
}

const dadoFlutuante = document.getElementById('dado-flutuante');
const dadoHeader = document.getElementById('dado-header');
let isDragging = false; let dragOffsetX, dragOffsetY;

dadoHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - dadoFlutuante.getBoundingClientRect().left;
    dragOffsetY = e.clientY - dadoFlutuante.getBoundingClientRect().top;
});
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dadoFlutuante.style.bottom = 'auto'; dadoFlutuante.style.right = 'auto';
    dadoFlutuante.style.left = `${e.clientX - dragOffsetX}px`; dadoFlutuante.style.top = `${e.clientY - dragOffsetY}px`;
});
document.addEventListener('mouseup', () => { isDragging = false; });

// ==========================================
// 10. AUDITORIA DE VITÓRIA E PISTAS VISUAIS
// ==========================================
function verificarVitoriaInstantanea() {
    let marcadosCerto = []; 
    const checklist = jogadores[turnoAtual].checklist;

    for (const [texto, estado] of Object.entries(checklist)) {
        if (estado === 1) { marcadosCerto.push(texto); }
    }

    if (marcadosCerto.length === 3) {
        const acertouSuspeito = marcadosCerto.includes(casoAtual.suspeito);
        const acertouLocal = marcadosCerto.includes(casoAtual.local);
        const acertouProblema = marcadosCerto.includes(casoAtual.problema);

        if (acertouSuspeito && acertouLocal && acertouProblema) {
            iniciarProximoRound(turnoAtual);
        }
    }
}

function atualizarQuadroDePistas() {
    const lista = document.getElementById('lista-pistas-encontradas');
    if (!lista || jogadores.length === 0) return; 
    lista.innerHTML = ''; 

    const pistasDoJogador = jogadores[turnoAtual].pistasEncontradas;

    if (pistasDoJogador.length === 0) {
        lista.innerHTML = '<li class="pista-vazia">Nenhuma pista encontrada ainda... Explore as salas!</li>';
        return;
    }

    pistasDoJogador.forEach(pistaObj => {
        const li = document.createElement('li'); 
        li.innerHTML = pistaObj.texto; 
        
        if (modoFacil && casoAtual.dicaFacil) {
            const divDica = document.createElement('div');
            divDica.style.marginTop = '10px';
            divDica.style.padding = '10px';
            divDica.style.backgroundColor = 'rgba(255,255,255,0.6)';
            divDica.style.border = '2px dashed #006400';
            divDica.style.borderRadius = '5px';
            divDica.style.fontSize = '0.9em';
            divDica.style.color = '#333';
            
            divDica.innerHTML = `<strong style="color: #006400;">AGÊNCIA DE INFORMAÇÕES:</strong><br><br>${casoAtual.dicaFacil}`;
            li.appendChild(divDica);
        }
        
        lista.appendChild(li);
    });
}