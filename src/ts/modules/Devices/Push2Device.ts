import { IMidiDevice, MidiNote, MidiMessage, MidiOnOff } from "../../types/midi";
import MidiInterface from "../MidiInterface";

export class Push2Device implements IMidiDevice {

    deviceName: string = '01. Internal MIDI';

    private midi: MidiInterface = new MidiInterface();
    pushNoteCallback: (note: MidiNote) => void = _ => { };

    connect() {
        this.midi.getDevice('input', this.deviceName)
            .then(port => {
                if (port === undefined)
                    throw new Error("ERR: MIDI port not found. Port: " + this.deviceName);

                port.onmidimessage = (message: MidiMessage) => {
                    var note = this.mapNote(message);
                    if (note === undefined) return;
                    this.pushNoteCallback(note);
                };

                console.warn("Device connected. MIDI Name: " + this.deviceName);
            });
    }

    mapNote(message: MidiMessage): MidiNote | undefined {

        let note: number = message.data[1];
        let type: MidiOnOff = message.data[2] > 0 ? 'on' : 'off';
        let channel = this.mapToChannel(message.data[0], type);

        return {
            device: this.deviceName,
            channel: channel,
            note: note,
            velocity: message.data[2],
            type: type,
        };
    }

    mapToChannel(channel: number, type: MidiOnOff) {
        let channelNumber = channel - 128;
        if (type == 'on') channelNumber -= 2 ** 4;
        return channelNumber;
    }
}