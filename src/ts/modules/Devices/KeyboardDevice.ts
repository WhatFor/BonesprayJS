
import { IMidiDevice, MidiNote, MidiMessage, MidiOnOff } from "../../types/midi";
import MidiInterface from "../MidiInterface";

export class KeyboardDevice implements IMidiDevice {

    private midi: MidiInterface = new MidiInterface();

    /*
     *  Keep track of all ON notes, as for some reason
     *  the keyboard doesn't publish OFF events.
     */
    private onNotes: number[] = [];

    deviceName: string = 'SAMSONG Carbon49 ';
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

        let type: MidiOnOff;
        let note: number = message.data[1];

        // If we already have the 'ON' event, we know
        // that the same not occuring again is an 'OFF' event
        if (this.onNotes.includes(note)) {
            type = 'off';
            // If it is an OFF, remove the note from the onNotes array
            this.onNotes.splice(this.onNotes.indexOf(note), 1);
        }
        else {
            type = 'on';
            // If it is an ON, add it to our onNotes array
            this.onNotes.push(note);
        }

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