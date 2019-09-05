import { IEditorWidget } from '../../editor/widget/widget.js';
import { KCBeacon } from '../../../elements/kc-beacon.js';

export class BeaconWidget implements IEditorWidget {
    private position : string|null = null;
    private domNode? : KCBeacon;
    private resolvedPosition : {x : number, y : number}|null = null;
    private blockPosition : boolean = false;
    getDomNode() {
        if (!this.domNode) {
            this.domNode = new KCBeacon();
            this.domNode.style.pointerEvents = 'none';
            this.domNode.style.transition = 'transform linear 50ms';
        }
        return this.domNode;
    }
    setResolvedPosition(x : number, y : number) {
        this.resolvedPosition = {x, y};
    }
    setBlockPosition(blockPosition : boolean) {
        this.blockPosition = blockPosition;
    }
    isBlockPosition() {
        return this.blockPosition;
    }
    getResolvedPosition() {
        return this.resolvedPosition;
    }
    setPosition(p : string|null) {
        this.position = p;
    }
    getPosition() {
        return this.position;
    }
}