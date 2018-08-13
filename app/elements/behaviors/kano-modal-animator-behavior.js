// @polymerBehavior
export const ModalAnimatorBehavior = {
    configureModal (node, animation) {
        ModalAnimatorBehavior.animations[animation].configureNode(node);
    }
};

ModalAnimatorBehavior.animations = {
    'scale-down': {
        configureNode (node) {
            node.animationConfig = node.animationConfig || {};
            node.animationConfig.entry = [{
                name: 'transform-animation',
                transformFrom: 'scale(1.5)',
                node: node,
                timing: {
                    duration: 200
                }
            },{
                name: 'fade-in-animation',
                node: node,
                timing: {
                    duration: 200
                }
            }];
        }
    },
    'fade-out': {
        configureNode (node) {
            node.animationConfig = node.animationConfig || {};
            node.animationConfig.exit = {
                name: 'fade-out-animation',
                node: node,
                timing: {
                    duration: 200
                }
            };
        }
    }
};
