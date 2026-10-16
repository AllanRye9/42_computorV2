import type { ExpressionValue, MatrixValue, ScalarValue } from './value-types.ts';
import { divideScalarValues, isComplex, multiplyScalarValues, parts, addScalarValues } from './scalar.ts';
import { isRational, isZero } from './real.ts';
import { inverseMatrix } from './matrix-inverse.ts';

const ZERO: ScalarValue = { kind: 'rational', numerator: 0n, denominator: 1n };
const ONE: ScalarValue = { kind: 'rational', numerator: 1n, denominator: 1n };

export function isMatrix(value: ExpressionValue): value is MatrixValue {
	return typeof value !== 'number' && value.kind === 'matrix';
}

export function validateMatrix(rows: ScalarValue[][]): void {
	if (rows.length === 0 || rows[0].length === 0) throw new Error('Matrix cannot be empty');
	if (rows.some((row) => row.length !== rows[0].length)) throw new Error('Matrix rows must have equal lengths');
}

export function matrixFrom(rows: ScalarValue[][]): MatrixValue {
	validateMatrix(rows);
	return { kind: 'matrix', rows };
}

export function addMatrices(left: MatrixValue, right: MatrixValue): MatrixValue {
	if (left.rows.length !== right.rows.length || left.rows[0].length !== right.rows[0].length) {
		throw new Error('Matrix dimensions must match');
	}
	return matrixFrom(left.rows.map((row, r) => row.map((entry, c) => addScalarValues(entry, right.rows[r][c]))));
}

export function scaleMatrix(matrix: MatrixValue, scalar: ScalarValue): MatrixValue {
	return matrixFrom(matrix.rows.map((row) => row.map((entry) => multiplyScalarValues(entry, scalar))));
}

export function multiplyMatrices(left: MatrixValue, right: MatrixValue): MatrixValue {
	const shared = left.rows[0].length;
	if (shared !== right.rows.length) throw new Error('Matrix dimensions do not allow multiplication');
	return matrixFrom(left.rows.map((row) => right.rows[0].map((_, column) => {
		let sum: ScalarValue = ZERO;
		for (let index = 0; index < shared; index++) sum = addScalarValues(sum, multiplyScalarValues(row[index], right.rows[index][column]));
		return sum;
	})));
}

export function powerMatrix(matrix: MatrixValue, exponent: ScalarValue): MatrixValue {
	if (matrix.rows.length !== matrix.rows[0].length) throw new Error('Matrix powers require a square matrix');
	const [real, imaginary] = parts(exponent);
	if (!isZero(imaginary) || !isRational(real) || real.denominator !== 1n) throw new Error('Matrix exponent must be an integer');
	let remaining = real.numerator < 0n ? -real.numerator : real.numerator;
	let factor = matrix;
	let result = identityMatrix(matrix.rows.length);
	while (remaining > 0n) {
		if (remaining % 2n === 1n) result = multiplyMatrices(result, factor);
		remaining /= 2n;
		if (remaining > 0n) factor = multiplyMatrices(factor, factor);
	}
	return real.numerator < 0n ? inverseMatrix(result) : result;
}

export function identityMatrix(size: number): MatrixValue {
	return matrixFrom(Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, column) => row === column ? ONE : ZERO)));
}

export function inverse(matrix: MatrixValue): MatrixValue {
	return inverseMatrix(matrix);
}