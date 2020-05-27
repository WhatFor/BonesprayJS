import '../scss/site.scss';
import { AbletonDevice } from './modules/Devices/AbletonDevice';
import { KeyboardDevice } from './modules/Devices/KeyboardDevice';
import SceneManager from './modules/SceneManager';
import { BoxScene } from './modules/Scenes/BoxScene';
import MidiInterface from './modules/MidiInterface';

/* App Launch */
(function () {

    // Debug - list all devices
    new MidiInterface().getAllDevices().then(x => console.log(x));

    // Register Scenes
    var sceneManager = new SceneManager();
    sceneManager.registerScenes([
        new BoxScene(1),
    ]);

    // Connect Ableton
    var ableton = new AbletonDevice();
    ableton.connect();
    ableton.pushNoteCallback = note => sceneManager.pushNote(note);

    // Connect Keyboard
    var keyboard = new KeyboardDevice();
    keyboard.connect();
    keyboard.pushNoteCallback = note => sceneManager.pushNote(note);

    // Debug - Mark a scene as active
    sceneManager.activateScene(1);

})();