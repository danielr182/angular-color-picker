import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrl: './color-palette.component.scss',
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  @Input()
  selectedColorFromSlider!: string;

  @Output()
  selectedColor: EventEmitter<string> = new EventEmitter();

  @HostListener('window:mouseup', ['$event'])
  onMouseUp() {
    this.isMouseDown = false;
  }

  private canvasCtx!: CanvasRenderingContext2D;
  private isMouseDown: boolean = false;
  private selectedPos!: { x: number; y: number };

  ngAfterViewInit(): void {
    this.initiateCanvas();
    this.drawGradients();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['selectedColorFromSlider'] &&
      !changes['selectedColorFromSlider'].firstChange
    ) {
      this.drawGradients();
      if (this.selectedPos) {
        this.drawSelectedColor();
        this.emitColor(this.selectedPos.x, this.selectedPos.y);
      }
    }
  }

  onMouseDown(event: MouseEvent): void {
    this.isMouseDown = true;
    this.selectedPos = { x: event.offsetX, y: event.offsetY };
    this.drawSelectedColor();
    this.emitColor(event.offsetX, event.offsetY);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isMouseDown) {
      this.selectedPos = { x: event.offsetX, y: event.offsetY };
      this.drawSelectedColor();
      this.emitColor(event.offsetX, event.offsetY);
    }
  }

  private initiateCanvas(): void {
    this.canvasCtx = <CanvasRenderingContext2D>(
      this.canvas.nativeElement.getContext('2d', { willReadFrequently: true })
    );
  }

  private drawGradients(): void {
    const height = this.canvas.nativeElement.height;
    const width = this.canvas.nativeElement.width;
    this.canvasCtx.clearRect(0, 0, width, height);

    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle =
      this.selectedColorFromSlider || 'rgba(255, 255, 255, 1)';
    this.canvasCtx.fillRect(0, 0, width, height);
    this.canvasCtx.closePath();

    const whiteGradient = this.canvasCtx.createLinearGradient(0, 0, width, 0);
    whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle = whiteGradient;
    this.canvasCtx.fillRect(0, 0, width, height);
    this.canvasCtx.closePath();

    const blackGradient = this.canvasCtx.createLinearGradient(0, 0, 0, height);
    blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
    this.canvasCtx.beginPath();
    this.canvasCtx.fillStyle = blackGradient;
    this.canvasCtx.fillRect(0, 0, width, height);
    this.canvasCtx.closePath();
  }

  private drawSelectedColor(): void {
    this.drawGradients();
    this.canvasCtx.beginPath();
    this.canvasCtx.strokeStyle = 'white';
    this.canvasCtx.lineWidth = 3;
    this.canvasCtx.arc(
      this.selectedPos.x,
      this.selectedPos.y,
      8,
      0,
      2 * Math.PI
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
