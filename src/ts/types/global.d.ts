declare interface Navigator {
    requestMIDIAccess: any;
}

declare type MidiAccess = {
    onstatechange: (evt: OnChangeEvent) => void;
    outputs: MidiPort[];
    inputs: MidiPort[];
}

declare type OnChangeEvent = {
    port: MidiPort;
    target: MidiAccess;
}

declare type MidiPort = {
    name: string;
    manufacturer: string;
    state: string;
    type: string;
    id: string;
    onmidimessage: (message: MidiMessage) => void;
    onstatechange: (message: MidiMessage) => void;
}

declare type MidiMessage = {
    data: Uint8Array;
    timestamp: Date;
}

declare type MidiNote = {
    channel: number;
    note: number;
    velocity: number;
    type: MidiOnOff;
}

declare type PortType = 'input' | 'output';

declare type MidiOnOff = 'on' | 'off';