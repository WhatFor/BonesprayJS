export declare interface IMidiInterface {
    getMidiAccess(): Promise<MidiAccess>
    getAllDevices(): Promise<MidiPort[]>
    hasDevice(type: PortType, name: string): boolean
    getDevice(type: PortType, name: string): Promise<MidiPort | undefined>
}

export declare interface ISceneManager {
    registerScenes(scenes: IScene[]): void
    getScenes(): IScene[]
    getActiveScene(): IScene | undefined
    activateScene(id: number): void
    pushNote(note: MidiNote): void
}

export declare interface IScene {
    id?: number
    active: boolean
    initialised: boolean
    start(): void
    stop(): void
    processNote(note: MidiNote): void
}

export class MidiMessage {
    target?: MidiPort
    data: Uint8Array = new Uint8Array
    timestamp: Date = new Date
}

export interface IMidiDevice {
    deviceName: string;
    pushNoteCallback: (note: MidiNote) => void
    connect(): void
    mapNote(message: MidiMessage): MidiNote | undefined
}

export declare type MidiAccess = {
    onstatechange: (evt: OnChangeEvent) => void
    outputs: MidiPort[]
    inputs: MidiPort[]
}

export declare type OnChangeEvent = {
    port: MidiPort
    target: MidiAccess
}

export declare type MidiPort = {
    name: string
    manufacturer: string
    state: string
    type: string
    id: string
    onmidimessage: (message: MidiMessage) => void
    onstatechange: (message: MidiMessage) => void
}

export declare type MidiNote = {
    device: string
    channel: number
    note: number
    velocity: number
    type: MidiOnOff
}

export declare type PortType = 'input' | 'output'

export declare type MidiOnOff = 'on' | 'off' | 'hit' | 'void'