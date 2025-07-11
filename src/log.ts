import * as vscode from 'vscode';

const output = vscode.window.createOutputChannel('Godot UID Sync');

function withContext(message: string): string {
	return `[GodotUIDSync] ${message}`;
}

function getTimestamp(): string {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, '0');

	const year = now.getFullYear();
	const month = pad(now.getMonth() + 1); // 0-indexed
	const day = pad(now.getDate());
	const hour = pad(now.getHours());
	const minute = pad(now.getMinutes());
	const second = pad(now.getSeconds());

	return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function logVerbose(message: string) {
	output.appendLine(`${getTimestamp()} [verbose] ${message}`);
}

export function logInfoInternal(message: string, revealOutput: boolean) {
	output.appendLine(`${getTimestamp()} [info] ${message}`);
	console.log(withContext(message));
	if (revealOutput) {
		output.show(true);
	}
}

export function logWarnInternal(message: string, revealOutput: boolean) {
	output.appendLine(`${getTimestamp()} [warn] ${message}`);
    console.warn(withContext(message));
	if (revealOutput) {
		output.show(true);
	}
}

export function logErrorInternal(message: string, revealOutput: boolean, err?: unknown) {
	output.appendLine(`${getTimestamp()} [error] ${message}`);
    console.log(message);

	if (err instanceof Error) {
		output.appendLine(err.stack ?? err.message);
	}
	console.error(withContext(message), err);

	if (revealOutput) {
		output.show(true);
	}
}
