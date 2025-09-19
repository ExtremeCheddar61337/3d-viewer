import { Component, inject } from '@angular/core';
import { ModelViewer } from './model-viewer/model-viewer';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ModelService } from './model-service';

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
  protected modelService = inject(ModelService);
}
