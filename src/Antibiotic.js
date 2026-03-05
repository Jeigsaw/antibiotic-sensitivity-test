const color = {
  A: {
    fill: "#f2d388",
    stroke: "#b8860b"
  },
  B: {
    fill: "#88ddf2",
    stroke: "#1ba1bf"
  },
  C: {
    fill: "#f28888",
    stroke: "#c52f2f"
  }
}
export class Antibiotic {
  constructor(x, y, concentration, type = 'A') {
    this.x = x;
    this.y = y;
    this.type = type
    this.radius = 10;
    this.sourceConc = concentration
    this.D = 0.17
  }

  getConcentration(x, y){
    const r = Math.hypot(this.x - x, this.y - y)
    const conc = this.sourceConc - this.D * Math.log(r)
    return conc >= 0 ? conc : 0
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = color[this.type].fill;
    ctx.fill();
    ctx.strokeStyle = color[this.type].stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}