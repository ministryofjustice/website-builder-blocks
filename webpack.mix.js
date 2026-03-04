const mix_ = require('laravel-mix');
const glob = require('glob');
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
.copy('./node_modules/@ministryofjustice/frontend/moj/all.js', 'build/moj-frontend.js')

const frontendFiles = glob.sync('src/**/frontend.js');
mix_.js(frontendFiles, 'frontend.min.js');



if (mix_.inProduction()) {
    mix_.version();
} else {
    mix_.sourceMaps();
}
