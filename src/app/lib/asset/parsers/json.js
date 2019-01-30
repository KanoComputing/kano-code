export default {
    test: /\.json$/,
    parser: (r) => {
        return r.json();
    },
};
