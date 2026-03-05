const strains = {
  strain1: {
    growthRate: 0.2,
    susceptibilityThreshold: 0.00001,
    maxRadius: 9,
    color: '#d77800',
    susceptibility:{
      A: 0.9,
      B: 0.5,
      C: 0.2
    }
  },
  strain2: {
    growthRate: 0.5,
    susceptibilityThreshold: 0.0005,
    maxRadius: 10,
    color: '#747e6e',
    susceptibility:{
      A: 0.2,
      B: 0.9,
      C: 0.8
    }
  },
  strain3: {
    growthRate: 0.1,
    susceptibilityThreshold: 0.01,
    maxRadius: 12,
    color: '#c99f93',
    susceptibility:{
      A: 0.9,
      B: 0.9,
      C: 0.7
    }
  }
}


export class BacterialColony {

  constructor(x, y, dishCenter, dishRadius, strain) {
    this.x = x;
    this.y = y;
    this.radius = 0.5;
    this.strain = strain
    this.color = strains[strain].color
    this.maxRadius = strains[strain].maxRadius;
    this.dishCenter = dishCenter
    this.dishRadius = dishRadius
    this.baseGrowthSpeed = strains[strain].growthRate; // pixels per frame without antibiotic
    this.growthSpeed = this.baseGrowthSpeed;
    this.susceptibilityThreshold = strains[strain].susceptibilityThreshold; // min antibiotic concentration threshold to inhibit growth
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.save()
    ctx.globalCompositeOperation = "overlay"
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore()
  }

  grow(antibiotics) {

    if(this.radius >= this.maxRadius) return

    // add up conc from all the antibiotic -- weighted sum though for each antibiotic
    let conc = 0
    for (const disk of antibiotics){
      conc += strains[this.strain].susceptibility[disk.type] * disk.getConcentration(this.x, this.y)
    }
    // Adjust growth speed based on concentration
    if (conc > this.susceptibilityThreshold) {
      // Strong inhibition: growth speed decreases linearly, zero if concentration high
      this.growthSpeed = this.baseGrowthSpeed * Math.max(0, 1 - (conc - this.susceptibilityThreshold) * 10);
    } else {
      this.growthSpeed = this.baseGrowthSpeed;
    }


    // Limit growth so colony does not exceed dish boundary
    const distToCenter = Math.hypot(this.x - this.dishCenter.x, this.y - this.dishCenter.y);
    const maxPossibleRadius = this.dishRadius - distToCenter;

    if (this.radius < maxPossibleRadius && this.radius < this.maxRadius && this.growthSpeed > 0) {
      this.radius += this.growthSpeed;
    }
  }


}