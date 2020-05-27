
import { IMidiDevice, MidiNote, MidiMessage, MidiOnOff } from "../../types/midi";
import MidiInterface from "../MidiInterface";

export class DrumkitDevice implements IMidiDevice {

    deviceName: string = '02. Internal MIDI';

    private midi: MidiInterface = new MidiInterface();
    private onNotes: number[] = [];
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

        let type: MidiOnOff;
        let note: number = message.data[1];
        let channel: number = 0;

        // If we're in a drum channel, handle the drum hit
        var nativeChannel = message.data[0] - 128;
        if (nativeChannel - 16 > 0) nativeChannel -= 16;

        // If we already have the 'ON' event, we know
        // that the same note occuring again is a 'HIT' event
        if (!this.onNotes.includes(note)) {
            this.onNotes.push(note);
            channel = nativeChannel;
            type = 'hit';
        }
        else {
            // We've seen this hit before, so we wanna remove it
            // and return a void event
            this.onNotes.splice(this.onNotes.indexOf(note), 1);
            type = 'void';
        }

        if (type == 'void') return undefined;

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