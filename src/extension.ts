import * as vscode from "vscode";
import * as path from "path";
import { MODULE_NAME, PARAM_NAME } from './constants';
import { logVerbose, logInfoInternal, logWarnInternal, logErrorInternal } from "./log";

// === Configuration parameters

let linkedExtensions: string[] = [];
let excludedExtensions: string[] = [];
let revealOutputOnInfo = false;
let revealOutputOnWarn = false;
let revealOutputOnError = false;
let showVerbose = true;

// === Helper functions

function toString<T>(t: T): string {
	return `${t}`;
}

function arrayToString<T>(xs: T[]): string {
	const joined = xs.map(x => `"${x}"`).join(", ");
	return `[${joined}]`;
}

// === Log functions

function logInfo(message: string) {
	logInfoInternal(message, revealOutputOnInfo);
}
function logWarn(message: string) {
	logWarnInternal(message, revealOutputOnWarn);
}
function logError(message: string, error?: unknown) {
	logErrorInternal(message, revealOutputOnError, error);
}

function showVerboseInstruction() {
	if (showVerbose) {
		logVerbose("Tip: You can disable automatic output panel display by setting `Reveal Output On xxxx` to false in your settings.");
	}
}

// ===

function getConfParamOf<T>(paramName: string, defaultValue: T, toStringFunc: (value: T) => string) {
	const config = vscode.workspace.getConfiguration(MODULE_NAME);
	const param = config.get<T>(paramName);
	if (param !== undefined) {
		logInfo(`Loaded ${paramName}: ${toStringFunc(param)}`);
	} else {
		logError(`Loading parameter '${paramName}' failed.`);
	}
	return param ?? defaultValue;
}

function loadConfigParameters() {
	linkedExtensions    = getConfParamOf<string[]>(PARAM_NAME.linkedExtensions, [".uid"], arrayToString);
	excludedExtensions  = getConfParamOf<string[]>(PARAM_NAME.excludeExtensions, [], arrayToString);
	revealOutputOnInfo  = getConfParamOf<boolean>(PARAM_NAME.revealOutputOnInfo, true, toString);
	revealOutputOnWarn  = getConfParamOf<boolean>(PARAM_NAME.revealOutputOnWarn, true, toString);
	revealOutputOnError = getConfParamOf<boolean>(PARAM_NAME.revealOutputOnError, true, toString);
	showVerbose         = getConfParamOf<boolean>(PARAM_NAME.showVerbose, true, toString);

	if (revealOutputOnInfo) { showVerboseInstruction(); }
}

/**
 * Checks if the current workspace contains a Godot project,
 * by looking for a project.godot file in any workspace folder.
 */
async function isGodotProject(): Promise<boolean> {
	if (!vscode.workspace.workspaceFolders) {
		return false;
	}

	for (const folder of vscode.workspace.workspaceFolders) {
		const godotProjectFile = vscode.Uri.joinPath(folder.uri, "project.godot");
		try {
			await vscode.workspace.fs.stat(godotProjectFile);
			logInfo(`Found Godot project at: ${folder.uri.fsPath}`);
			return true;
		} catch {
			continue;
		}
	}
	return false;
}

/**
 * Called when the extension is activated.
 * Registers the file rename listener and config change watcher.
 */
