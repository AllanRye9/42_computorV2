import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

export async function runInteractive(handleLine: (line: string) => boolean): Promise<void> {
	const rl = readline.createInterface({ input, output });
	rl.setPrompt('> ');
	const prompt = () => {
		if (input.isTTY) rl.prompt();
	};
	prompt();
	try {
		for await (const rawLine of rl) {
			const line = rawLine.trim();
			if (!line) {
				prompt();
				continue;
			}
			if (!handleLine(line)) break;
			prompt();
		}
	} finally {
		rl.close();
	}
}