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

To pull a release with Composer, add a `package` repository pointing at the
release asset and require it, e.g. for version `2.0.4`:

```json
{
  "repositories": [
    {
      "type": "package",
      "package": {
        "name": "ministryofjustice/website-builder-blocks",
        "version": "2.0.4",
        "type": "wordpress-plugin",
        "dist": {
          "url": "https://github.com/ministryofjustice/website-builder-blocks/releases/download/2.0.4/website-builder-blocks-2.0.4.zip",
          "type": "zip"
        }
      }
    }
  ],
  "require": {
    "ministryofjustice/website-builder-blocks": "2.0.4"
  }
}
```

Bump both the `version` and the `dist.url` (and the `require` constraint)
whenever you pull a newer release. This requires
[`composer/installers`](https://packagist.org/packages/composer/installers)
(or an equivalent `installer-paths` config) to place `wordpress-plugin`
packages into `wp-content/plugins/`.

## Prerequesites
* NPM (For developers needing to compile assets)

## Coding guidelines
This plugin follows
* Standards set by the Wordpress organisation https://codex.wordpress.org/Writing_a_Plugin.
* PHP Framework Interop Group's standards http://www.php-fig.org/
