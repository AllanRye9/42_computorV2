import type { ExpressionValue, MatrixValue, ScalarValue } from './value-types.ts';
import { matrixFrom, isMatrix } from './matrix.ts';
import { TokenStream } from './token-stream.ts';

type ParseExpression = (minimumPrecedence?: number) => ExpressionValue;

export function parseMatrixLiteral(stream: TokenStream, parseExpression: ParseExpression): MatrixValue {
	const rows: ScalarValue[][] = [];
	if (stream.peek()?.value === '[') {
		while (true) {
			stream.expect('[');
			const row = [parseMatrixEntry(stream, parseExpression)];
			while (stream.peek()?.value === ',') {
				stream.next();
				row.push(parseMatrixEntry(stream, parseExpression));
			}
			stream.expect(']');
			rows.push(row);
			if (stream.peek()?.value !== ',' && stream.peek()?.value !== ';') break;
			stream.next();
		}
		stream.expect(']');
	} else {
		let row = [parseMatrixEntry(stream, parseExpression)];
		while (stream.peek()?.value === ',' || stream.peek()?.value === ';') {
			const separator = stream.next()?.value;
			const entry = parseMatrixEntry(stream, parseExpression);
			if (separator === ',') row.push(entry);
			else {
				rows.push(row);
				row = [entry];
			}
		}
		rows.push(row);
		stream.expect(']');
	}
	return matrixFrom(rows);
}

function parseMatrixEntry(stream: TokenStream, parseExpression: ParseExpression): ScalarValue {
	const value = parseExpression();
	if (isMatrix(value)) throw new Error('Matrix entries must be scalar values');
	return value;
}