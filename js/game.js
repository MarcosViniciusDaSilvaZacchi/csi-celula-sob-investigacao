// ==========================================
// 1. CONFIGURAÇÕES INICIAIS
// ==========================================
const grade = document.getElementById('grade-tabuleiro');
const colunas = 47; 
const linhas = 20;
let jogadorPos = { x: 23, y: 9 }; // O jogador nasce no centro (Laboratório Central)

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

// ==========================================
// 8. BANCO DE CASOS E MISTÉRIOS (TRIOS SECRETOS)
// ==========================================
const bancoDeCasos = [
    {
        id: 1,
        suspeito: "Oxigênio Explosivo", 
        local: "Ciclo de Krebs",
        problema: "Excesso de oxigênio causou estresse oxidativo",
        pistasNoMapa: {
            "Setor Genético": "O culpado estava tentando ajudar a célula a produzir energia, mas causou um problema.",
            "Zona Tóxica": "A falha aconteceu perto de um lugar onde o oxigênio é usado.",
            "Sala de Arquivos": "O culpado parecia inofensivo, mas bagunçou tudo sem querer."
        }
    },
    {
        id: 2,
        suspeito: "Mitocôndria Zumbi",
        local: "Setor Genético",
        problema: "Mutação destruiu DNA mitocondrial",
        pistasNoMapa: {
            "Núcleo": "O culpado tentou corrigir o processo de produção de energia, mas não teve sucesso.",
            "Zona Oxidativa": "O culpado deixou algo escapar que era essencial.",
            "Portão Principal": "O culpado consumia nutrientes mas não devolvia energia."
        }
    },
    {
        id: 3,
        suspeito: "RNA Mutante", 
        local: "Cadeia transportadora", 
        problema: "Produção de proteínas defeituosas",
        pistasNoMapa: {
            "Glicólise": "O culpado confundiu os caminhos da célula com informações erradas.",
            "COA (Garagem)": "A falha aconteceu porque peças erradas foram usadas na fabricação.",
            "Ciclo de Krebs": "O culpado chegou antes do esperado e atrapalhou tudo."
        }
    }
];

let casoAtual = null; 
let pistasEncontradasNaPartida = []; // Memória do detetive

// ==========================================
// VARIÁVEIS DE CONTROLE DE INVESTIGAÇÃO
// ==========================================
let salaAtual = null; // Guarda a sala onde o jogador está pisando neste exato momento

// ==========================================
// 2. GERENCIAMENTO DE TELAS (MENU / SETUP / TABULEIRO)
// ==========================================
const btnJogar = document.getElementById('btn-jogar');
const telaMenu = document.getElementById('tela-menu');
const telaTabuleiro = document.getElementById('tela-tabuleiro');
const telaSetup = document.getElementById('tela-setup');

btnJogar.addEventListener('click', function() {
    telaMenu.classList.remove('ativa'); 
    telaMenu.style.display = 'none';    
    telaSetup.style.display = 'flex';   
});

// ==========================================
// 4. MENU IN-GAME (SISTEMA DE PAUSA)
// ==========================================
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
                
                // Atualiza o quadro visual de pistas
                atualizarQuadroDePistas();
            }
        }
    }
});

document.getElementById('btn-in-voltar').addEventListener('click', () => {
    menuInGame.style.display = 'none';       
    telaTabuleiro.classList.remove('ativa'); 
    telaMenu.classList.add('ativa');         
    document.getElementById('dado-flutuante').style.display = 'none';
});

document.getElementById('btn-in-glossario').addEventListener('click', () => {
    menuInGame.style.display = 'none';       
    modalGlossario.style.display = 'flex';   
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
        
        if (telaTabuleiro.classList.contains('ativa')) {
            menuInGame.style.display = 'flex'; 
        }
    });
});

// ==========================================
// 3. LÓGICA DO TABULEIRO (MOVIMENTO E SALAS)
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
                if (x >= limites.minX && x <= limites.maxX &&
                    y >= limites.minY && y <= limites.maxY) {
                    celula.classList.add('area-sala');
                }
            }
            
            if (x === jogadorPos.x && y === jogadorPos.y) {
                celula.classList.add('jogador');
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
        jogadorPos = { x: novoX, y: novoY };
        passosDisponiveis = 0; 
        document.getElementById('dado-resultado').innerText = '-';

        criarGrade(); 
        verificarSala(novoX, novoY);
    }
}

function verificarSala(x, y) {
    let pisouEmAlgumaSala = false;

    for (const [nomeDaSala, limites] of Object.entries(salas)) {
        if (x >= limites.minX && x <= limites.maxX &&
            y >= limites.minY && y <= limites.maxY) {
            
            pisouEmAlgumaSala = true;

            if (salaAtual !== nomeDaSala) {
                salaAtual = nomeDaSala; 
                abrirModalInvestigacao(nomeDaSala);
            }
            
            return; 
        }
    }

    if (!pisouEmAlgumaSala) {
        salaAtual = null; 
    }
}

