const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const MODIFICATORS = ['#', 'b'];

const NOTES_HALF_STEPS = {
    'C': 1,
    'D': 2,
    'E': 2,
    'F': 1,
    'G': 2,
    'A': 2,
    'B': 2
}

const MODIFICATORS_HALF_STEPS = {
    '#': 1,
    'b': -1
};

const HALF_STEPS_IN_OCTAVE = 12;

class Note {
    constructor (note, oct, modificator) {
        oct = oct || 0;
        if (NOTES.indexOf(note) === -1) {
            throw new Error(`${note} is an invalid note`);
        }
        if (modificator && MODIFICATORS.indexOf(modificator) === -1) {
            throw new Error(`${modificator} is an invalid modificator`);
        }
        this.note = note;
        this.modificator = modificator;
        this.oct = oct;
    }

    get halfSteps () {
        return Note.computeHalfSteps(this.note, this.oct, this.modificator);
    }

    static computeHalfSteps (note, oct, mod) {
        let halfSteps = 0;
        for (let i = NOTES.indexOf(note); i >= 0; i--) {
            halfSteps += NOTES_HALF_STEPS[NOTES[i]];
        }
        return halfSteps + (oct - 1) * HALF_STEPS_IN_OCTAVE + (mod ? MODIFICATORS_HALF_STEPS[mod] : 0);
    }

    static get A4halfSteps () {
        return Note.computeHalfSteps('A', 4);
    }

    static get a () {
        return Math.pow(2, 1 / 12);
    }

    get frequency () {
        return 440 * Math.pow(Note.a, this.halfSteps - Note.A4halfSteps);
    }
}

export { Note };
