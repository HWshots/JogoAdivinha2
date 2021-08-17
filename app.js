const welcome = document.querySelector('.welcome');
const levelSelect = document.querySelector('.welcome select');
const instructions = document.querySelector('.welcome p');

const game = document.querySelector('.game');
const gameTitle = document.querySelector('.game h2');
const gameTitleDef = gameTitle.textContent;
const gameInput = document.querySelector('.game input');
const resultImgBig = document.querySelector('.result-img');
const resultList = document.querySelector('.result ul');

const gameOver = document.querySelector('.game-over');
const gameOverNum = document.querySelector('.game-over .number');
const gameOverImg = document.querySelector('.game-over img');
const gameOverText = document.querySelector('.game-over .score');
const gameOverMsg = document.querySelector('.game-over p');

const gameSettings = document.querySelector('.game-settings');

let levelSettings = {
    maxAttempts: 15,
    minValue: 1,
    maxValue: 100,
    maxTime: 120
};
let randomGeneratedNumber;
let moves;
let notValid;
let settingsObj = {
    noValue: true,
    outRangeValue: true,
    keyboard: true
};

function startGame() {
    welcome.style.display = "none";
    game.style.display = "flex";
    randomGeneratedNumber = Math.floor(Math.random() * (levelSettings.maxValue - levelSettings.minValue + 1) + levelSettings.minValue);
    moves = [];
    console.log("Numero do jogo: " + randomGeneratedNumber);
    console.log("NoValue: " + settingsObj.noValue + "\n" + "OutRangeValue: " + settingsObj.outRangeValue + "\n" + "Keyboard: " + settingsObj.keyboard);
}

function makeMove() {
    if (gameInput.value != "" && !settingsObj.noValue || settingsObj.noValue) {
        const move = parseInt(gameInput.value);
        if (move >= levelSettings.minValue && move <= levelSettings.maxValue && !moves.includes(move)) {
            moves.push(move);
            notValid = false;
            console.log("Tentativa: " + move);
        } else {
            moves.push(move);
            notValid = true;
            console.log("Numero invalido!!!");
        }
        const win = moves.length < levelSettings.maxAttempts;
        if (win) {
            if (validateMove(move)) {
                endGame(win);
            }
        } else {
            console.log("Tentativas esgotadas!!!");
            endGame(win);
        }
        gameInput.value = "";
    }
    else {
        console.log("Não foi inserido nenhum numero!!!");
    }
}

function validateMove(move) {
    let li = document.createElement('li');
    let image = document.createElement('img');
    if (notValid) {
        li.textContent = "Jogada inválida!";
        image.src = "images/cross.png";
        resultImgBig.src = "images/cross.png";
        resultList.appendChild(li);
        li.appendChild(image);
        return false;
    } else if (move > randomGeneratedNumber) {
        li.textContent = move;
        image.src = "images/down.png";
        resultImgBig.src = "images/down.png";
        resultList.appendChild(li);
        li.appendChild(image);
        return false;
    } else if (move < randomGeneratedNumber) {
        li.textContent = move;
        image.src = "images/up.png";
        resultImgBig.src = "images/up.png";
        resultList.appendChild(li);
        li.appendChild(image);
        return false;
    }
    return true;
}

function endGame(win) {
    game.style.display = "none";
    gameOver.style.display = "flex";
    let message;
    if (win) {
        gameOverNum.textContent = "!!! " + randomGeneratedNumber + " !!!";
        gameOverImg.src = "images/happy.png";
        message = `Parabéns!!! Ganhou em ${moves.length} tentativas.`;
    } else {
        gameOverNum.textContent = "";
        gameOverImg.src = "images/sad.png";
        message = `Perdeu!!! O número gerado era o  ${randomGeneratedNumber}.`;
    }

    for (var i = 0; i < moves.length; i++) {

        if (isNaN(moves[i])) {
            moves[i] = "Inválido!";
        }
    }
    gameOverMsg.textContent = `Tentativas utilizadas foram: ${moves.join(', ')}.`;
    gameOverText.textContent = message;
    clearInterval(timer);
    const gameOverBtn = document.querySelector('.game-over button');
    gameOverBtn.addEventListener('click', reset);
}

function reset() {
    welcome.style.display = "flex";
    levelSelect.options.selectedIndex = 0;
    gameTitle.textContent = gameTitleDef;
    const spanGamereset = document.querySelector('.game span');
    spanGamereset.remove();
    resultImgBig.src = "images/question-mark.png";
    resultList.innerHTML = '';
    gameOverNum.textContent = "";
    gameOverText.textContent = "";
    gameOverMsg.textContent = "";
    console.log("---------------------");
    init();
}

