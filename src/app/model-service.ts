import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModelService {
  public width = signal<number>(1);
  public height = signal<number>(1);
  public depth = signal<number>(1);
  public color = signal<string>('#FFFFFF');
}
