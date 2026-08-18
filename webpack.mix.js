const mix_ = require("laravel-mix");
const glob = require("glob");
// Load the full lodash build.
const _ = require("lodash");

// Sass compiler options.
// quietDeps: mute deprecation warnings from node_modules deps (govuk-frontend etc.) we can't fix.
// silenceDeprecations: mute @import + slash-division deprecations until our own scss is migrated to @use.
const sassOptions = {
	sassOptions: {
		precision: 8,
		outputStyle: "expanded",
		quietDeps: true,
		silenceDeprecations: ["import", "slash-div", "global-builtin", "color-functions", "mixed-decls"],
	},
};

mix_
	.webpackConfig({
		module: {
			rules: [
				{
					test: /.scss/,
					enforce: "pre",
					loader: "import-glob-loader",
				},
			],
		},
		externals: {
			lodash: "lodash",
		},
	})

	.setPublicPath("build/")
	.sass("style.scss", "style-frontend.min.css", sassOptions)
	.sass("style-gutenburg.scss", "style-gutenburg.min.css", sassOptions);

const frontendFiles = glob.sync("src/**/frontend.js");
mix_.js(frontendFiles, "frontend.min.js");

if (mix_.inProduction()) {
	mix_.version();
} else {
	mix_.sourceMaps();
}
