import { IMidiDevice, MidiNote, MidiMessage, MidiOnOff } from "../../types/midi";
import MidiInterface from "../MidiInterface";

export class AbletonDevice implements IMidiDevice {

    private midi: MidiInterface = new MidiInterface();

    deviceName: string = 'LoopBe Internal MIDI';
    pushNoteCallback: (note: MidiNote) => void = _ => { };

    connect() {
        this.midi.getDevice('input', this.deviceName)
            .then(port => {
                if (port === undefined)
                    throw new Error("ERR: MIDI port not found. Port: " + this.deviceName);

                port.onmidimessage = (message: MidiMessage) => {
                    var note = this.mapNote(message);
                    this.pushNoteCallback(note);
                };
            });
    }

    mapNote(message: MidiMessage): MidiNote {
        let type: MidiOnOff = message.data[2] > 0 ? 'on' : 'off';
        let channel = this.mapToChannel(message.data[0], type);

        return {
            device: this.deviceName,
            channel: channel,
            note: message.data[1],
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