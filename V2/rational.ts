import type { Rational } from './value-types.ts';

export function parseRational(value: string): Rational {
	const [mantissa, exponentText] = value.toLowerCase().split('e');
	const exponent = exponentText ? Number(exponentText) : 0;
	const [whole, fraction = ''] = mantissa.split('.');
	let numerator = BigInt(`${whole || '0'}${fraction}`);
	const scale = fraction.length - exponent;
	if (scale < 0) numerator *= 10n ** BigInt(-scale);
	return rational(numerator, scale > 0 ? 10n ** BigInt(scale) : 1n);
}

export function rational(numerator: bigint, denominator = 1n): Rational {
	if (denominator === 0n) throw new Error('Division by zero');
	if (denominator < 0n) {
		numerator = -numerator;
		denominator = -denominator;
	}
	const divisor = greatestCommonDivisor(numerator, denominator);
	return { kind: 'rational', numerator: numerator / divisor, denominator: denominator / divisor };
}

export function greatestCommonDivisor(left: bigint, right: bigint): bigint {
	left = left < 0n ? -left : left;
	right = right < 0n ? -right : right;
	while (right !== 0n) [left, right] = [right, left % right];
	return left || 1n;
}