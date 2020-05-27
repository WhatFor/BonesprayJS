import { IMidiInterface, MidiAccess, MidiPort, PortType } from "../types/midi";

export default class MidiInterface implements IMidiInterface {
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
                const ports = type == 'input' ?
                    Array.from(access.inputs.values()) :
                    Array.from(access.outputs.values());

                return ports.find(x => x.name == name);
            });
    }
}