function abrirModalInvestigacao(nomeDaSala) {
    const modal = document.getElementById('modal-investigacao');
    let conteudoSala = "";

    if (nomeDaSala === "Laboratório Central") {
        conteudoSala = `<p style="color: #555; font-weight: bold; font-size: 1.1em;">Este é o ponto inicial da sua missão. Aqui não há pistas. Siga para outras organelas, detetive!</p>`;
    } else if (casoAtual && casoAtual.pistasNoMapa[nomeDaSala]) {
        const textoDaPista = casoAtual.pistasNoMapa[nomeDaSala]; 
        
        if (!pistasEncontradasNaPartida.includes(`(${nomeDaSala}) ${textoDaPista}`)) {
            pistasEncontradasNaPartida.push(`(${nomeDaSala}) ${textoDaPista}`);
        }

        conteudoSala = `
            <div style="border: 2px dashed #8b0000; padding: 15px; background-color: rgba(255,255,255,0.3);">
                <p style="color: #8b0000; font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">
                    📜 VOCÊ ENCONTROU UMA PISTA!
                </p>
                <p style="font-size: 1.1em; font-style: italic;">
                    "${textoDaPista}"
                </p>
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
// 5. BANCO DE DADOS DO GLOSSÁRIO
// ==========================================
const bancoDeArquivos = {
    suspeitos: [
        { id: 'S-atpMutante', nome: 'ATP Mutante' },
        { id: 'S-celulaOrganizada', nome: 'Célula Organizada' },
        { id: 'S-enzimaCatalizadora', nome: 'Enzima Catalizadora' },
        { id: 'S-mitocondriaZumbi', nome: 'Mitocôndria Zumbi' },
        { id: 'S-mitoEnergetico', nome: 'Mito Energético' },
        { id: 'S-organoideClonado', nome: 'Organoide Clonado' },
        { id: 'S-oxigenioExplosivo', nome: 'Oxigênio Explosivo' },
        { id: 'S-radicalLivreSolto', nome: 'Radical Livre Solto' },
        { id: 'S-radicalRaivoso', nome: 'Radical Raivoso' },
        { id: 'S-rnaMutante', nome: 'RNA Mutante' }
    ],
    locais: [
        { id: 'L-cadeiaTransportadoraDeEletrons', nome: 'Cadeia de Elétrons' },
        { id: 'L-cicloDeKrebs', nome: 'Ciclo de Krebs' },
        { id: 'L-descarboxilacaoDoPiruvato', nome: 'Descarboxilação do Piruvato' },
        { id: 'L-fosforilacaoOxidativa', nome: 'Fosforilação Oxidativa' },
        { id: 'L-glicolise', nome: 'Glicólise' },
        { id: 'L-laboratorioCentral', nome: 'Laboratório Central' },
        { id: 'L-producaoDeAcetil-coa', nome: 'Produção de Acetil-CoA' },
        { id: 'L-reservaDeGlicose', nome: 'Reserva de Glicose' },
        { id: 'L-setorGenetico', nome: 'Setor Genético' },
        { id: 'L-zonaToxica', nome: 'Zona Tóxica' }
    ]
};

function inicializarGlossario() {
    const listaSuspeitos = document.getElementById('lista-suspeitos');
    const listaLocais = document.getElementById('lista-locais');

    bancoDeArquivos.suspeitos.forEach(item => {
        let li = document.createElement('li');
        li.innerText = item.nome;
        li.onclick = () => carregarArquivo(item.id, item.nome, 'Perfil do Suspeito');
        listaSuspeitos.appendChild(li);
    });

    bancoDeArquivos.locais.forEach(item => {
        let li = document.createElement('li');
        li.innerText = item.nome;
        li.onclick = () => carregarArquivo(item.id, item.nome, 'Relatório do Local');
        listaLocais.appendChild(li);
    });
}

function carregarArquivo(id, nome, tipo) {
    document.getElementById('detalhe-titulo').style.display = 'none';
    
    const imgEl = document.getElementById('detalhe-imagem');
    imgEl.src = `assets/img/${id}.png`; 
    imgEl.style.display = 'block';

    document.getElementById('detalhe-descricao').style.display = 'none';
}

const hitboxGlossarioMenu = document.querySelector('.hitbox-glossario');
if (hitboxGlossarioMenu) {
    hitboxGlossarioMenu.addEventListener('click', () => {
        document.getElementById('modal-glossario').style.display = 'flex';
    });
}

inicializarGlossario();

// ==========================================
// 6. SISTEMA DE BLOCO DE ANOTAÇÕES (CHECKLIST)
// ==========================================
const dadosBloco = [
    {
        titulo: "SUSPEITOS",
        itens: [
            "Célula Organizada", "Enzima Congelada", "Oxigênio Explosivo", 
            "ATP Mutante", "Mitocôndria Zumbi", "Mito Energético", 
            "Radical Raivoso", "Organoide Clonado", "Radical Livre Solto", "RNA Mutante"
        ]
    },
    {
        titulo: "LOCAIS",
        itens: [
            "Reserva de glicose", "Glicólise", "Descarboxilação do Piruvato", 
            "Produção de Acetil-CoA", "Ciclo de Krebs", "Cadeia transportadora", 
            "Fosforilação Oxidativa", "Zona Tóxica", "Setor Genético", "Laboratório Central"
        ]
    },
    {
        titulo: "PROBLEMAS",
        itens: [
            "Consome oxigênio sem gerar ATP", "Acúmulo de radicais danificou as enzimas", 
            "ATP defeituoso inutilizável", "Falha na formação de acetil-coa", 
            "Incapacidade de mobilizar energia", "Falta de insumos para funcionar", 
            "Mutação destruiu DNA mitocondrial", "Produção de proteínas defeituosas", 
            "Excesso de oxigênio causou estresse oxidativo", "Desvio do processo por estrutura falsa", 
            "Danos às membranas mitocondriais", "Proteínas mitocondriais defeituosas"
        ]
    }
];

function montarBlocoAnotacoes() {
    const conteinerBloco = document.getElementById('bloco-conteudo');
    
    dadosBloco.forEach(secao => {
        const divSecao = document.createElement('div');
        divSecao.classList.add('secao-bloco');

        const tituloSecao = document.createElement('div');
        tituloSecao.classList.add('secao-titulo');
        tituloSecao.innerText = secao.titulo;

        const divLista = document.createElement('div');
        divLista.classList.add('secao-lista');

        secao.itens.forEach(texto => {
            const linha = document.createElement('div');
            linha.classList.add('linha-item');
            
            const spanTexto = document.createElement('span');
            spanTexto.innerText = texto;

            const bolinhas = document.createElement('div');
            bolinhas.classList.add('container-bolinhas');
            
            const bolinha = document.createElement('div');
            bolinha.classList.add('bolinha-status', 'vazio'); 
            bolinha.dataset.estado = '0'; 

            bolinha.addEventListener('click', function() {
                let proximoEstado = (parseInt(this.dataset.estado) + 1) % 4;
                this.dataset.estado = proximoEstado;

                this.classList.remove('vazio', 'certo', 'errado', 'duvida');

                if (proximoEstado === 0) this.classList.add('vazio');
                else if (proximoEstado === 1) this.classList.add('certo');
                else if (proximoEstado === 2) this.classList.add('errado');
                else if (proximoEstado === 3) this.classList.add('duvida');

                if (proximoEstado === 1 && casoAtual) {
                    setTimeout(() => { verificarVitoriaInstantanea(); }, 100);
                }
            });

            bolinhas.appendChild(bolinha);
            linha.appendChild(spanTexto);
            linha.appendChild(bolinhas);
            
            divLista.appendChild(linha);
        });

        divSecao.appendChild(tituloSecao);
        divSecao.appendChild(divLista);
        conteinerBloco.appendChild(divSecao);
    });
}

montarBlocoAnotacoes();

// ==========================================
// INÍCIO DA PARTIDA E JOGADORES
// ==========================================
let jogadores = [];
let turnoAtual = 0;

function proximoPassoSetup(passo) {
    document.getElementById('setup-passo-1').style.display = 'none';
    document.getElementById('setup-passo-2').style.display = 'block';
}

function configurarJogadores(qtd) {
    const container = document.getElementById('campos-nomes');
    container.innerHTML = '';
    jogadores = [];

    for (let i = 1; i <= qtd; i++) {
        container.innerHTML += `
            <input type="text" id="nome-p${i}" class="input-nome" placeholder="Nome do Detetive ${i}">
        `;
    }
    document.getElementById('btn-iniciar-jogo').style.display = 'inline-block';
}

function iniciarPartidaComp() {
    const inputs = document.querySelectorAll('.input-nome');
    inputs.forEach((input, index) => {
        jogadores.push({
            id: index,
            nome: input.value || `Detetive ${index + 1}`,
            pos: { x: 23, y: 9 }, 
            cor: index === 0 ? '#00ff00' : (index === 1 ? '#0000ff' : '#ff0000'),
            pistasEncontradas: 0
        });
    });

    document.getElementById('tela-setup').style.display = 'none';
    document.getElementById('tela-tabuleiro').classList.add('ativa');
    document.getElementById('dado-flutuante').style.display = 'block'; 
    
    // SORTEIA O CASO DA PARTIDA!
    const indexSorteado = Math.floor(Math.random() * bancoDeCasos.length);
    casoAtual = bancoDeCasos[indexSorteado];
    console.log("🕵️‍♂️ MISTÉRIO SORTEADO (Para você testar):", casoAtual);
    
    pistasEncontradasNaPartida = []; // Zera o diário de pistas da partida
    localStorage.setItem('csi_partida_ativa', JSON.stringify(jogadores));
    
    criarGrade();
}

function salvarNoRanking(vencedor, turnos) {
    let ranking = JSON.parse(localStorage.getItem('csi_ranking')) || [];
    ranking.push({
        nome: vencedor,
        pontuacao: turnos,
        data: new Date().toLocaleDateString()
    });
    ranking.sort((a, b) => a.pontuacao - b.pontuacao);
    localStorage.setItem('csi_ranking', JSON.stringify(ranking.slice(0, 10))); 
}

// ==========================================
// 7. SISTEMA DE DADO D12 E MOVIMENTAÇÃO TÁTICA
// ==========================================
let passosDisponiveis = 0;

document.getElementById('btn-rolar-dado').addEventListener('click', () => {
    if (passosDisponiveis > 0) return; 

    const resultado = Math.floor(Math.random() * 12) + 1; 
    document.getElementById('dado-resultado').innerText = resultado;
    passosDisponiveis = resultado;

    destacarCasasAlcancaveis();
});

function destacarCasasAlcancaveis() {
    const celulas = document.querySelectorAll('.celula');
    
    celulas.forEach(c => {
        const x = parseInt(c.dataset.x);
        const y = parseInt(c.dataset.y);

        const dist = Math.abs(x - jogadorPos.x) + Math.abs(y - jogadorPos.y);

        if (dist > 0 && dist <= passosDisponiveis) {
            let ehSala = false;
            for (const [nomeDaSala, limites] of Object.entries(salas)) {
                if (x >= limites.minX && x <= limites.maxX &&
                    y >= limites.minY && y <= limites.maxY) {
                    ehSala = true;
                    break;
                }
            }

            if (ehSala) {
                c.classList.add('alcancavel-sala'); 
            } else {
                c.classList.add('alcancavel');      
            }
        }
    });
}

const dadoFlutuante = document.getElementById('dado-flutuante');
const dadoHeader = document.getElementById('dado-header');

let isDragging = false;
let dragOffsetX, dragOffsetY;

dadoHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - dadoFlutuante.getBoundingClientRect().left;
    dragOffsetY = e.clientY - dadoFlutuante.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    dadoFlutuante.style.bottom = 'auto'; 
    dadoFlutuante.style.right = 'auto';
    
    dadoFlutuante.style.left = `${e.clientX - dragOffsetX}px`;
    dadoFlutuante.style.top = `${e.clientY - dragOffsetY}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false; 
});

