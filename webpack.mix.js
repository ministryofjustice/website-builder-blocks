const mix_ = require('laravel-mix');
// Load the full lodash build.
const _ = require('lodash');

mix_.webpackConfig({
    module: {
        rules: [
            {
                test: /.scss/,
                enforce: 'pre',
                loader: 'import-glob-loader'
            }
        ]
    },
    externals: {
        lodash: 'lodash'
    }
})

.setPublicPath('build/')
.sass('style.scss', 'style-frontend.min.css')
.sass('style-gutenburg.scss', 'style-gutenburg.min.css')

if (mix_.inProduction()) {
    mix_.version();
} else {
    mix_.sourceMaps();
}
