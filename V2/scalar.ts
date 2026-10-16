import type { ComplexValue, ExpressionValue, RealPart, ScalarValue } from './value-types.ts';
import { rational } from './rational.ts';
import { addReal, divideReal, isNegative, isRational, isZero, multiplyReal, negateReal, subtractReal, toNumber } from './real.ts';

export const ZERO = rational(0n);
export const ONE = rational(1n);

export function isComplex(value: ExpressionValue): value is ComplexValue {
	return typeof value !== 'number' && value.kind === 'complex';
}

export function complex(real: RealPart, imaginary: RealPart): ComplexValue {
	return { kind: 'complex', real, imaginary };
}

export function parts(value: ScalarValue): [RealPart, RealPart] {
	return isComplex(value) ? [value.real, value.imaginary] : [value, ZERO];
}

export function valueFromParts(real: RealPart, imaginary: RealPart): ScalarValue {
	return isZero(imaginary) ? real : complex(real, imaginary);
}

export function addScalarValues(left: ScalarValue, right: ScalarValue): ScalarValue {
	const [leftReal, leftImaginary] = parts(left);
	const [rightReal, rightImaginary] = parts(right);
	return valueFromParts(addReal(leftReal, rightReal), addReal(leftImaginary, rightImaginary));
}

export function multiplyScalarValues(left: ScalarValue, right: ScalarValue): ScalarValue {
	const [leftReal, leftImaginary] = parts(left);
	const [rightReal, rightImaginary] = parts(right);
	return valueFromParts(
		subtractReal(multiplyReal(leftReal, rightReal), multiplyReal(leftImaginary, rightImaginary)),
		addReal(multiplyReal(leftReal, rightImaginary), multiplyReal(leftImaginary, rightReal))
	);
}

export function divideScalarValues(left: ScalarValue, right: ScalarValue): ScalarValue {
	const [leftReal, leftImaginary] = parts(left);
	const [rightReal, rightImaginary] = parts(right);
	const denominator = addReal(multiplyReal(rightReal, rightReal), multiplyReal(rightImaginary, rightImaginary));
	if (isZero(denominator)) throw new Error('Division by zero');
	return valueFromParts(
		divideReal(addReal(multiplyReal(leftReal, rightReal), multiplyReal(leftImaginary, rightImaginary)), denominator),
		divideReal(subtractReal(multiplyReal(leftImaginary, rightReal), multiplyReal(leftReal, rightImaginary)), denominator)
	);
}

export function negateScalarValue(value: ScalarValue): ScalarValue {
	return isComplex(value) ? valueFromParts(negateReal(value.real), negateReal(value.imaginary)) : negateReal(value);
}

export function subtractScalarValues(left: ScalarValue, right: ScalarValue): ScalarValue {
	return addScalarValues(left, negateScalarValue(right));
}

export function containsNaN(value: ExpressionValue): boolean {
	if (typeof value !== 'number' && value.kind === 'matrix') return value.rows.some((row) => row.some(containsNaN));
	const [real, imaginary] = parts(value as ScalarValue);
	return (typeof real === 'number' && Number.isNaN(real)) || (typeof imaginary === 'number' && Number.isNaN(imaginary));
}

export function squareRoot(value: ScalarValue): ScalarValue {
	if (isComplex(value)) {
		const real = toNumber(value.real);
		const imaginary = toNumber(value.imaginary);
		const magnitude = Math.hypot(real, imaginary);
		return complex(Math.sqrt((magnitude + real) / 2), Math.sign(imaginary || 1) * Math.sqrt((magnitude - real) / 2));
	}
	if (isNegative(value)) {
		const magnitude = negateReal(value);
		return complex(ZERO, isRational(magnitude) ? exactSquareRoot(magnitude) ?? Math.sqrt(toNumber(magnitude)) : Math.sqrt(toNumber(magnitude)));
	}
	if (isRational(value)) return exactSquareRoot(value) ?? Math.sqrt(toNumber(value));
	return Math.sqrt(toNumber(value));
}

function exactSquareRoot(value: import('./value-types.ts').Rational): import('./value-types.ts').Rational | undefined {
	const numerator = integerSquareRoot(value.numerator);
	const denominator = integerSquareRoot(value.denominator);
	if (numerator ** 2n !== value.numerator || denominator ** 2n !== value.denominator) return undefined;
	return rational(numerator, denominator);
}

function integerSquareRoot(value: bigint): bigint {
	if (value < 2n) return value;
	let estimate = value;
	let nextEstimate = (estimate + 1n) / 2n;
	while (nextEstimate < estimate) {
		estimate = nextEstimate;
		nextEstimate = (estimate + value / estimate) / 2n;
	}
	return estimate;
}