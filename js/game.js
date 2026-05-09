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
// VARIÁVEIS DE CONTROLE DE INVESTIGAÇÃO
// ==========================================
let salaAtual = null; // Guarda a sala onde o jogador está pisando neste exato momento
let ultimaSalaInvestigada = null; // Guarda a última sala que gerou uma progressão no jogo

// Controla em qual pista (nível de investigação) o jogador está em cada sala
let progressoPistas = {
    "Setor Genético": 1,
    "Zona Tóxica": 1,
    "Laboratório Central": 1,
    "Ciclo de Krebs": 1,
    "Zona Oxidativa": 1,
    "Núcleo": 1,
    "COA (Garagem)": 1,
    "Sala de Arquivos": 1,
    "Portão Principal": 1,
    "Setor de Produção": 1
};
// ==========================================
// 2. GERENCIAMENTO DE TELAS (MENU / TABULEIRO)
// ==========================================
const btnJogar = document.getElementById('btn-jogar');
const telaMenu = document.getElementById('tela-menu');
const telaTabuleiro = document.getElementById('tela-tabuleiro');
const btnVoltarMenu = document.getElementById('btn-voltar-menu');

btnJogar.addEventListener('click', function() {
    telaMenu.classList.remove('ativa');
    telaTabuleiro.classList.add('ativa');
    // Força a criar a grade ao entrar no tabuleiro para garantir alinhamento
    criarGrade(); 
});
// ==========================================
// 4. MENU IN-GAME (SISTEMA DE PAUSA)
// ==========================================
const menuInGame = document.getElementById('menu-in-game');
const modalGlossario = document.getElementById('modal-glossario');
const modalSuspeitos = document.getElementById('modal-suspeitos');

// Escuta as teclas digitadas em qualquer lugar do jogo
document.addEventListener('keydown', function(event) {
    // Só permite abrir o menu de pausa se o jogador estiver no tabuleiro
    if (telaTabuleiro.classList.contains('ativa')) {
        
        // Verifica se apertou "M" ou "m"
        if (event.key === 'm' || event.key === 'M') {
            
            // Se o menu já estiver aberto, ele fecha. Se estiver fechado, ele abre.
            if (menuInGame.style.display === 'flex') {
                menuInGame.style.display = 'none';
            } else {
                menuInGame.style.display = 'flex';
                // Garante que os sub-modais fechem para não encavalar
                modalGlossario.style.display = 'none';
                modalSuspeitos.style.display = 'none';
            }
        }
    }
});

// Ações dos botões dentro do Menu In-Game
document.getElementById('btn-in-voltar').addEventListener('click', () => {
    menuInGame.style.display = 'none';       // Esconde o menu
    telaTabuleiro.classList.remove('ativa'); // Esconde o tabuleiro
    telaMenu.classList.add('ativa');         // Volta pro menu inicial
});

document.getElementById('btn-in-glossario').addEventListener('click', () => {
    menuInGame.style.display = 'none';       // Esconde o menu principal
    modalGlossario.style.display = 'flex';   // Abre o Glossário
});

document.getElementById('btn-in-suspeitos').addEventListener('click', () => {
    menuInGame.style.display = 'none';       // Esconde o menu principal
    modalSuspeitos.style.display = 'flex';   // Abre a Lista de Suspeitos
});

// Lógica inteligente para os botões de voltar dos sub-modais
// Lógica inteligente para os botões de fechar dos sub-modais
const botoesFecharSubmodal = document.querySelectorAll('.fechar-submodal');
botoesFecharSubmodal.forEach(botao => {
    botao.addEventListener('click', (e) => {
        // Pega qual modal este botão deve fechar pelo data-target
        const targetId = e.target.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'none';
        
        // Verifica se o jogador está com o tabuleiro aberto
        if (telaTabuleiro.classList.contains('ativa')) {
            // Se estiver no jogo, retorna para o menu de pausa
            menuInGame.style.display = 'flex'; 
        }
        // Se NÃO estiver no tabuleiro (ou seja, abriu pelo menu principal),
        // ele não faz nada. O modal só fecha e a tela de Início já está lá atrás!
    });
});

