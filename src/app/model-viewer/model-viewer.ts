import {
  Component,
  effect,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three-stdlib';
import { ModelProperties } from '../../model/model-properties';

@Component({
  selector: 'app-model-viewer',
  standalone: true,
  templateUrl: './model-viewer.html',
})
export class ModelViewer implements OnInit {
  @ViewChild('threeCanvas', { static: true })
  private threeCanvas?: ElementRef<HTMLCanvasElement>;

  @Input() public dataSource = signal<ModelProperties>({
    length: 1,
    width: 1,
  });

  private cameraFov = 75;
  private cameraNearDistance = 0.1;
  private cameraFarDistance = 1000;
  private cameraDistance = 5;

  private canvas?: HTMLCanvasElement;
  private scene?: Scene;
  private camera?: PerspectiveCamera;
  private renderer?: WebGLRenderer;
  private orbitControls?: OrbitControls;
  private cube?: Mesh;

  constructor() {
    // Detect changes of signals (like data source) => update model
    effect(() => {
      this.updateModel();
    });
  }

  public ngOnInit() {
    // Setup canvas
    this.canvas = this.threeCanvas?.nativeElement;

    if (this.canvas) {
      // Setup scene
      this.scene = new Scene();
      const canvasRect = this.canvas.getBoundingClientRect();

      // Setup camera
      this.camera = new PerspectiveCamera(
        this.cameraFov,
        canvasRect.width / canvasRect.height,
        this.cameraNearDistance,
        this.cameraFarDistance,
      );
      this.camera.position.z = this.cameraDistance;

      // Setup renderer
      this.renderer = new WebGLRenderer({ canvas: this.canvas });
      this.renderer.setSize(canvasRect.width, canvasRect.height);

      // Setup orbit controls
      this.orbitControls = new OrbitControls(this.camera, this.canvas);

      // Setup test scene
      this.setupTestScene();

      // Setup update routine
      this.startUpdateRoutine();
    }
  }

  private startUpdateRoutine(): void {
    if (this.scene && this.camera && this.renderer && this.orbitControls) {
      // Used for calling this function based on display refresh rate
      requestAnimationFrame(() => this.startUpdateRoutine());

      // Update camera orbit controls
      this.orbitControls.update();

      // Render
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Recalculate view port after window resize
  @HostListener('window:resize')
  onResize() {
    if (this.camera && this.canvas && this.renderer) {
      const canvasRect = this.canvas.getBoundingClientRect();

      this.camera.aspect = canvasRect.width / canvasRect.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(canvasRect.width, canvasRect.height);
    }
  }

  private setupTestScene() {
    if (this.scene) {
      // Setup cube
      const geometry = new BoxGeometry(1, 1, 1);
      const material = new MeshPhysicalMaterial({ color: 0x00ff00 });
      this.cube = new Mesh(geometry, material);
      this.scene.add(this.cube);

      // Setup ambient light
      const ambientLight = new AmbientLight(0x404040);
      this.scene.add(ambientLight);

      // Setup directional light
      const directionalLight = new DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 5);
      this.scene.add(directionalLight);
    }
  }

  private updateModel() {
    if (this.cube) {
      this.cube.scale.setX(this.dataSource().length);
      this.cube.scale.setZ(this.dataSource().width);
    }
  }
}
