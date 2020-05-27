import { IMidiDevice, MidiNote, MidiMessage, MidiOnOff } from "../../types/midi";
import MidiInterface from "../MidiInterface";

export class AbletonDevice implements IMidiDevice {

    private midi: MidiInterface = new MidiInterface();

    /*
     *  For drum hits, we need to do some magic.
     *  Keep track of all ON notes, as for some reason
     *  the keyboard doesn't publish OFF events.
     */
    private drumChannels: number[] = [2];
    private onNotes: number[] = [];

    deviceName: string = 'LoopBe Internal MIDI';
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
            });
    }

    mapNote(message: MidiMessage): MidiNote | undefined {

        let type: MidiOnOff;
        let note: number = message.data[1];
        let channel: number = 0;

        // If we're in a drum channel, handle the drum hit
        var nativeChannel = message.data[0] - 128;
        if (nativeChannel - 16 > 0) nativeChannel -= 16;

        if (this.drumChannels.includes(nativeChannel)) {
            // If we already have the 'ON' event, we know
            // that the same note occuring again is a 'HIT' event
            if (!this.onNotes.includes(note)) {
                this.onNotes.push(note);
                channel = nativeChannel;
                type = 'hit';
            }
            else {
                // We've seen this hit before, so we wanna remove it
                this.onNotes.splice(this.onNotes.indexOf(note), 1);
                type = 'void';
            }

            if (type == 'void') return undefined;
        }

        // handle normal input
        else {
            type = message.data[2] > 0 ? 'on' : 'off';
            channel = this.mapToChannel(message.data[0], type);
        }

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