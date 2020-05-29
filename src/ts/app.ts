import '../scss/site.scss';
import { Push2Device } from './modules/Devices/Push2Device';
import { DrumkitDevice } from './modules/Devices/DrumkitDevice';
import { KeyboardDevice } from './modules/Devices/KeyboardDevice';

import SceneManager from './modules/SceneManager';
import BoxScene from './modules/Scenes/BoxScene';
import AudioVisualiserScene from './modules/Scenes/AudioVisualiserScene';
import MidiInterface from './modules/MidiInterface';

/* App Launch */
(function () {

    // Debug - list all devices
    new MidiInterface().getAllDevices().then(x => console.log(x));

    // Register Scenes
    var sceneManager = new SceneManager();
    sceneManager.registerScenes([
        new AudioVisualiserScene(1),
        new BoxScene(2),
    ]);

    // Connect Push2 
    var push = new Push2Device();
    push.connect();
    push.pushNoteCallback = note => sceneManager.pushNote(note);

    // Connect Drumkit
    var drum = new DrumkitDevice();
    drum.connect();
    drum.pushNoteCallback = note => sceneManager.pushNote(note);

    // Connect Keyboard
    var keyboard = new KeyboardDevice();
    keyboard.connect();
    keyboard.pushNoteCallback = note => sceneManager.pushNote(note);

    // Debug - Mark a scene as active
    sceneManager.activateScene(1);
})();