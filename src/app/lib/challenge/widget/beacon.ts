import { IEditorWidget } from '../../editor/widget/widget.js';
import { KCBeacon } from '../../../elements/kc-beacon.js';

export class BeaconWidget implements IEditorWidget {
    private position : string|null = null;
    private domNode? : KCBeacon;
    getDomNode() {
        if (!this.domNode) {
            this.domNode = new KCBeacon();
            this.domNode.style.pointerEvents = 'none';
            this.domNode.style.transition = 'transform linear 50ms';
        }
        return this.domNode;
    }
    setPosition(p : string|null) {
        this.position = p;
    }
    getPosition() {
        return this.position;
    }
}