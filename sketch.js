// ================== S.O.M.A 7.4 - SISTEMA DE INTELIGÊNCIA E TREINO ==================

// Configurações de Estado e Interface
let nivel = 0;
let rank = "Novato";
let estadoRosto = "neutro"; // neutro, pensando, alerta
let modoTreino = false;
let corInterface = [0, 255, 153]; // Verde padrão (RGB)
let anelOffset = 0;
let scannerY = 0;
let particulas = [];

// CHAVE DE API - Insira aqui a chave que copiou do Google AI Studio
const GEMINI_API_KEY = "AIzaSyA6uUujOhNJycaIoYMK93aOTUdXfkf-9f8"; 

// -------------------- Setup Inicial --------------------
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('ui-container');
  
  // Conectar campo de input do HTML
  const inputElt = select('#user-input');
  inputElt.elt.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inputElt.value().trim() !== '') {
      interpretar(inputElt.value());
      inputElt.value('');
    }
  });

  boot();
}

// -------------------- Ciclo de Desenho (Draw) --------------------
function draw() {
  clear(); 
  drawTechBackground();
  
  // Centraliza o robô e passa a cor atual (verde ou vermelha)
  drawRostoFuturista(width/2, height/2 - 50, 220, corInterface);
  
  atualizarParticulas();
  
  // Velocidade de rotação aumenta quando o robô está "pensando"
  anelOffset += (estadoRosto === "pensando") ? 0.15 : 0.02;
}

// -------------------- Lógica de Comandos --------------------
async function interpretar(txt) {
  addLog("user", txt);
  let p = txt.toLowerCase().trim();

  // 1. Gerenciamento de Treinamento
  if (p.includes("treinar") || p.includes("treinamento") || p.includes("exercício")) {
    iniciarTreino();
    return;
  }
  if (p.includes("parar") || p.includes("encerrar") || p.includes("descansar")) {
    pararTreino();
    return;
  }

  // 2. Comandos Rápidos Locais
  if (p.includes("hora")) {
    responder("Agora são " + hour() + ":" + minute());
    return;
  }

  // 3. Consulta à Inteligência Artificial (Google Gemini)
  estadoRosto = "pensando";
  addLog("soma", "Acessando base de dados central...");
  
  try {
    const respostaIA = await consultarIA(txt);
    responder(respostaIA);
  } catch (erro) {
    addLog("soma", "Erro: Uplink com satélite falhou.");
  }
  
  estadoRosto = "neutro";
}

// -------------------- Funções de Ação --------------------
function iniciarTreino() {
  modoTreino = true;
  corInterface = [255, 30, 30]; // Muda interface para Vermelho Alerta
  estadoRosto = "alerta";
  
  const exercicios = ["Flexões", "Abdominais", "Polichinelos", "Agachamentos"];
  const exercicioSorteado = random(exercicios);
  const quantidade = floor(random(10, 31)); 

  let mensagem = `MODO DE TREINO ATIVADO! Execute ${quantidade} ${exercicioSorteado} imediatamente!`;
  responder(mensagem);
}

function pararTreino() {
  modoTreino = false;
  corInterface = [0, 255, 153]; // Retorna ao Verde estável
  estadoRosto = "neutro";
  responder("Treinamento finalizado. Retornando ao modo de observação.");
}

function responder(msg) {
  addLog("soma", msg);
  falar(msg);
}

async function consultarIA(pergunta) {
  // Corrija a linha 109 para incluir a variável da chave no final
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
}