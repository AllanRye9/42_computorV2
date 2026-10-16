import type { Rational, RealPart } from './value-types.ts';
import { rational } from './rational.ts';

export function isRational(value: RealPart): value is Rational {
	return typeof value !== 'number';
}

export function addReal(left: RealPart, right: RealPart): RealPart {
	if (isRational(left) && isRational(right)) {
		return rational(left.numerator * right.denominator + right.numerator * left.denominator, left.denominator * right.denominator);
	}
	return toNumber(left) + toNumber(right);
}

export function subtractReal(left: RealPart, right: RealPart): RealPart {
	return addReal(left, negateReal(right));
}

export function multiplyReal(left: RealPart, right: RealPart): RealPart {
	if (isRational(left) && isRational(right)) return rational(left.numerator * right.numerator, left.denominator * right.denominator);
	return toNumber(left) * toNumber(right);
}

export function divideReal(left: RealPart, right: RealPart): RealPart {
	if (isRational(left) && isRational(right)) {
		if (right.numerator === 0n) throw new Error('Division by zero');
		return rational(left.numerator * right.denominator, left.denominator * right.numerator);
	}
	return toNumber(left) / toNumber(right);
}

export function negateReal(value: RealPart): RealPart {
	return isRational(value) ? rational(-value.numerator, value.denominator) : -value;
}

export function isZero(value: RealPart): boolean {
	return isRational(value) ? value.numerator === 0n : value === 0;
}

export function isOne(value: RealPart): boolean {
	return isRational(value) ? value.numerator === value.denominator : value === 1;
}

export function isNegative(value: RealPart): boolean {
	return isRational(value) ? value.numerator < 0n : value < 0;
}

export function toNumber(value: RealPart): number {
	return isRational(value) ? Number(value.numerator) / Number(value.denominator) : value;
}

export function formatReal(value: RealPart): string {
	if (typeof value === 'number') return Object.is(value, -0) ? '0' : String(value);
	return value.denominator === 1n ? `${value.numerator}` : `${value.numerator}/${value.denominator}`;
}