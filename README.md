[English](https://github.com/masatoko/godot-uid-sync/blob/main/README.md) | [日本語](https://github.com/masatoko/godot-uid-sync/blob/main/README-ja.md)

# Godot UID Sync

**Godot UID Sync** is a Visual Studio Code extension that automatically synchronizes `.uid` files when Godot resource files (e.g., `.tscn`, `.gd`, `.cs`, `.gdshader`, etc.) are renamed or moved. This helps prevent broken references in Godot projects by keeping `.uid` files aligned with their corresponding assets.

## Features

* Automatically renames or moves `.uid` files along with associated Godot resources.
* Respects project-specific settings to activate only when `project.godot` is found.
* Supports exclusion of certain file types from syncing.
* Customizable list of linked extensions (e.g., `.uid`, `.meta`).
* Configurable logging options for output visibility.

## Requirements

To prevent clutter in the file explorer, it is recommended to hide `.uid` files by adding the following to your VS Code `settings.json`:

```json
"files.exclude": {
  "**/*.uid": true
}
```

## Extension Settings

This extension contributes the following settings:

* `godotUidSync.enabledOnlyInGodotProjects` (boolean, default: `false`):
  Only activate if a `project.godot` file exists in the workspace.

* `godotUidSync.excludeExtensions` (string\[], default: `[]`):
  File extensions to ignore during `.uid` syncing. Include the dot (e.g., `.png`).

* `godotUidSync.linkedExtensions` (string\[], default: `[".uid"]`):
  Extensions to sync alongside primary Godot resource files.

* `godotUidSync.revealOutputOnInfo` (boolean, default: `true`):
  Show the output panel on informational messages.

* `godotUidSync.revealOutputOnWarn` (boolean, default: `true`):
  Show the output panel on warnings.

* `godotUidSync.revealOutputOnError` (boolean, default: `true`):
  Show the output panel on errors.

* `godotUidSync.showVerbose` (boolean, default: `true`):
  Display extra tips and verbose internal logs.
