import { IScene, MidiNote } from "../../types/midi";
import * as THREE from "three";

export class BoxScene implements IScene {

    id?: number;
    active: boolean = false;
    initialised: boolean = false;

    // Scene Elements
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera;
    scene: THREE.Scene = new THREE.Scene;
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer;
    geometry: THREE.Geometry = new THREE.Geometry;
    material: THREE.Material = new THREE.Material;
    mesh1: THREE.Object3D = new THREE.Object3D;
    mesh2: THREE.Object3D = new THREE.Object3D;

    constructor(id: number) {
        this.id = id;

        if (!this.initialised) {
            this.init();
            this.initialised = true;
        }
    }

    processNote = (note: MidiNote): void => {
        console.log(note);
        if (note.type == 'on') {
            this.mesh1.visible = true;
        }
        else if (note.type == 'hit') {
            this.mesh1.visible = true;
            setTimeout(() => {
                this.mesh1.visible = false;
            }, 200);
        }
        else {
            this.mesh1.visible = false;
        }
    }

    start = (): void => {
        this.active = true;
        this.animate();
    }

    stop = (): void => {
        this.active = false;
    }

    init = () => {
        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();

        this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        this.material = new THREE.MeshNormalMaterial();

        this.mesh1 = new THREE.Mesh(this.geometry, this.material);
        this.mesh2 = new THREE.Mesh(this.geometry, this.material);

        this.mesh1.visible = false;
        this.mesh2.visible = false;

        this.mesh1.translateX(-0.5);
        this.mesh2.translateX(0.5);

        this.scene.add(this.mesh1);
        this.scene.add(this.mesh2);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    animate = () => {
        if (this.active === false) return;
        requestAnimationFrame(this.animate);

        this.mesh1.rotation.x += 0.01;
        this.mesh1.rotation.y += 0.02;

        this.mesh2.rotation.x -= 0.01;
        this.mesh2.rotation.y -= 0.02;

        this.renderer.render(this.scene, this.camera);
    }
}