export async function activate(context: vscode.ExtensionContext) {
	logInfoInternal("Activating extension godot-uid-sync ...", false); // revealOutput should be false for non-Godot projects.

	// Only proceed if the workspace is a Godot project
	const enabledOnlyInGodotProjects = getConfParamOf<boolean>(PARAM_NAME.enabledOnlyInGodotProjects, false, toString);
	if (enabledOnlyInGodotProjects) {
		const isGodot = await isGodotProject();
		if (!isGodot) {
			logInfoInternal("Not a Godot project. Skipping activation.", false); // revealOutput should be false for non-Godot projects.
			return;
		}
	}

	loadConfigParameters();

	// Listen for file renames/moves and rename corresponding .uid files
	const renameListener = vscode.workspace.onDidRenameFiles(async (event) => {
		for (const file of event.files) {
			for (const linkedExt of linkedExtensions) {
				const oldUri = file.oldUri;
				const newUri = file.newUri;

				// --- Skip if not a file
				let isNotFile = false;
				try {
					const stat = await vscode.workspace.fs.stat(newUri);
					if (stat.type !== vscode.FileType.File) {
						isNotFile = true;
					}
				} catch {
					// Do not treat errors as "non-file"; continue to check for .uid
					logWarn(`Failed to stat ${newUri.fsPath}, proceeding anyway.`);
					isNotFile = false;
				}
				if (isNotFile) {
					logInfo(`Skipping directory: ${oldUri.fsPath}`);
					continue;
				}

				// --- Determine if it's a rename or move (based on relative path difference)
				const moved = vscode.workspace.asRelativePath(oldUri) !== vscode.workspace.asRelativePath(newUri);
				const moveOrRename = moved ? "move" : "rename";
				logInfo(`Detected ${moveOrRename}: ${oldUri.fsPath} -> ${newUri.fsPath}`);

				// --- Check file extension and skip if excluded
				const ext = path.extname(oldUri.fsPath);
				if (ext && excludedExtensions.includes(ext)) {
					logInfo(`Skipped (extension excluded): ${oldUri.fsPath}`);
					continue;
				}

				// --- Construct linked extension filenames
				const oldLinkedExtUri = vscode.Uri.file(oldUri.fsPath + linkedExt);
				const newLinkedExtUri = vscode.Uri.file(newUri.fsPath + linkedExt);

				// --- Check if linked extension file exists
				let missinglinkedExt = false;
				try {
					await vscode.workspace.fs.stat(oldLinkedExtUri);
					missinglinkedExt = false;
				} catch (err: any) {
					logInfo(`${linkedExt} file not found for: ${oldUri.fsPath}`);
					missinglinkedExt = true;
				}
				// Skip if the linked extension file doesn not exist
				if (missinglinkedExt) { continue; }

				// --- Rename the linked extension file
				try {
					await vscode.workspace.fs.rename(oldLinkedExtUri, newLinkedExtUri, { overwrite: false });
					logInfo(`'${linkedExt}' file ${moveOrRename}d: ${oldLinkedExtUri.fsPath} -> ${newLinkedExtUri.fsPath}`);
				} catch (err) {
					logError(`Failed to rename '${linkedExt}' file ${oldLinkedExtUri.fsPath}:`, err);
					vscode.window.showErrorMessage(`Failed to rename '${linkedExt}' file ${oldLinkedExtUri.fsPath}: ${err}`);
				}

			}
		}

		if (revealOutputOnInfo) { showVerboseInstruction(); }
	});
	context.subscriptions.push(renameListener);

	// Watch for configuration changes
	const configWatcher = vscode.workspace.onDidChangeConfiguration((event) => {

		const params = [
			PARAM_NAME.excludeExtensions,
			PARAM_NAME.linkedExtensions,
			PARAM_NAME.revealOutputOnInfo,
			PARAM_NAME.revealOutputOnWarn,
			PARAM_NAME.revealOutputOnError,
			PARAM_NAME.showVerbose,
		];

		const shouldReloadConfig = params.some(param => event.affectsConfiguration(MODULE_NAME + "." + param));
		if (shouldReloadConfig) {
			loadConfigParameters();
		}

		if (event.affectsConfiguration(MODULE_NAME + "." + PARAM_NAME.enabledOnlyInGodotProjects)) {
			vscode.window.showInformationMessage(
				"Change to `enabledOnlyInGodotProjects` will take effect after reloading the window.",
				"Reload Window"
			).then((selected) => {
				if (selected === "Reload Window") {
					vscode.commands.executeCommand("workbench.action.reloadWindow");
				}
			});
		}
	});
	context.subscriptions.push(configWatcher);
}

/**
 * Called when the extension is deactivated.
 */
export function deactivate() { }
