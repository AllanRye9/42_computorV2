import { runInteractive } from './interactive-cli.ts';
import { handleCommand } from './interpreter-commands.ts';
import type { ExpressionValue, UserFunction } from './value-types.ts';

export class ComputorV2 {
	private readonly state = {
		variables: { pi: Math.PI, e: Math.E, ans: 0 } as Record<string, ExpressionValue>,
		functions: {} as Record<string, UserFunction>
	};
	private readonly history: string[] = [];

	public start(): Promise<void> {
		return runInteractive((line) => handleCommand(line, this.state, this.history));
	}
}