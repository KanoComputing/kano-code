import KitDevice from './kit-device.js';

class Camera extends KitDevice {
    takePicture() {
        return new Promise((resolve, reject) => {
            this.socket.once('camera:takepicture', data => resolve(data.filename));
            this.emit('camera:takepicture');
        });
    }

    getPicture(filename) {
        // Just return path to the endpoint
        return `${this.url}/takenpics/${filename}`;
    }

    lastPicture() {
        // Just return path to the endpoint
        return `${this.url}/camera/imgs/last.jpg`;
    }

}

export default Camera;