// ==========================================
// 9. AUDITORIA E PISTAS VISUAIS
// ==========================================
function verificarVitoriaInstantanea() {
    const todasLinhas = document.querySelectorAll('.linha-item');
    let marcadosCerto = []; 

    todasLinhas.forEach(linha => {
        const texto = linha.querySelector('span').innerText;
        const bolinha = linha.querySelector('.container-bolinhas .bolinha-status'); 
        if (bolinha && bolinha.dataset.estado == '1') { 
            marcadosCerto.push(texto);
        }
    });

    if (marcadosCerto.length === 3) {
        const acertouSuspeito = marcadosCerto.includes(casoAtual.suspeito);
        const acertouLocal = marcadosCerto.includes(casoAtual.local);
        const acertouProblema = marcadosCerto.includes(casoAtual.problema);

        if (acertouSuspeito && acertouLocal && acertouProblema) {
            alert(`🏆 CASO RESOLVIDO! 🏆\n\nVocê descobriu a verdade, detetive!\n\nCulpado: ${casoAtual.suspeito}\nLocal: ${casoAtual.local}\nProblema: ${casoAtual.problema}`);
        }
    }
}

function atualizarQuadroDePistas() {
    const lista = document.getElementById('lista-pistas-encontradas');
    
    if (!lista) return; 

    lista.innerHTML = ''; 

    if (pistasEncontradasNaPartida.length === 0) {
        lista.innerHTML = '<li class="pista-vazia">Nenhuma pista encontrada ainda... Explore as salas!</li>';
        return;
    }

    pistasEncontradasNaPartida.forEach(pista => {
        const li = document.createElement('li');
        li.innerText = pista;
        lista.appendChild(li);
    });
}