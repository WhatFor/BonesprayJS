export declare interface IMidi {
    getMidiAccess(): Promise<MidiAccess>;

    getAllDevices(): Promise<MidiPort[]>;

    hasDevice(type: PortType, name: string): boolean;

    getDevice(type: PortType, name: string): Promise<MidiPort | undefined>;
}
