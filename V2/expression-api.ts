import type { ExpressionValue, UserFunction } from './value-types.ts';
import { ExpressionParser } from './expression-parser.ts';
import { formatReal, isNegative, isOne, isZero, negateReal } from './real.ts';
import { isComplex } from './scalar.ts';
import { isMatrix } from './matrix.ts';

export type { ExpressionValue, UserFunction } from './value-types.ts';

export function evaluateExpression(
	expression: string,
	variables: Readonly<Record<string, ExpressionValue>>,
	functions: Readonly<Record<string, UserFunction>> = {}
): ExpressionValue {
	return new ExpressionParser(expression, variables, functions).parse();
}

export function formatExpressionValue(value: ExpressionValue): string {
	if (isMatrix(value)) return value.rows.map((row) => `[ ${row.map(formatExpressionValue).join(' , ')} ]`).join('\n');
	if (!isComplex(value)) return formatReal(value);
	if (isZero(value.imaginary)) return formatReal(value.real);
	const negative = isNegative(value.imaginary);
	const magnitude = negative ? negateReal(value.imaginary) : value.imaginary;
	const imaginaryText = isOne(magnitude) ? 'i' : `${formatReal(magnitude)}i`;
	if (isZero(value.real)) return `${negative ? '-' : ''}${imaginaryText}`;
	return `${formatReal(value.real)} ${negative ? '-' : '+'} ${imaginaryText}`;
}