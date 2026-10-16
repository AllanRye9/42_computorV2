import type { ExpressionValue, UserFunction } from './value-types.ts';
import { evaluateExpression, formatExpressionValue } from './expression-api.ts';

export function showHelp(): void {
	console.log('\nSupported features:');
	console.log('  • Numbers: integers, decimals, and rational fractions (for example, 3/4)');
	console.log('  • Complex numbers: use i (for example, 1/2 + 3/4i)');
	console.log('  • Matrices: use [[1, 2], [3, 4]]; supports +, -, *, /, and integer powers');
	console.log('  • Operations: +, -, *, /, ** or ^ (power), % (modulus)');
	console.log('  • Functions: sin(x), cos(x), tan(x), sqrt(x), log(x), abs(x)');
	console.log('  • User functions: define with f(x) = expression, then call f(value)');
	console.log('  • Assignment: x = 12 * 4');
	console.log('  • Constants: pi, e');
	console.log("  • Chain calculations using 'ans' (stores the last output)");
	console.log('\nShell management commands:');
	console.log('  vars     - Show all user-defined and system variables');
	console.log('  history  - Show previous commands entered this session');
	console.log('  exit     - Exit the program\n');
}

export function showHistory(history: string[]): void {
	console.log('\nCommand History:');
	history.slice(0, -1).forEach((command, index) => console.log(`  ${index + 1}: ${command}`));
	console.log();
}

export function showVariables(variables: Record<string, ExpressionValue>): void {
	console.log('\nCurrent Variables:');
	for (const [name, value] of Object.entries(variables)) console.log(`  ${name} = ${formatExpressionValue(value)}`);
	console.log();
}

export function computeExpression(
	expression: string,
	variables: Record<string, ExpressionValue>,
	functions: Record<string, UserFunction>
): ExpressionValue {
	try {
		return evaluateExpression(expression, variables, functions);
	} catch (error) {
		throw new Error(`Malformed expression (${error instanceof Error ? error.message : String(error)})`);
	}
}