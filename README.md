[English](https://github.com/masatoko/godot-uid-sync/blob/main/README.md) | [日本語](https://github.com/masatoko/godot-uid-sync/blob/main/README-ja.md)

# Godot UID Sync

**Godot UID Sync** is a Visual Studio Code extension that automatically synchronizes `.uid` files when Godot resource files (e.g., `.tscn`, `.gd`, `.cs`, `.gdshader`, etc.) are renamed or moved. This helps prevent broken references in Godot projects by keeping `.uid` files aligned with their corresponding assets.

![Automatic UID Sync on Rename](images/uid-auto-sync.png)

## Features

* Automatically renames or moves `.uid` files along with associated Godot resources.
* Respects project-specific settings to activate only when `project.godot` is found.
* Supports exclusion of certain file types from syncing.
* Customizable list of linked extensions (e.g., `.uid`, `.meta`).
* Configurable logging options for output visibility.

## Recommended Settings

To prevent clutter in the file explorer, it is recommended to hide `.uid` files by adding the following to your VS Code `settings.json`:

```json
"files.exclude": {
  "**/*.uid": true
}
```

## Recommended: Check the Output Log

When you rename a file, I recommend checking the **"Output" tab** to ensure that the `.uid` file (and any other linked extensions) was renamed correctly.  
If nothing appears in the output, it likely means that no UID renaming was performed.

## Extension Settings

This extension contributes the following settings:

- **`godotUidSync.enabledOnlyInGodotProjects`** (boolean, default: `false`)  
  Only activate this extension if a `project.godot` file exists in the workspace. *(Requires window reload)*

- **`godotUidSync.excludeExtensions`** (string[], default: `[]`)  
  List of file extensions to **exclude** from rename/move monitoring for associated .uid files. Include the dot (e.g., `.png`).

- **`godotUidSync.linkedExtensions`** (string[], default: `[".uid"]`)  
  List of file extensions to rename together with associated Godot resources. Include the dot (e.g., `.uid`, `.meta`).

- **`godotUidSync.revealOutputOnInfo`** (boolean, default: `true`)  
  If `true`, the output panel will open on info messages. Logs are still written even if this is `false`.

- **`godotUidSync.revealOutputOnWarn`** (boolean, default: `true`)  
  If `true`, the output panel will open on warning messages. Logs are still written even if this is `false`.

- **`godotUidSync.revealOutputOnError`** (boolean, default: `true`)  
  If `true`, the output panel will open on error messages. Logs are still written even if this is `false`.

- **`godotUidSync.showVerbose`** (boolean, default: `true`)  
  Show additional tips or internal verbose logs in the output panel. Recommended to turn this off once you understand how the extension works.
