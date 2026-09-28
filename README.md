# Website Builder Blocks

## Features

This plugin adds the following custom blocks,
* Accordion
* Filterable listing
* HM Government logo SVG
* Reveal
* Table of contents

## Issues
Raise issues via
[GitHub issues](https://github.com/ministryofjustice/website-builder-blocks/issues)

## Installation
Download this repository, unzip and copy the folder into your WordPress plugin file directory.

### Installing via Composer

Each version tag (`X.Y.Z`, matching the `Version:` header in
`website-builder-blocks.php`) triggers a
[GitHub Action](.github/workflows/release.yml) that compiles the CSS/JS
assets and attaches a ready-to-use plugin zip to the matching
[GitHub release](https://github.com/ministryofjustice/website-builder-blocks/releases).

The same workflow publishes a Composer repository listing every release to
GitHub Pages. Add it once and require versions as normal:

```json
{
  "repositories": [
    {
      "type": "composer",
      "url": "https://ministryofjustice.github.io/website-builder-blocks/"
    }
  ],
  "require": {
    "ministryofjustice/website-builder-blocks": "^2.0"
  }
}
```

Installing into `wp-content/plugins/` relies on
[`composer/installers`](https://packagist.org/packages/composer/installers)
(or an equivalent `installer-paths` config).

## Prerequesites
* NPM (For developers needing to compile assets)

## Coding guidelines
This plugin follows
* Standards set by the Wordpress organisation https://codex.wordpress.org/Writing_a_Plugin.
* PHP Framework Interop Group's standards http://www.php-fig.org/