// ==========================================
// 3. LÓGICA DO TABULEIRO (MOVIMENTO E SALAS)
// ==========================================
function criarGrade() {
    grade.innerHTML = ''; // Limpa a grade anterior
    
    for (let y = 0; y < linhas; y++) {
        for (let x = 0; x < colunas; x++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            celula.dataset.x = x;
            celula.dataset.y = y;
            
            // --- NOVA LÓGICA DE DEBUG DAS SALAS ---
            // Verifica se este x, y pertence a alguma sala
            for (const [nomeDaSala, limites] of Object.entries(salas)) {
                if (x >= limites.minX && x <= limites.maxX &&
                    y >= limites.minY && y <= limites.maxY) {
                    // Se estiver dentro da sala, adiciona a cor vermelha translúcida
                    celula.classList.add('area-sala');
                }
            }
            // --------------------------------------
            
            // Desenha o jogador na posição atual
            if (x === jogadorPos.x && y === jogadorPos.y) {
                celula.classList.add('jogador');
            }

            // Adiciona o clique para mover
            celula.addEventListener('click', () => moverJogador(x, y));
            grade.appendChild(celula);
        }
    }
}

function moverJogador(novoX, novoY) {
    // Math.abs calcula a diferença absoluta (sempre positivo)
    // Se a soma da diferença X e Y for 1, significa que moveu só 1 casa (cima, baixo, lado)
    const dist = Math.abs(novoX - jogadorPos.x) + Math.abs(novoY - jogadorPos.y);
    
    // Apenas permite andar 1 quadrado por vez (para proibir andar na diagonal, coloque "dist === 1")
    // Se quiser que o jogador ande solto para testar mais rápido, troque por "dist > 0"
    if (dist === 1) { 
        jogadorPos = { x: novoX, y: novoY };
        criarGrade(); // Redesenha a grade com o jogador na nova posição
        verificarSala(novoX, novoY);
    }
}

function verificarSala(x, y) {
    let pisouEmAlgumaSala = false;

    for (const [nomeDaSala, limites] of Object.entries(salas)) {
        if (x >= limites.minX && x <= limites.maxX &&
            y >= limites.minY && y <= limites.maxY) {
            
            pisouEmAlgumaSala = true;

            // 1. O jogador ACABOU de entrar na sala (não estava nela no passo anterior)
            if (salaAtual !== nomeDaSala) {
                salaAtual = nomeDaSala; // Atualiza a memória dizendo que ele entrou

                // 2. Regra Anti-Farming: Ele veio de OUTRA sala?
                // Se a última sala investigada for diferente desta, e não for o início do jogo (null)...
                if (ultimaSalaInvestigada !== nomeDaSala && ultimaSalaInvestigada !== null) {
                    // ...então ele explorou outro lugar e voltou! A pista dessa sala avança.
                    progressoPistas[nomeDaSala] += 1;
                }
                
                // Salva esta sala como a última que ele bisbilhotou
                ultimaSalaInvestigada = nomeDaSala;

                // Abre o modal passando o nome e o número da pista atual
                abrirModalInvestigacao(nomeDaSala, progressoPistas[nomeDaSala]);
            }
            
            return; // Já achou a sala, não precisa verificar o resto
        }
    }

    // 3. Se testou todas as salas e pisouEmAlgumaSala ainda for false, ele está no corredor
    if (!pisouEmAlgumaSala) {
        salaAtual = null; // Limpa a memória de sala, pois ele está no chão xadrez
    }
}

