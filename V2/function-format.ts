import { evaluateExpression, formatExpressionValue } from './expression-api.ts';
import type { ExpressionValue } from './value-types.ts';
import { flattenFunctionSum, splitFunctionSum } from './function-sum.ts';

export function formatFunctionExpression(expression: string): string {
	const formatted = expression.trim()
		.replace(/(^|[^A-Za-z0-9_$])\(([A-Za-z_$][A-Za-z0-9_$]*)\)/g, '$1$2')
		.replace(/\s*\*\s*/g, ' * ')
		.replace(/(\d)\s*([A-Za-z_$])/g, '$1 * $2')
		.replace(/\s*([/%])\s*/g, ' $1 ')
		.replace(/([A-Za-z_$0-9)\]])\s*([+-])\s*(?=[A-Za-z_$0-9(])/g, '$1 $2 ')
		.replace(/ {2,}/g, ' ');
	const terms = flattenFunctionSum(splitFunctionSum(formatted));
	const constants: string[] = [];
	const resultTerms = [];
	let constantPosition: number | undefined;
	const constantValues: Record<string, ExpressionValue> = { pi: Math.PI, e: Math.E };
	for (const term of terms) {
		try {
			const result = formatExpressionValue(evaluateExpression(term.expression, constantValues));
			if (!isNumeric(result)) {
				resultTerms.push(term);
				continue;
			}
			constantPosition = resultTerms.length;
			constants.push(`${term.sign < 0 ? '-' : '+'}(${term.expression})`);
		} catch {
			resultTerms.push(term);
		}
	}
	if (constants.length > 0) {
		const result = formatExpressionValue(evaluateExpression(constants.join(' '), constantValues));
		if (result !== '0') resultTerms.splice(constantPosition, 0, { sign: result.startsWith('-') ? -1 : 1, expression: result.replace(/^[+-]/, '') });
	}
	if (resultTerms.length === 0) return '0';
	return resultTerms.map((term, index) => index === 0
		? `${term.sign < 0 ? '-' : ''}${term.expression}`
		: `${term.sign < 0 ? ' - ' : ' + '}${term.expression}`).join('');
}

function isNumeric(value: string): boolean {
	return /^[+-]?(?:\d+(?:\/\d+)?|(?:\d+\.\d*|\.\d+)(?:e[+-]?\d+)?)$/i.test(value);
}