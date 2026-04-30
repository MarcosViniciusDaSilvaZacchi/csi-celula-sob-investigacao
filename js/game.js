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

btnVoltarMenu.addEventListener('click', function() {
    telaTabuleiro.classList.remove('ativa');
    telaMenu.classList.add('ativa');
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

function abrirModalInvestigacao(nomeDaSala) {
    const modal = document.getElementById('modal-investigacao');
    
    modal.innerHTML = `
        <div class="conteudo-modal">
                <h2>🕵️‍♂️ Investigação Iniciada!</h2>
                <p style="margin-bottom: 10px;">Você entrou no(a): <strong>${nomeDaSala}</strong></p>
            
                <!-- Essa linha nova mostra o progresso do jogador na sala -->
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