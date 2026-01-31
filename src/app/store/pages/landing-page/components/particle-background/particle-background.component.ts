import { Component, ElementRef, HostListener, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  density: number;
  color: string;
  isStar?: boolean;
  shimmer?: number;
  shimmerSpeed?: number;
}

@Component({
  selector: 'app-particle-background',
  standalone: true,
  template: `<canvas #canvas></canvas>`,
  styles: [`
    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: -1;
      pointer-events: none;
      background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
  `]
})
export class ParticleBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId!: number;
  private mouse = {
    x: null as number | null,
    y: null as number | null,
    radius: 200 
  };

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  @HostListener('window:resize')
  onResize() {
    this.initCanvasSize();
    this.initParticles();
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;
    this.initCanvasSize();
    this.initParticles();
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }

  private initCanvasSize() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initParticles() {
    this.particles = [];
    
    // 1. Crear Partículas Interactivas (Indigo)
    const numberOfParticles = (window.innerWidth * window.innerHeight) / 5000;
    for (let i = 0; i < numberOfParticles; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      this.particles.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: Math.random() * 2 + 1,
        density: (Math.random() * 35) + 5,
        color: 'rgba(99, 102, 241, 0.5)'
      });
    }

    // 2. Crear Estrellas (Blancas/Brillantes)
    const numberOfStars = (window.innerWidth * window.innerHeight) / 8000;
    for (let i = 0; i < numberOfStars; i++) {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      this.particles.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        size: Math.random() * 1.5 + 0.5,
        density: (Math.random() * 10) + 2, 
        color: 'rgba(255, 255, 255, 0.8)',
        isStar: true,
        shimmer: Math.random(),
        shimmerSpeed: Math.random() * 0.01 + 0.002 // Reducido para un parpadeo más elegante
      });
    }
  }

  private animate() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = this.mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * p.density;
          const directionY = forceDirectionY * force * p.density;
          
          p.x -= directionX * 0.5; // Suavizado de la fuerza de empuje
          p.y -= directionY * 0.5;
        } else {
          if (p.x !== p.baseX) {
            const dx = p.x - p.baseX;
            p.x -= dx / 50; // Retorno mucho más lento y suave
          }
          if (p.y !== p.baseY) {
            const dy = p.y - p.baseY;
            p.y -= dy / 50; // Retorno mucho más lento y suave
          }
        }
      }

      // Lógica de parpadeo para estrellas
      if (p.isStar && p.shimmer !== undefined && p.shimmerSpeed !== undefined) {
        p.shimmer += p.shimmerSpeed;
        const alpha = 0.3 + Math.abs(Math.sin(p.shimmer)) * 0.7;
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      } else {
        this.ctx.fillStyle = p.color;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.closePath();
      this.ctx.fill();

      // Añadir un pequeño resplandor a las estrellas
      if (p.isStar) {
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = 'white';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
