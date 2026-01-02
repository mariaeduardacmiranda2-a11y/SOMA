let estadoRosto = "neutro"; 
let corInterface = [0, 255, 153]; 
let anelOffset = 0;
let scannerY = 0;
let particulas = [];

// CHAVE ATUALIZADA - NÃO TRADUZIR ESTA LINHA
const GEMINI_API_KEY = "AIzaSyA_yisujmeuMqQowZLSRg81k_Ndjgdi5rI"; 

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

  addLog("soma", "S.O.M.A 7.4 ONLINE. Sistemas estáveis.");
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

  if (p.includes("treinar") || p.includes("treinamento") || p.includes("exercício")) {
    iniciarTreino();
    return;
  }
  if (p.includes("parar") || p.includes("encerrar")) {
    pararTreino();
    return;
  }

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
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `Você é o S.O.M.A 7.4, um robô militar. Responda de forma curta e direta: ${pergunta}` }]
      }]
    })
  });

  const data = await response.json();
  if (data.candidates && data.candidates[0].content) {
    return data.candidates[0].content.parts[0].text;
  } else {
    throw new Error("Falha na resposta");
  }
}

function iniciarTreino() {
  corInterface = [255, 30, 30];
  document.getElementById('terminal-container').classList.add('modo-alerta');
  responder("ALERTA: MODO DE TREINO ATIVADO!");
}

function pararTreino() {
  corInterface = [0, 255, 153];
  document.getElementById('terminal-container').classList.remove('modo-alerta');
  responder("Treinamento finalizado. Retornando ao modo estável.");
}

function responder(msg) {
  addLog("soma", msg);
  let utterance = new SpeechSynthesisUtterance(msg);
  utterance.lang = 'pt-BR';
  window.speechSynthesis.speak(utterance);
}

function addLog(tipo, msg) {
  const logDiv = document.getElementById('log-display');
  const p = document.createElement('p');
  p.className = tipo === "user" ? "user-text" : "soma-text";
  p.innerHTML = `<strong>${tipo.toUpperCase()}:</strong> ${msg}`;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
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
  noFill(); stroke(cor[0], cor[1], cor[2], 150);
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

function atualizarParticulas() {
  if (frameCount % 10 === 0) particulas.push({x: random(width), y: height, s: random(2, 5)});
  fill(corInterface[0], corInterface[1], corInterface[2], 100);
  for (let i = particulas.length - 1; i >= 0; i--) {
    ellipse(particulas[i].x, particulas[i].y, particulas[i].s);
    particulas[i].y -= 2;
    if (particulas[i].y < 0) particulas.splice(i, 1);
  }
}