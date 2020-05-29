import { IScene, MidiNote } from "../../types/midi";
import AudioListener from "./AudioListener";
import * as THREE from "three";

export default class AudioVisualiserScene
    extends AudioListener
    implements IScene {

    private downScale: number = 1;

    id?: number | undefined;
    active: boolean = false;
    initialised: boolean = false;

    // Scene Elements
    camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera;
    scene: THREE.Scene = new THREE.Scene;
    renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer;
    geometry: THREE.Geometry = new THREE.Geometry;
    material: THREE.Material = new THREE.Material;
    meshes: THREE.Object3D[] = [];

    constructor(id: number) {
        super(); // invokes the AudioListener constructor to set up the microphone input
        this.id = id;
        this.init();
    }

    start = (): void => {
        this.active = true;
        this.animate();
    }

    stop = (): void => {
        this.active = false;
    }

    // Ignore all incoming notes, as we don't care for them at the moment
    processNote(note: MidiNote): void { }

    init = () => {

        const width = 2 / this.fftSize;

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();
        this.geometry = new THREE.SphereGeometry(width / 2);
        this.material = new THREE.MeshNormalMaterial();

        for (var i = 0; i < this.fftSize; i++) {

            var mesh = new THREE.Mesh(this.geometry, this.material);
            mesh.translateX(-1 + (width * i));
            mesh.translateY(-0.5);
            this.meshes[i] = mesh;
            this.scene.add(this.meshes[i]);
        }

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth / this.downScale, window.innerHeight / this.downScale, false);
        document.body.appendChild(this.renderer.domElement);
    }

    animate = () => {
        if (this.active === false) return;
        requestAnimationFrame(this.animate);

        if (this.analyser !== undefined) {
            var data = this.analyser.getFrequencyData();
            for (var i = 0; i < this.fftSize; i++) {

                var mapped = this.scale(data[i], 0, 255, -0.5, 0.5);
                this.meshes[i].position.set(this.meshes[i].position.x, mapped, 0);
            }
        }

        this.renderer.render(this.scene, this.camera);
    }

    scale = (num: number, in_min: number, in_max: number, out_min: number, out_max: number) => {
        return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
}