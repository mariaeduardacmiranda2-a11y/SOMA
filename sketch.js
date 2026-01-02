// ================== S.O.M.A 7.4 - SISTEMA DE INTELIGÊNCIA E TREINO ==================

let estadoRosto = "neutro"; 
let modoTreino = false;
let corInterface = [0, 255, 153]; // Verde padrão
let anelOffset = 0;
let scannerY = 0;
let particulas = [];

// CHAVE DE API - Verificada na sua imagem do Google AI Studio
const GEMINI_API_KEY = "AIzaSyA6uUujOhNJycaIoYMK93aOTUdXfkf-9f8"; 

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('ui-container');
  
  const inputElt = select('#user-input');
  inputElt.elt.addEventListener('keydown', e => {
    if (e.key === 'Enter' && inputElt.value().trim() !== '') {
      interpretar(inputElt.value());
      inputElt.value('');
    }
  });

  boot();
}

function draw() {
  clear(); 
  drawTechBackground();
  drawRostoFuturista(width/2, height/2 - 50, 220, corInterface);
  atualizarParticulas();
  anelOffset += (estadoRosto === "pensando") ? 0.15 : 0.02;
}

async function interpretar(txt) {
  addLog("user", txt);
  let p = txt.toLowerCase().trim();

  // COMANDOS DE TREINAMENTO (Sua solicitação de tela vermelha)
  if (p.includes("treinar") || p.includes("treinamento") || p.includes("exercício")) {
    iniciarTreino();
    return;
  }
  if (p.includes("parar") || p.includes("encerrar")) {
    pararTreino();
    return;
  }

  // CONSULTA À IA (Ajustada para corrigir o erro de Uplink)
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

async function consultarIA(pergunta) {
  // CORREÇÃO DA LINHA 109: Agora enviando a chave corretamente
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `Você é o S.O.M.A 7.4, um robô militar. Responda curto: ${pergunta}` }]
      }]
    })
  });

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

function iniciarTreino() {
  modoTreino = true;
  corInterface = [255, 30, 30]; // MUDA PARA VERMELHO
  estadoRosto = "alerta";
  
  const exercicios = ["Flexões", "Abdominais", "Polichinelos"];
  const exercicioSorteado = random(exercicios);
  const quantidade = floor(random(10, 30)); 

  responder(`ALERTA: MODO DE TREINO ATIVADO! Faça ${quantidade} ${exercicioSorteado}!`);
}

function pararTreino() {
  modoTreino = false;
  corInterface = [0, 255, 153]; // VOLTA PARA VERDE
  estadoRosto = "neutro";
  responder("Treinamento finalizado. Retornando ao modo estável.");
}

function responder(msg) {
  addLog("soma", msg);
  falar(msg);
}

function addLog(tipo, msg) {
  const logDiv = document.getElementById('log-display');
  const p = document.createElement('p');
  p.className = tipo === "user" ? "user-text" : "soma-text";
  p.innerHTML = `<strong>${tipo.toUpperCase()}:</strong> ${msg}`;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

function falar(txt) {
  let utterance = new SpeechSynthesisUtterance(txt);
  utterance.lang = 'pt-BR';
  window.speechSynthesis.speak(utterance);
}

function drawTechBackground() {
  stroke(corInterface[0], corInterface[1], corInterface[2], 30);
  for(let i=0; i<width; i+=50) line(i,0,i,height);
  scannerY = (scannerY + 2) % height;
  stroke(corInterface[0], corInterface[1], corInterface[2], 80);
  line(0, scannerY, width, scannerY);
}

function drawRostoFuturista(x, y, d, cor) {
  push();
  translate(x, y);
  noFill();
  stroke(cor[0], cor[1], cor[2], 150);
  ellipse(0, 0, d);
  rotate(anelOffset);
  arc(0, 0, d+20, d+20, 0, PI/2);
  rotate(-anelOffset); 
  fill(cor[0], cor[1], cor[2]);
  let blink = sin(frameCount * 0.1) > 0.9 ? 2 : 15;
  ellipse(-40, 0, 30, blink);
  ellipse(40, 0, 30, blink);
  pop();
}

function boot() {
  addLog("soma", "S.O.M.A 7.4 ONLINE. Aguardando comandos.");
}

function atualizarParticulas() {
  if (frameCount % 10 === 0) particulas.push({x: random(width), y: height, s: random(2, 5)});
  fill(corInterface[0], corInterface[1], corInterface[2], 100);
  for (let i = particulas.length - 1; i >= 0; i--) {
    ellipse(particulas[i].x, particulas[i].y, particulas[i].s);
    particulas[i].y -= 2;
    if (particulas[i].y < 0) particulas.splice(i, 1);
  }
}