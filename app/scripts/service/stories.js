let cache = {},
    stories = [{
        name: 'Random colors',
        id: 'background_color',
        description: 'I\'m preparing the editor for you to make an app that control colors. Almost there...',
        image: '/assets/stories/background_color/background-color.svg',
        icon: '/assets/stories/background_color/color-icon.png',
        progress: {
            group: "basic",
            storyNo: 1
        },
        available: true
    },{
        name: 'Sports ticker',
        id: 'sports_round',
        description: 'I\'m preparing the editor for you to make an app that displays sports news. Almost there...',
        image: '/assets/stories/sports_round/sports-round.svg',
        icon: '/assets/stories/sports_round/sports-icon.png',
        progress: {
            group: "basic",
            storyNo: 2
        },
        available: true
    },{
        name: 'ISS tracker',
        id: 'space_tracker',
        description: 'I\'m preparing the editor for you to make an app that tracks the International Space Station. Almost there...',
        image: '/assets/stories/space_tracker/space-tracker.svg',
        icon: '/assets/stories/space_tracker/iss-icon.png',
        progress: {
            group: "basic",
            storyNo: 3
        },
        available: true
    },{
        name: 'Windy mountains',
        id: 'weather',
        image: '/assets/stories/weather/weather.svg',
        icon: '/assets/stories/weather/mountain-icon.png',
        progress: {
            group: "basic",
            storyNo: 4
        },
        available: false
    }],
    Stories;

export default Stories = {
    list () {
        return Promise.resolve(stories);
    },
    /**
     * Get a story from a given id
     * @param  {String} id Id of the story requested
     * @return {Promise}   promise that will resolve with the story requested
     */
    getById (id) {
        let storyBase;
        // Lookup the cache and return if exists
        if (cache[id]) {
            return Promise.resolve(cache[id]);
        }
        // Get the base definition from the stories list
        for (let index in stories) {
            if (stories[index].id === id) {
                storyBase = stories[index];
                break;
            }
        }
        // Fetch the story definition from the assets
        return fetch(`/assets/stories/${id}/index.json`)
            .then(r => r.json())
            .then(data => {
                // Merge the base and definition, store in cache and return it
                let story = Object.assign({}, storyBase, data);
                cache[id] = story;
                return story;
            });
    },
    /**
     * Get a scene from a story and a scene index
     * @param  {Object} story A story object definition, must contain an array of scenes
     * @param  {Number} index Index of the requested scene in the story
     * @return {Promise}      Promise that will resolve with the requested scene definition
     */
    getSceneByIndex (story, index) {
        // Grab the scene object from the story
        let scene = story.scenes[index];
        // Check if there is remote data to fetch
        if (!scene.data && scene.data_path) {
            // Fetch the additional data
            return fetch(`/assets/stories/${story.id}/${scene.data_path}`)
                .then(r => r.json())
                .then((data) => {
                    // Update the scene definition
                    scene.data = data;
                    // Delete the remote data definition key
                    delete scene.data_path;
                    return scene;
                });
        }
        // Return the scene definition if no additional data is required
        return Promise.resolve(scene);
    }
};
