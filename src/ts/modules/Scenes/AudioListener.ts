import * as THREE from "three";

export default class AudioListener {

    private mediaConstraints = { audio: true };

    protected fftSize: number = 32;
    protected mediaRecorder?: MediaRecorder;
    protected analyser?: THREE.AudioAnalyser;
    protected listener: THREE.AudioListener;
    protected audio: THREE.Audio;

    constructor() {

        this.listener = new THREE.AudioListener();
        this.audio = new THREE.Audio(this.listener);
        this.setupMicrophone();
    }

    setupMicrophone() {
        navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia(this.mediaConstraints)
                .then((stream) => {
                    this.mediaRecorder = new MediaRecorder(stream);
                    this.mediaRecorder.start();
                    this.audio.setMediaStreamSource(this.mediaRecorder.stream);
                    this.analyser = new THREE.AudioAnalyser(this.audio, this.fftSize * 2);
                })
                .catch(function (err) {
                    console.error('Microphone ERROR: ' + err);
                })
    }
}
