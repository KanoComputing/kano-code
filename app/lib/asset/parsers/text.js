export default {
    test: /.*/,
    parser: (r) => {
        return r.text();
    },
};
