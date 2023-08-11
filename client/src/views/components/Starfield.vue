<template>
  <div id="starfield" class="absolute inset-0">
    <canvas id="starfield-canvas"></canvas>
  </div>
</template>

<script>
const COUNT = 550;
const SPEED = 0.1;

class Star {
  constructor(x = 0, y = 0, z = 0, color = "#ffffff") {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xPrev = x;
    this.yPrev = y;
    this.color = color;
  }

  update(width, height, speed) {
    this.xPrev = this.x;
    this.yPrev = this.y;
    this.z += speed * 0.0675;
    this.x += this.x * (speed * 0.0225) * this.z;
    this.y += this.y * (speed * 0.0225) * this.z;

    if (
      this.x > width / 2 ||
      this.x < -width / 2 ||
      this.y > height / 2 ||
      this.y < -height / 2
    ) {
      this.x = Math.random() * width - width / 2;
      this.y = Math.random() * height - height / 2;
      this.xPrev = this.x;
      this.yPrev = this.y;
      this.z = 0;
    }
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.z;

    // Draw circle
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.z, 0, Math.PI * 2);
    // ctx.stroke();

    // Uncomment below to still draw line
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.xPrev, this.yPrev);

    ctx.stroke();
  }
}

export default {
  props: {
    lightSpeed: Boolean
  },
  data() {
    return {
      stars: [],
      rafId: 0,
      canvas: null,
      ctx: null,
      container: null,
      // create array of starColors, include, white, yellow, orange, blue, red, green
      starColors: [
        "lightskyblue",
        "white",
        "white",
        "lightgoldenrodyellow",
        "burgundy",
        "orange"
      ]
    };
  },

  mounted() {
    this.canvas = document.getElementById("starfield-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.container = document.getElementById("starfield");

    const resizeObserver = new ResizeObserver(this.setup);
    resizeObserver.observe(this.container);

    this.setup();
  },

  beforeDestroy() {
    cancelAnimationFrame(this.rafId);
  },

  methods: {
    setup() {
      cancelAnimationFrame(this.rafId);
      const { clientWidth: width, clientHeight: height } = this.container;
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
      this.ctx.scale(dpr, dpr);
      this.stars = Array.from({ length: COUNT }, () => new Star());
      for (const star of this.stars) {
        // randomly choose star color
        // eslint-disable-next-line standard/computed-property-even-spacing
        star.color = this.starColors[
          Math.floor(Math.random() * this.starColors.length)
        ];
        star.x = Math.random() * width - width / 2;
        star.y = Math.random() * height - height / 2;
        star.z = 0;
      }
      this.ctx.translate(width / 2, height / 2);
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      // randomly choose star color

      this.rafId = requestAnimationFrame(this.frame);
    },

    frame() {
      const { clientWidth: width, clientHeight: height } = this.container;

      for (const star of this.stars) {
        star.update(width, height, this.lightSpeed ? SPEED * 2 : SPEED);
        star.draw(this.ctx);
      }

      this.ctx.fillRect(-width / 2, -height / 2, width, height);

      this.rafId = requestAnimationFrame(this.frame);
    }
  }
};
</script>
<style scoped>
#starfield {
  height: 100vh;
  position: absolute;
  top: 0;
  inset: 0;
  z-index: -1;
}
</style>