function abrirModalInvestigacao(nomeDaSala, numeroPista) {
    const modal = document.getElementById('modal-investigacao');
    
    modal.innerHTML = `
        <div class="conteudo-modal">
            <h2>🕵️‍♂️ Investigação Iniciada!</h2>
            <p style="margin-bottom: 10px;">Você entrou no(a): <strong>${nomeDaSala}</strong></p>
            
            <p style="margin-bottom: 30px; color: #ffeb3b; font-size: 1.2em;">
                📜 Revelando Pista #${numeroPista}
            </p>
            
            <p>Aqui você colocará a imagem da pista, texto ou desafio no futuro.</p>
            
            <button id="fechar-modal" style="padding: 10px 20px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 5px;">Continuar Explorando</button>
        </div>
    `;
    
    modal.style.display = 'flex';

    document.getElementById('fechar-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
}
// ==========================================
// 5. BANCO DE DADOS DO GLOSSÁRIO
// ==========================================

// Lista exata baseada nos nomes dos seus arquivos .png
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

// Função que constrói as listas no índice
function inicializarGlossario() {
    const listaSuspeitos = document.getElementById('lista-suspeitos');
    const listaLocais = document.getElementById('lista-locais');

    // Monta a lista de Suspeitos
    bancoDeArquivos.suspeitos.forEach(item => {
        let li = document.createElement('li');
        li.innerText = item.nome;
        // Ao clicar, muda a página direita
        li.onclick = () => carregarArquivo(item.id, item.nome, 'Perfil do Suspeito');
        listaSuspeitos.appendChild(li);
    });

    // Monta a lista de Locais
    bancoDeArquivos.locais.forEach(item => {
        let li = document.createElement('li');
        li.innerText = item.nome;
        // Ao clicar, muda a página direita
        li.onclick = () => carregarArquivo(item.id, item.nome, 'Relatório do Local');
        listaLocais.appendChild(li);
    });
}

// Função que injeta a imagem na página da direita
function carregarArquivo(id, nome, tipo) {
    // Esconde o título de texto, já que a imagem tem o nome
    document.getElementById('detalhe-titulo').style.display = 'none';
    
    const imgEl = document.getElementById('detalhe-imagem');
    // Puxa dinamicamente a imagem usando o ID (nome do arquivo)
    imgEl.src = `assets/img/${id}.png`; 
    imgEl.style.display = 'block';

    // Esconde a descrição de texto embaixo da imagem
    document.getElementById('detalhe-descricao').style.display = 'none';
}

// Adiciona o clique na Hitbox do Glossário (Menu Principal)
const hitboxGlossarioMenu = document.querySelector('.hitbox-glossario');
if (hitboxGlossarioMenu) {
    hitboxGlossarioMenu.addEventListener('click', () => {
        document.getElementById('modal-glossario').style.display = 'flex';
    });
}

// Roda a montagem do índice assim que o jogo abre
inicializarGlossario();

// ==========================================
// 6. SISTEMA DE BLOCO DE ANOTAÇÕES (CHECKLIST)
// ==========================================

// Todos os textos extraídos exatamente da sua imagem
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

            // Container para alinhar a bolinha na direita
            const bolinhas = document.createElement('div');
            bolinhas.classList.add('container-bolinhas');
            
            // Cria a bolinha interativa
            const bolinha = document.createElement('div');
            bolinha.classList.add('bolinha-status', 'vazio'); // Começa vazia
            bolinha.dataset.estado = '0'; // 0=Vazio, 1=V, 2=X, 3=?

            //quando clica na bolinha
            bolinha.addEventListener('click', function() {
                // Lê o estado atual e soma 1. O "% 4" faz ele voltar pro 0 depois do 3!
                let proximoEstado = (parseInt(this.dataset.estado) + 1) % 4;
                this.dataset.estado = proximoEstado;

                // Limpa todas as cores
                this.classList.remove('vazio', 'certo', 'errado', 'duvida');

                // Aplica a nova cor e símbolo
                if (proximoEstado === 0) this.classList.add('vazio');
                else if (proximoEstado === 1) this.classList.add('certo');
                else if (proximoEstado === 2) this.classList.add('errado');
                else if (proximoEstado === 3) this.classList.add('duvida');
            });

            // Adiciona a bolinha na linha, e a linha na lista
            bolinhas.appendChild(bolinha);
            linha.appendChild(spanTexto);
            linha.appendChild(bolinhas);
            
            divLista.appendChild(linha);
        });

        // Junta tudo
        divSecao.appendChild(tituloSecao);
        divSecao.appendChild(divLista);
        conteinerBloco.appendChild(divSecao);
    });
}

// Inicia a montagem assim que o jogo carrega
montarBlocoAnotacoes();