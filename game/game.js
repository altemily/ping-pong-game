const canvasEl = document.querySelector("canvas"),
  contextoCanvas = canvasEl.getContext("2d"),
  margemX = 10;

const teclas = { ArrowUp: false, ArrowDown: false };

const campo = {
  largura: window.innerWidth,
  altura: window.innerHeight,
  desenhar() {
    contextoCanvas.fillStyle = "#ffa500";
    contextoCanvas.fillRect(0, 0, this.largura, this.altura);
  },
};

const linhaCentral = {
  largura: 15,
  altura: () => campo.altura,
  desenhar() {
    contextoCanvas.fillStyle = "#ffffff";
    contextoCanvas.fillRect(
      campo.largura / 2 - this.largura / 2,
      0,
      this.largura,
      this.altura()
    );
  },
};

const placar = {
  humano: 0,
  computador: 0,
  desenhar() {
    contextoCanvas.font = "bold 72px Arial";
    contextoCanvas.textAlign = "center";
    contextoCanvas.textBaseline = "top";
    contextoCanvas.fillStyle = "#000";
    contextoCanvas.fillText(this.humano, campo.largura / 4, 50);
    contextoCanvas.fillText(this.computador, (campo.largura * 3) / 4, 50);
  },
};

const raqueteEsquerda = {
  x: margemX,
  y: campo.altura / 2 - 100,
  largura: linhaCentral.largura,
  altura: 200,
  velocidade: 8,
  mover() {
    if (teclas.ArrowUp && this.y > 0) {
      this.y -= this.velocidade;
    }
    if (teclas.ArrowDown && this.y < campo.altura - this.altura) {
      this.y += this.velocidade;
    }
  },
  desenhar() {
    contextoCanvas.fillStyle = "#ffffff";
    contextoCanvas.fillRect(this.x, this.y, this.largura, this.altura);
    this.mover();
  },
};

const raqueteDireita = {
  x: campo.largura - linhaCentral.largura - margemX,
  y: campo.altura / 2 - 100,
  largura: linhaCentral.largura,
  altura: 200,
  velocidade: 4,
  mover() {
    if (this.y + this.altura / 2 < bola.y) {
      this.y += this.velocidade;
    } else {
      this.y -= this.velocidade;
    }
    this.y = Math.max(0, Math.min(this.y, campo.altura - this.altura));
  },
  desenhar() {
    contextoCanvas.fillStyle = "#ffffff";
    contextoCanvas.fillRect(this.x, this.y, this.largura, this.altura);
    this.mover();
  },
};

const bola = {
  x: campo.largura / 2,
  y: campo.altura / 2,
  raio: 30, // Ajuste o raio para o tamanho desejado da bola
  velocidade: 5,
  direcaoX: 1,
  direcaoY: 1,

  // Função para calcular a posição e verificar colisões
  calcularPosicao() {
    if (this.x > campo.largura - this.raio - raqueteDireita.largura - margemX) {
      if (
        this.y > raqueteDireita.y &&
        this.y < raqueteDireita.y + raqueteDireita.altura
      ) {
        this.direcaoX *= -1; // Rebater
      } else {
        placar.humano++;
        this.reiniciar();
      }
    }

    if (this.x < this.raio + raqueteEsquerda.largura + margemX) {
      if (
        this.y > raqueteEsquerda.y &&
        this.y < raqueteEsquerda.y + raqueteEsquerda.altura
      ) {
        this.direcaoX *= -1; // Rebater
      } else {
        placar.computador++;
        this.reiniciar();
      }
    }

    if (this.y - this.raio < 0 || this.y + this.raio > campo.altura) {
      this.direcaoY *= -1; // Mudar direção vertical
    }
  },

  // Função para reiniciar a bola no centro
  reiniciar() {
    this.x = campo.largura / 2;
    this.y = campo.altura / 2;
    this.direcaoX *= -1; // Alternar direção
  },

  // Função para mover a bola
  mover() {
    this.x += this.direcaoX * this.velocidade;
    this.y += this.direcaoY * this.velocidade;
  },

  // Função para desenhar a bola (círculo)
  desenhar() {
    contextoCanvas.fillStyle = "#ffffff";
    contextoCanvas.beginPath();
    contextoCanvas.arc(this.x, this.y, this.raio, 0, Math.PI * 2, false);
    contextoCanvas.fill();
    this.calcularPosicao();
    this.mover();
  },
};

function configurar() {
  canvasEl.width = campo.largura = window.innerWidth;
  canvasEl.height = campo.altura = window.innerHeight;
}

function desenhar() {
  campo.desenhar();
  linhaCentral.desenhar();
  placar.desenhar();
  raqueteEsquerda.desenhar();
  raqueteDireita.desenhar();
  bola.desenhar();
}

function principal() {
  window.requestAnimationFrame(principal);
  desenhar();
}

configurar();
principal();

window.addEventListener("resize", configurar);

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    teclas[e.key] = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    teclas[e.key] = false;
  }
});
