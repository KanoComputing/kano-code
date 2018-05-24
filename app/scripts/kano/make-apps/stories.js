let stories = [];

export const Stories = {};

Stories.getLang = function () {
    return 'en-US';
};

/**
 * Get a story from a given id
 * @param  {String} id Id of the story requested
 * @return {Promise}   promise that will resolve with the story requested
 */
Stories.getById = function (id) {
    let lang = Stories.getLang(),
        storyBase;
    // Lookup the cached stories and return if exists
    if (stories[id]) {
        return Promise.resolve(stories[id]);
    }
    // Get the base definition from the cached stories list
    for (let index in stories) {
        if (stories[index].id === id) {
            storyBase = stories[index];
            break;
        }
    }
    // Fetch the story definition from the assets
    return fetch(`/assets/stories/locales/${lang}/${id}/index.json`)
        .then(r => r.json())
        .then(data => {
            // Merge the base and definition, store in stories and return it
            let story = Object.assign({}, storyBase, data);
            stories[id] = story;
            return story;
        });
};
/**
 * Get a scene from a story and a scene index
 * @param  {Object} story A story object definition, must contain an array of scenes
 * @param  {Number} index Index of the requested scene in the story
 * @return {Promise}      Promise that will resolve with the requested scene definition
 */
Stories.getSceneByIndex = function (story, index) {
    // Grab the scene object from the story
    let scene = story.scenes[index],
        lang = Stories.getLang();
    // Check if there is remote data to fetch
    if (!scene.data && scene.data_path) {
        // Fetch the additional data
        return fetch(`/assets/stories/locales/${lang}/${story.id}/${scene.data_path}`)
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
};
