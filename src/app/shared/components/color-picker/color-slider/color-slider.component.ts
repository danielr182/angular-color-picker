import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrl: './color-slider.component.scss',
})
export class ColorSliderComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  @Output()
  selectedColor: EventEmitter<string> = new EventEmitter();

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.isMouseDown = false;
  }

  private canvasCtx!: CanvasRenderingContext2D;
  private isMouseDown: boolean = false;
  private selectedPosY!: number;

  ngAfterViewInit(): void {
    this.initiateCanvas();
    this.drawGradient();
  }

  onMouseDown(event: MouseEvent): void {
    this.isMouseDown = true;
    this.selectedPosY = event.offsetY;
    this.drawSelectedColor();
    this.emitColor(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent): void {
    const offsetY = event.offsetY;
    if (this.isMouseDown && this.selectedPosY !== offsetY) {
      this.selectedPosY = offsetY;
      this.drawSelectedColor();
      this.emitColor(event.offsetX, event.offsetY);
    }
  }

  private initiateCanvas(): void {
    this.canvasCtx = <CanvasRenderingContext2D>(
      this.canvas.nativeElement.getContext('2d', { willReadFrequently: true })
    );
  }

  private drawGradient(): void {
    const height = this.canvas.nativeElement.height;
    const width = this.canvas.nativeElement.width;
    this.canvasCtx.clearRect(0, 0, width, height);

    const gradient = this.canvasCtx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

    this.canvasCtx.beginPath();
    this.canvasCtx.rect(0, 0, width, height);
    this.canvasCtx.fillStyle = gradient;
    this.canvasCtx.fill();
    this.canvasCtx.closePath();
  }

  private drawSelectedColor(): void {
    this.drawGradient();
    this.canvasCtx.beginPath();
    this.canvasCtx.strokeStyle = 'white';
    this.canvasCtx.lineWidth = 4;
    this.canvasCtx.rect(
      -2,
      this.selectedPosY - 4,
      this.canvas.nativeElement.width + 4,
      10
    );
    this.canvasCtx.stroke();
    this.canvasCtx.closePath();
  }

  private getColor(x: number, y: number): string {
    const imgData = this.canvasCtx.getImageData(x, y, 1, 1).data;
    return `rgba(${imgData[0]}, ${imgData[1]}, ${imgData[2]}, 1)`;
  }

  private emitColor(posX: number, posY: number): void {
    const color = this.getColor(posX, posY);
    this.selectedColor.emit(color);
  }
}
