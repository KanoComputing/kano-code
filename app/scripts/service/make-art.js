import config from '../config';

const MakeArtService = {
    getImages (userId) {
        let headers = new Headers();
        headers.append('Authorization', app.sdk.auth.getToken());

        const request = {
            method: 'GET',
            headers
        };

        return app.sdk.api.share.get.byUsername({userId: userId, app: 'kano-draw'})
            .then((res) => {
                return res.body;
            });
    }
};

export default MakeArtService;
