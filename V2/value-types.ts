export interface Rational {
	kind: 'rational';
	numerator: bigint;
	denominator: bigint;
}

export type RealPart = Rational | number;

export interface ComplexValue {
	kind: 'complex';
	real: RealPart;
	imaginary: RealPart;
}

export type ScalarValue = RealPart | ComplexValue;

export interface MatrixValue {
	kind: 'matrix';
	rows: ScalarValue[][];
}

export type ExpressionValue = ScalarValue | MatrixValue;

export interface Token {
	kind: 'number' | 'identifier' | 'operator';
	value: string;
}

export interface UserFunction {
	parameter: string;
	expression: string;
}