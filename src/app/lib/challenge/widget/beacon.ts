import { IEditorWidget } from '../../editor/widget/widget.js';
import { KCBeacon } from '../../../elements/kc-beacon.js';

export class BeaconWidget implements IEditorWidget {
    private position : string|null = null;
    private domNode? : KCBeacon;
    getDomNode() {
        if (!this.domNode) {
            this.domNode = new KCBeacon();
        }
        return this.domNode;
    }
    setPosition(p : string) {
        this.position = p;
    }
    getPosition() {
        return this.position;
    }
}