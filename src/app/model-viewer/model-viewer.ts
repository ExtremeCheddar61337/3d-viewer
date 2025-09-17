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
  AxesHelper,
  BoxGeometry,
  Color,
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

  @Input() public dataSource!: ReturnType<typeof signal<ModelProperties>>;

  private cameraFov = 75;
  private cameraNearDistance = 0.1;
  private cameraFarDistance = 1000;
  private cameraDistance = 5;
  private axesScaleFactor = 0.75;

  private canvas?: HTMLCanvasElement;
  private scene?: Scene;
  private axesHelper?: AxesHelper;
  private camera?: PerspectiveCamera;
  private renderer?: WebGLRenderer;
  private orbitControls?: OrbitControls;
  private cube?: Mesh;

  constructor() {
    // Detect changes of signals (like data source) => update model
    effect(() => {
      this.updateScene();
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
      // Setup BG
      this.scene.background = new Color('#1E1E1E');
      this.axesHelper = new AxesHelper(this.getMaxLength() * this.axesScaleFactor);
      this.scene.add(this.axesHelper);

      // Setup cube
      const geometry = new BoxGeometry(
        this.dataSource().width,
        this.dataSource().height,
        this.dataSource().depth,
      );
      const material = new MeshPhysicalMaterial({ color: new Color(this.dataSource().color) });
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

  private updateScene() {
    if (this.cube) {
      this.axesHelper!.scale.set(
        this.getMaxLength() * this.axesScaleFactor,
        this.getMaxLength() * this.axesScaleFactor,
        this.getMaxLength() * this.axesScaleFactor,
      );

      this.cube.scale.setX(this.dataSource().width);
      this.cube.scale.setY(this.dataSource().height);
      this.cube.scale.setZ(this.dataSource().depth);
      (this.cube.material as MeshPhysicalMaterial).color.set(this.dataSource().color);
    }
  }

  private getMaxLength(): number {
    if (!this.dataSource) return 0;

    const { width, height, depth } = this.dataSource();
    const lenghts: number[] = [width, height, depth];

    return Math.max(...lenghts);
  }
}
