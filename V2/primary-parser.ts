import type { ExpressionValue, UserFunction } from './value-types.ts';
import { parseRational } from './rational.ts';
import { isComplex, complex, ZERO, negateScalarValue, squareRoot } from './scalar.ts';
import { isMatrix } from './matrix.ts';
import { toNumber } from './real.ts';
import { parseMatrixLiteral } from './matrix-parser.ts';
import { TokenStream } from './token-stream.ts';

type ParseExpression = (minimumPrecedence?: number) => ExpressionValue;
type EvaluateExpression = (expression: string, variables: Readonly<Record<string, ExpressionValue>>) => ExpressionValue;

const mathFunctions: Record<string, (...args: number[]) => number> = {
	sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log,
	log10: Math.log10, abs: Math.abs, exp: Math.exp
};

export function parsePrimary(
	stream: TokenStream,
	parseExpression: ParseExpression,
	variables: Readonly<Record<string, ExpressionValue>>,
	functions: Readonly<Record<string, UserFunction>>,
	evaluate: EvaluateExpression
): ExpressionValue {
	const token = stream.next();
	if (!token) throw new Error('Expected a value');
	if (token.value === '+' || token.value === '-') {
		const value = parseExpression(3);
		if (token.value === '+') return value;
		if (isMatrix(value)) return { kind: 'matrix', rows: value.rows.map((row) => row.map(negateScalarValue)) };
		return negateScalarValue(value);
	}
	if (token.value === '(') {
		const value = parseExpression();
		stream.expect(')');
		return value;
	}
	if (token.value === '[') return parseMatrixLiteral(stream, parseExpression);
	if (token.kind === 'number') return parseRational(token.value);
	if (token.kind !== 'identifier') throw new Error(`Unexpected token '${token.value}'`);
	if (stream.peek()?.value === '(') return parseFunction(token.value, stream, parseExpression, variables, functions, evaluate);
	if (token.value === 'i') return complex(ZERO, { kind: 'rational', numerator: 1n, denominator: 1n });
	const value = variables[token.value];
	if (value === undefined) throw new Error(`Unknown variable '${token.value}'`);
	return value;
}

function parseFunction(
	name: string,
	stream: TokenStream,
	parseExpression: ParseExpression,
	variables: Readonly<Record<string, ExpressionValue>>,
	functions: Readonly<Record<string, UserFunction>>,
	evaluate: EvaluateExpression
): ExpressionValue {
	const fn = mathFunctions[name];
	const userFunction = functions[name];
	if (!fn && !userFunction) throw new Error(`Unknown function '${name}'`);
	stream.expect('(');
	const argument = parseExpression();
	stream.expect(')');
	if (userFunction) return evaluate(userFunction.expression, { ...variables, [userFunction.parameter]: argument });
	if (isMatrix(argument)) throw new Error(`${name} does not accept a matrix`);
	if (name === 'abs' && isComplex(argument)) return Math.hypot(toNumber(argument.real), toNumber(argument.imaginary));
	if (name === 'sqrt') return squareRoot(argument);
	if (isComplex(argument)) throw new Error(`${name} requires a real argument`);
	return fn!(toNumber(argument));
}