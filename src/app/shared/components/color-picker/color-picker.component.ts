import { Component } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
})
export class ColorPickerComponent {
  selectedColorFromSlider!: string;
  finalColor!: string;

  listenColorFromSlider(color: string): void {
    this.selectedColorFromSlider = color;
  }

  listenColorFromPalette(color: string): void {
    this.finalColor = color;
  }
}
