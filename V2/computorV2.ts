import { solvePolynomial } from '../V1/polynomial.ts';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

class ComputorV2{
	private variables: Record<string, number> = {
		pi:Math.PI,
		e: Math.E,
		ans: 0
	}

	private history: string[] = [];

	public async start() : Promise<void> {
		const rl = readline.createInterface({ input, output });
		console.log("Welcome to computorV2 Maths Advance Calculator");

		try {
			for await (const rawLine of rl) {
				const line = rawLine.trim();
				if (!line) continue;
				this.history.push(line);
				const lower = line.toLowerCase();
				if (lower == "exit" || lower == "quit") {
					console.log("Exiting ......");
					break;
				}
				else if (lower == "help") {
					this.showHelp();
				}
				else if (lower == "history" || lower == "histroy") {
					this.showHistory();
				}
				else if (lower == "vars") {
					this.showVars();
				}
				else {
					this.evaluteInstruction(line);
				}
			}
		}
		finally {
			rl.close();
		}
	}
	private evaluteInstruction(instruction: string): void{
		try{
			const trimmed = instruction.trim();
			const assignmentIndex = trimmed.indexOf('=');
			if (assignmentIndex >= 0) {
				if (trimmed.split('=').length !== 2) {
					throw new Error("Malformed assignment: expected exactly one '='");
				}
				const varName = trimmed.slice(0, assignmentIndex).trim();
				const expression = trimmed.slice(assignmentIndex + 1).trim();

				if (!expression) {
					throw new Error("Assignment requires an expression on the right-hand side");
				}
				if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(varName)) {
					throw new Error(`Invalid variable name: '${varName}'`);
				}
				const result = this.compute(expression);
				this.variables[varName] = result;
				this.variables.ans = result;
				console.log(`${varName} = ${result}`);
				return;
			}

			const result = this.compute(trimmed);
			console.log(result);
			this.variables.ans = result;
		}
		catch (err: any) {
			console.error(`Error: ${err.message}`);
		}
	}

	private showHelp(): void {
        console.log("\nSupported features:");
        console.log("  • Operations: +, -, *, /, ** (power), % (modulus)");
        console.log("  • Functions : sin(x), cos(x), tan(x), sqrt(x), log(x), abs(x)");
        console.log("  • Assignment: x = 12 * 4");
        console.log("  • Constants : pi, e");
        console.log("  • Chain calculations using 'ans' (stores the last output)");
        console.log("\nShell management commands:");
        console.log("  vars     - Show all user-defined and system variables");
        console.log("  history  - Show previous commands entered this session");
        console.log("  exit     - Exit the program\n");
    }

	private showHistory(): void {
        console.log("\nCommand History:");
        this.history.slice(0, -1).forEach((cmd, idx) => {
            console.log(`  ${idx + 1}: ${cmd}`);
        });
        console.log();
    }

	private showVars(): void {
        console.log("\nCurrent Variables:");
        for (const [k, v] of Object.entries(this.variables)) {
            console.log(`  ${k} = ${v}`);
        }
        console.log();
    }

	// need to start off from here
	private compute(expression: string): number {
        const keys = Object.keys(this.variables);
        const values = Object.values(this.variables);
		
        const mathKeys = ['sin', 'cos', 'tan', 'sqrt', 'log', 'log10', 'abs', 'exp'];
        const mathValues = mathKeys.map((k) => (Math as any)[k]);
		
        const allKeys = [...keys, ...mathKeys];
        const allValues = [...values, ...mathValues];

        try {
            const fn = new Function(...allKeys, `return (${expression});`);
            const result = fn(...allValues);
            
            if (typeof result !== 'number' || Number.isNaN(result)) {
                throw new Error("Result is not a valid number");
            }
            return result;
        } catch (err: any) {
            throw new Error(`Malformed expression (${err.message})`);
        }
    }

}

async function main() {
    const interpreter = new ComputorV2();
    await interpreter.start();
}

main();
