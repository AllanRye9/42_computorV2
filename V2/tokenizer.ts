import type { Token } from './value-types.ts';

export function tokenize(expression: string): Token[] {
	const tokens: Token[] = [];
	const pattern = /\s*((?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[A-Za-z_$][A-Za-z0-9_$]*|\*\*|[\[\]()+\-*/%^,;])/y;
	let position = 0;
	while (position < expression.length) {
		pattern.lastIndex = position;
		const match = pattern.exec(expression);
		if (!match) throw new Error(`Unexpected character '${expression[position]}'`);
		const value = match[1];
		const kind: Token['kind'] = /^\d|^\./.test(value) ? 'number' : /^[A-Za-z_$]/.test(value) ? 'identifier' : 'operator';
		tokens.push({ kind, value });
		position = pattern.lastIndex;
	}
	return tokens;
}