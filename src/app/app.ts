import { Component, signal } from '@angular/core';
import { ModelViewer } from './model-viewer/model-viewer';
import { ModelProperties } from '../model/model-properties';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ModelViewer, MatFormField, MatLabel, MatInput, FormsModule],
  templateUrl: './app.html',
})
export class App {
  protected modelProperties = signal<ModelProperties>({
    length: 1,
    width: 1,
  });

  protected updateLength(length: number) {
    this.modelProperties.update((props) => ({
      ...props,
      length,
    }));
  }

  protected updateWidth(width: number) {
    this.modelProperties.update((props) => ({
      ...props,
      width,
    }));
  }
}
