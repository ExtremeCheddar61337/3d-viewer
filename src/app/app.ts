import { Component, signal } from '@angular/core';
import { ModelViewer } from './model-viewer/model-viewer';
import { ModelProperties } from '../model/model-properties';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ModelViewer,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './app.html',
})
export class App {
  protected modelProperties = signal<ModelProperties>({
    width: 3,
    height: 1,
    depth: 6,
    color: '#5B9034',
  });

  protected updateWidth(width: number) {
    this.modelProperties.update((props) => ({
      ...props,
      width,
    }));
  }

  protected updateHeight(height: number) {
    this.modelProperties.update((props) => ({
      ...props,
      height,
    }));
  }

  protected updateDepth(depth: number) {
    this.modelProperties.update((props) => ({
      ...props,
      depth,
    }));
  }

  protected updateColor(color: string) {
    this.modelProperties.update((props) => ({
      ...props,
      color,
    }));
  }
}
