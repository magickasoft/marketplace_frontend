const path = require('path');

module.exports = {
    plugins: [
        require('postcss-nested'),
        require('postcss-assets')(),
        require('postcss-short')(),
        require('postcss-import')({
            path: [
                path.resolve(__dirname, 'src')
            ]
        }),
        require('postcss-flexbugs-fixes')(),
        require('postcss-custom-media')(),
        require('postcss-custom-properties')(),
        require('autoprefixer')({
            browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9'
            ]
        })
    ]
};
