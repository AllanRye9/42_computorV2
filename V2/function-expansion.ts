import type { UserFunction } from './value-types.ts';
import { formatFunctionExpression } from './function-format.ts';

export function expandUserFunctionCalls(
	expression: string,
	functions: Readonly<Record<string, UserFunction>>,
	depth = 0
): string | undefined {
	if (depth > 32) throw new Error('Function composition exceeds the maximum nesting depth');
	let result = '';
	let changed = false;
	let position = 0;
	while (position < expression.length) {
		const identifier = expression.slice(position).match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
		if (!identifier) {
			result += expression[position++];
			continue;
		}
		const name = identifier[0];
		let open = position + name.length;
		while (expression[open] === ' ') open++;
		const fn = functions[name];
		if (!fn || expression[open] !== '(') {
			result += name;
			position += name.length;
			continue;
		}
		const close = findMatchingParen(expression, open);
		const argument = expandUserFunctionCalls(expression.slice(open + 1, close), functions, depth + 1)
			?? expression.slice(open + 1, close);
		const parameter = new RegExp(`(^|[^A-Za-z0-9_$])${escapeRegExp(fn.parameter)}(?=$|[^A-Za-z0-9_$])`, 'g');
		const substituted = fn.expression.replace(parameter, `$1(${argument})`);
		const body = expandUserFunctionCalls(substituted, functions, depth + 1) ?? substituted;
		result += `(${formatFunctionExpression(body)})`;
		position = close + 1;
		changed = true;
	}
	return changed ? result : undefined;
}

function findMatchingParen(expression: string, open: number): number {
	let depth = 0;
	for (let index = open; index < expression.length; index++) {
		if (expression[index] === '(') depth++;
		else if (expression[index] === ')' && --depth === 0) return index;
	}
	throw new Error('Unclosed function call');
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}