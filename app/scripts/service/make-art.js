import config from '../config'

export default class MakeArtService {
    get (userId) {
        fetch(`${config.API_URL}/${userId}/kano-draw`)
            .then((res) => res.json())
            .then((obj) => {
                console.log(obj);
            })
    }
}
