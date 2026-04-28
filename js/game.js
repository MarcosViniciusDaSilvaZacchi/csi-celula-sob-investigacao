// Pega os elementos do HTML
const btnJogar = document.getElementById('btn-jogar');
const telaMenu = document.getElementById('tela-menu');
const telaTabuleiro = document.getElementById('tela-tabuleiro');

// Adiciona a ação de clique no botão "JOGAR"
btnJogar.addEventListener('click', function() {
    telaMenu.classList.remove('ativa');
    telaTabuleiro.classList.add('ativa');
});
// Pega o botão de voltar
const btnVoltarMenu = document.getElementById('btn-voltar-menu');

// Ação de voltar para o menu
btnVoltarMenu.addEventListener('click', function() {
    telaTabuleiro.classList.remove('ativa');
    telaMenu.classList.add('ativa');
});
const grade = document.getElementById('grade-tabuleiro');
const colunas = 47;
const linhas = 20;

let jogadorPos = { x: 5, y: 5 }; // Posição inicial de exemplo

function criarGrade() {
    grade.innerHTML = ''; // Limpa a grade anterior
    
    for (let y = 0; y < linhas; y++) {
        for (let x = 0; x < colunas; x++) {
            const celula = document.createElement('div');
            celula.classList.add('celula');
            celula.dataset.x = x;
            celula.dataset.y = y;
            
            // Verifica se é a posição do jogador
            if (x === jogadorPos.x && y === jogadorPos.y) {
                celula.classList.add('jogador');
            }

            celula.addEventListener('click', () => moverJogador(x, y));
            grade.appendChild(celula);
        }
    }
}

function moverJogador(novoX, novoY) {
    // Cálculo de distância para permitir apenas 1 casa por vez (opcional)
    const dist = Math.abs(novoX - jogadorPos.x) + Math.abs(novoY - jogadorPos.y);
    
    if (dist === 1) {
        jogadorPos = { x: novoX, y: novoY };
        criarGrade(); // Redesenha a grade com o jogador na nova posição
        verificarSala(novoX, novoY);
    }
}

function verificarSala(x, y) {
    // Aqui nós vamos mapear as salas reais.
    // Exemplo: Se o Setor Genético estiver entre a coluna 0 e 4, e linha 0 e 3:
    if (x >= 0 && x <= 4 && y >= 0 && y <= 3) {
        abrirModalInvestigacao('Setor Genético');
    }
    
    // Deixando preparado para a próxima sala (ex: Zona Tóxica lá no canto direito)
    // else if (x >= 40 && x <= 46 && y >= 0 && y <= 5) {
    //     abrirModalInvestigacao('Zona Tóxica');
    // }
}

function abrirModalInvestigacao(nomeDaSala) {
    const modal = document.getElementById('modal-investigacao');
    
    // Injeta o HTML da pista dentro do modal
    modal.innerHTML = `
        <div class="conteudo-modal">
            <h2>🕵️‍♂️ Investigação Iniciada!</h2>
            <p style="margin-bottom: 30px;">Você entrou no(a): <strong>${nomeDaSala}</strong></p>
            <p>Aqui você colocará a imagem da pista, texto ou desafio no futuro.</p>
            
            <button id="fechar-modal" style="padding: 10px 20px; cursor: pointer;">Voltar ao Tabuleiro</button>
        </div>
    `;
    
    // Muda o display para Flex (mostra o modal na tela)
    modal.style.display = 'flex';

    // Adiciona a ação de fechar no botão que acabamos de criar
    document.getElementById('fechar-modal').addEventListener('click', () => {
        modal.style.display = 'none'; // Esconde o modal novamente
    });
}

// Inicia a grade
criarGrade();