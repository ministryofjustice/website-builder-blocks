To generate the json files for wp.i18n, run the following command from the root of the plugin:

Use `--no-purge` to prevent translations from being deleted from the *.po files.

```bash
wp i18n make-json languages --no-purge
```

---

To generate the .mo files from the .po files, run the following command from the root of the plugin:

```bash
wp i18n make-mo languages
```
