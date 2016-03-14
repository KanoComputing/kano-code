import config from '../config';

const MakeArtService = {
    getImages (userId) {
        let headers = new Headers();
        headers.append('Authorization', app.modelManager.get('user').token);

        const request = {
            method: 'GET',
            headers
        };

        //TODO:should update the SDK first then change this to a proper call using it.
        return fetch(`${config.API_URL}/share/${userId}/kano-draw`, request)
            .then((res) => {
                return res.json();
            });
    }
};

export default MakeArtService;
