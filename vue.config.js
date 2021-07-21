const { dependencies } = require('./package.json');

module.exports = {
    chainWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            config.externals(
                Object.keys(dependencies)
                    .reduce((obj, dependency) => {
                        obj[dependency] = `commonjs2 ${dependency}`;
                        return obj;
                    }, {}),
            );
        }
    },
};
