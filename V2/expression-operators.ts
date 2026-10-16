import type { ExpressionValue, MatrixValue, ScalarValue } from './value-types.ts';
import { isMatrix, addMatrices, multiplyMatrices, scaleMatrix, powerMatrix, inverse } from './matrix.ts';
import { addScalarValues, divideScalarValues, isComplex, multiplyScalarValues, negateScalarValue, ONE } from './scalar.ts';
import { isRational, toNumber } from './real.ts';
import { parts } from './scalar.ts';

export function applyOperator(operator: string, left: ExpressionValue, right: ExpressionValue): ExpressionValue {
	switch (operator) {
		case '+':
			if (isMatrix(left) && isMatrix(right)) return addMatrices(left, right);
			if (isMatrix(left) || isMatrix(right)) throw new Error('Addition requires matrices with matching dimensions');
			return addScalarValues(left, right);
		case '-': return applyOperator('+', left, negate(right));
		case '*':
			if (isMatrix(left) && isMatrix(right)) return multiplyMatrices(left, right);
			if (isMatrix(left)) return scaleMatrix(left, right as ScalarValue);
			if (isMatrix(right)) return scaleMatrix(right, left as ScalarValue);
			return multiplyScalarValues(left, right);
		case '/':
			if (isMatrix(left) && isMatrix(right)) return multiplyMatrices(left, inverse(right));
			if (isMatrix(left)) return scaleMatrix(left, divideScalarValues(ONE, right as ScalarValue));
			if (isMatrix(right)) return scaleMatrix(inverse(right), left as ScalarValue);
			return divideScalarValues(left, right);
		case '%':
			if (isMatrix(left) || isMatrix(right) || isComplex(left) || isComplex(right)) throw new Error('Modulus requires real values');
			return toNumber(left) % toNumber(right);
		case '^':
		case '**': return power(left, right);
		default: throw new Error(`Unsupported operator '${operator}'`);
	}
}

function negate(value: ExpressionValue): ExpressionValue {
	return isMatrix(value)
		? { kind: 'matrix', rows: value.rows.map((row) => row.map(negateScalarValue)) }
		: negateScalarValue(value);
}

function power(base: ExpressionValue, exponent: ExpressionValue): ExpressionValue {
	if (isMatrix(base)) return powerMatrix(base, exponent as ScalarValue);
	if (isMatrix(exponent)) throw new Error('Exponent must be a scalar');
	const [exponentReal, exponentImaginary] = parts(exponent);
	if (!isZero(exponentImaginary)) throw new Error('Complex exponents are not supported');
	if (isRational(exponentReal) && exponentReal.denominator === 1n) {
		let remaining = exponentReal.numerator < 0n ? -exponentReal.numerator : exponentReal.numerator;
		let result: ScalarValue = ONE;
		let factor: ScalarValue = base;
		while (remaining > 0n) {
			if (remaining % 2n === 1n) result = multiplyScalarValues(result, factor);
			remaining /= 2n;
			if (remaining > 0n) factor = multiplyScalarValues(factor, factor);
		}
		return exponentReal.numerator < 0n ? divideScalarValues(ONE, result) : result;
	}
	if (isComplex(base)) throw new Error('A complex value requires an integer exponent');
	return Math.pow(toNumber(base), toNumber(exponentReal));
}

function isZero(value: import('./value-types.ts').RealPart): boolean {
	return isRational(value) ? value.numerator === 0n : value === 0;
}