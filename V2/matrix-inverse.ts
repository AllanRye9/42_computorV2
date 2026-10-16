import type { MatrixValue, ScalarValue } from './value-types.ts';
import { divideScalarValues, isComplex, multiplyScalarValues, subtractScalarValues } from './scalar.ts';
import { isZero } from './real.ts';

export function inverseMatrix(matrix: MatrixValue): MatrixValue {
	const size = matrix.rows.length;
	if (size !== matrix.rows[0].length) throw new Error('Matrix inverse requires a square matrix');
	const work: ScalarValue[][] = matrix.rows.map((row, index) => [
		...row,
		...Array.from({ length: size }, (_, column) => index === column ? { kind: 'rational' as const, numerator: 1n, denominator: 1n } : { kind: 'rational' as const, numerator: 0n, denominator: 1n })
	]);

	for (let column = 0; column < size; column++) {
		let pivotRow = column;
		while (pivotRow < size && isZeroScalar(work[pivotRow][column])) pivotRow++;
		if (pivotRow === size) throw new Error('Matrix is singular');
		[work[column], work[pivotRow]] = [work[pivotRow], work[column]];
		const pivot = work[column][column];
		work[column] = work[column].map((entry) => divideScalarValues(entry, pivot));
		for (let row = 0; row < size; row++) {
			if (row === column) continue;
			const factor = work[row][column];
			if (isZeroScalar(factor)) continue;
			work[row] = work[row].map((entry, index) => subtractScalarValues(entry, multiplyScalarValues(factor, work[column][index])));
		}
	}
	return { kind: 'matrix', rows: work.map((row) => row.slice(size)) };
}

function isZeroScalar(value: ScalarValue): boolean {
	if (!isComplex(value)) return isZero(value);
	return isZero(value.real) && isZero(value.imaginary);
}