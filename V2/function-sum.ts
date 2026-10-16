export interface FunctionTerm {
	sign: number;
	expression: string;
}

export function splitFunctionSum(expression: string): FunctionTerm[] {
	const terms: FunctionTerm[] = [];
	let depth = 0;
	let start = 0;
	let sign = 1;
	if (expression.startsWith('-') || expression.startsWith('+')) {
		sign = expression[0] === '-' ? -1 : 1;
		start = 1;
	}
	for (let index = start; index < expression.length; index++) {
		const character = expression[index];
		if (character === '(' || character === '[') depth++;
		else if (character === ')' || character === ']') depth--;
		if (depth !== 0 || (character !== '+' && character !== '-')) continue;
		let previous = index - 1;
		while (previous >= start && expression[previous] === ' ') previous--;
		if (previous < start || !/[A-Za-z0-9_$)\]]/.test(expression[previous]) || /[eE]/.test(expression[previous])) continue;
		const term = expression.slice(start, index).trim();
		if (term) terms.push({ sign, expression: term });
		sign = character === '-' ? -1 : 1;
		start = index + 1;
	}
	const finalTerm = expression.slice(start).trim();
	if (finalTerm) terms.push({ sign, expression: finalTerm });
	return terms;
}

export function flattenFunctionSum(terms: FunctionTerm[]): FunctionTerm[] {
	const flattened: FunctionTerm[] = [];
	for (const term of terms) {
		let candidate = term.expression;
		let innerTerms: FunctionTerm[] = [];
		while (hasOuterParentheses(candidate)) {
			const inside = candidate.slice(1, -1);
			const split = splitFunctionSum(inside);
			if (split.length > 1) {
				candidate = inside;
				innerTerms = split;
				break;
			}
			candidate = inside;
		}
		if (innerTerms.length === 0) {
			flattened.push(term);
			continue;
		}
		flattened.push(...flattenFunctionSum(innerTerms.map((inner) => ({
			sign: term.sign * inner.sign,
			expression: stripAtomicParentheses(inner.expression)
		}))));
	}
	return flattened;
}

function stripAtomicParentheses(expression: string): string {
	while (hasOuterParentheses(expression)) {
		const inside = expression.slice(1, -1);
		if (!/^(?:[A-Za-z_$][A-Za-z0-9_$]*|\d+(?:\.\d+)?)$/.test(inside)) break;
		expression = inside;
	}
	return expression;
}

function hasOuterParentheses(expression: string): boolean {
	if (!expression.startsWith('(') || !expression.endsWith(')')) return false;
	let depth = 0;
	for (let index = 0; index < expression.length; index++) {
		if (expression[index] === '(') depth++;
		else if (expression[index] === ')' && --depth === 0) return index === expression.length - 1;
	}
	return false;
}