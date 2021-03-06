
import { IMidiDevice, MidiNote, MidiMessage, MidiOnOff } from "../../types/midi";
import MidiInterface from "../MidiInterface";

export class KeyboardDevice implements IMidiDevice {

    deviceName: string = '03. Internal MIDI';

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
                    if (note == undefined) return;
                    this.pushNoteCallback(note);
                };

                console.warn("Device connected. MIDI Name: " + this.deviceName);
            });
    }

    mapNote(message: MidiMessage): MidiNote | undefined {

        let type: MidiOnOff;
        let note: number = message.data[1];

        // If we already have the 'ON' event, we know
        // that the same not occuring again is an 'OFF' event
        if (this.onNotes.includes(note)) {

            type = 'off';

            // If it is an OFF, remove the note from the onNotes array
            this.onNotes.splice(this.onNotes.indexOf(note), 1);

            // If we've still got notes ON, then don't send the off?
            // This is probably up to the scene to decide how to handle it, though
            if (this.onNotes.length > 0) return undefined;
        }
        else {
            type = 'on';
            // If it is an ON, add it to our onNotes array
            this.onNotes.push(note);
        }

        return {
            device: this.deviceName,
            channel: message.data[0] - 128,
            note: note,
            velocity: message.data[2],
            type: type,
        };
    }
}