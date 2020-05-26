import { IMidi } from "../types/IMidi";

export default class Midi implements IMidi {
    getMidiAccess(): Promise<MidiAccess> {
        return navigator.requestMIDIAccess();
    }

    getAllDevices(): Promise<MidiPort[]> {
        return this.getMidiAccess()
            .then(access => {
                return Array.from(access.inputs.values())
                    .concat(
                        Array.from(access.outputs.values())
                    );
            });
    }

    hasDevice(type: PortType, name: string): boolean {
        return this.getDevice(type, name) !== undefined;
    }

    getDevice(type: PortType, name: string): Promise<MidiPort | undefined> {
        return this
            .getMidiAccess()
            .then(access => {
                switch (type) {
                    case 'input':
                        return Array.from(access.inputs.values())
                            .find(p => p.name == name);
                    case 'output':
                        return Array.from(access.outputs.values())
                            .find(p => p.name == name);
                }
            });
    }
}