function play() {
    const level = levelSelect.options.selectedIndex;
    switch (level) {
        case 0:
            levelSettings.maxAttempts = 15;
            levelSettings.maxTime = 120;
            break;
        case 1:
            levelSettings.maxAttempts = 10;
            levelSettings.maxTime = 60;
            break;
        case 2:
            levelSettings.maxAttempts = 5;
            levelSettings.maxTime = 30;
            break;
    }
    console.log("Nivel do jogo: " + (level + 1));
    console.log("Tentativas do jogo: " + levelSettings.maxAttempts);
    console.log("Intervalo do jogo: " + levelSettings.minValue + " a " + levelSettings.maxValue);
    console.log("Tempo do jogo: " + levelSettings.maxTime + "s");
    const spanGame = document.createElement('span');
    spanGame.textContent = "Intervalo do Jogo: " + levelSettings.minValue + " a " + levelSettings.maxValue;
    const labelGame = document.querySelector('.game label');
    game.insertBefore(spanGame, labelGame);
    startGame();
    const playBtn = document.querySelector('.game button');
    playBtn.addEventListener('click', makeMove);
    if (settingsObj.keyboard) {
        gameInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                playBtn.click();
            }
        });
    }
    let maxTimer = levelSettings.maxTime;
    timer = setInterval(function () {
        let currentTime = --maxTimer;
        let showSeconds = currentTime % 60 < 10 ? '0' + currentTime % 60 : currentTime % 60;
        let showMinutes = Math.floor(currentTime / 60);
        gameTitle.textContent = "Tentativas = " + moves.length + " / " + levelSettings.maxAttempts + " & Tempo = " + showMinutes + ":" + showSeconds;
        if (currentTime <= 0) {
            console.log("Tempo acabou!!!");
            clearInterval(timer);
            endGame();
        }
    }, 1000);

}

function settings() {
    welcome.style.display = "none";
    game.style.display = "none";
    gameOver.style.display = "none";
    gameSettings.style.display = "flex";
    const noValueInput = document.querySelector('#noValue');
    const outRangeValueInput = document.querySelector('#outRangeValue');
    const keyboardInput = document.querySelector('#keyboard');
    const minValueInput = document.querySelector('#minValue');
    const maxValueInput = document.querySelector('#maxValue');
    noValueInput.checked = settingsObj.noValue;
    outRangeValueInput.checked = settingsObj.outRangeValue;
    keyboardInput.checked = settingsObj.keyboard;
    minValueInput.value = levelSettings.minValue;
    maxValueInput.value = levelSettings.maxValue;
    noValueInput.addEventListener('change', function () {
        settingsObj.noValue = noValueInput.checked;
    })
    outRangeValueInput.addEventListener('change', function () {
        settingsObj.outRangeValue = outRangeValueInput.checked;
    })
    keyboardInput.addEventListener('change', function () {
        settingsObj.keyboard = keyboardInput.checked;
    })
    minValueInput.addEventListener('change', function () {
        levelSettings.minValue = parseInt(minValueInput.value);
    })
    maxValueInput.addEventListener('change', function () {
        levelSettings.maxValue = parseInt(maxValueInput.value);
    })
    const gameSettingsBtn = document.querySelector('.game-settings button');
    gameSettingsBtn.addEventListener('click', init);
}

function init() {
    welcome.style.display = "flex";
    game.style.display = "none";
    gameOver.style.display = "none";
    gameSettings.style.display = "none";
    instructions.innerHTML = "";
    const span1 = document.createElement('span');
    span1.textContent = "Tenta adivinhar um número entre " + levelSettings.minValue + " e " + levelSettings.maxValue;
    instructions.appendChild(span1);
    const br = document.createElement('br');
    instructions.appendChild(br);
    const span2 = document.createElement('span');
    span2.textContent = "Seleciona o nivel para jogar.";
    instructions.appendChild(span2);
    // instructions.textContent = instructions.textContent +  "Seleciona o nivel para jogar.";
    const newGameBtn = document.querySelector('#newGame');
    newGameBtn.addEventListener('click', play);
    const gameSettingsBtn = document.querySelector('#gameSettings');
    gameSettingsBtn.addEventListener('click', settings);
}

init();

const exit = document.querySelector("#exit");
exit.addEventListener("click", function(){
    if (confirm('Quer mesmo sair?')) {
        location.href='/';
    } else {
        return false;
    }
});