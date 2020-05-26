import '../scss/site.scss';
import Midi from "./modules/Midi";
import * as THREE from 'three';

const targetInput: string = "LoopBe Internal MIDI";

new Midi()
    .getDevice('input', targetInput)
    .then(port => {
        if (port === undefined) {
            console.error("ERR: MIDI port not found.");
            return;
        }

        port.onmidimessage = function (message) {
            var note = mapToNote(message);

            // Test
            if (note.channel == 0) {
                mesh1.visible = note.type == 'on' ? true : false;
            }

            if (note.channel == 1) {
                mesh2.visible = note.type == 'on' ? true : false;
            }
        };
    });

function mapToNote(message: MidiMessage): MidiNote {

    let type: MidiOnOff = message.data[2] > 0 ? 'on' : 'off';
    let channel = mapToChannel(message.data[0], type);

    return {
        channel: channel,
        note: message.data[1],
        velocity: message.data[2],
        type: type,
    };
}

function mapToChannel(channel: number, type: MidiOnOff) {
    let channelNumber = channel - 128;
    if (type == 'on') channelNumber -= 2 ** 4;
    return channelNumber;
}


/*
 * Example Three Render 
*/

var camera: THREE.PerspectiveCamera;
var scene: THREE.Scene;
var renderer: THREE.WebGLRenderer;
var geometry;
var material;
var mesh1: THREE.Object3D;
var mesh2: THREE.Object3D;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    material = new THREE.MeshNormalMaterial();

    mesh1 = new THREE.Mesh(geometry, material);
    mesh2 = new THREE.Mesh(geometry, material);

    mesh1.visible = false;
    mesh2.visible = false;

    mesh1.translateX(-0.5);
    mesh2.translateX(0.5);

    scene.add(mesh1);
    scene.add(mesh2);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    mesh1.rotation.x += 0.01;
    mesh1.rotation.y += 0.02;

    mesh2.rotation.x -= 0.01;
    mesh2.rotation.y -= 0.02;

    renderer.render(scene, camera);

}