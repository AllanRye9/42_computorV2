import type { ExpressionValue, UserFunction } from './value-types.ts';
import { tokenize } from './tokenizer.ts';
import { TokenStream } from './token-stream.ts';
import { parsePrimary } from './primary-parser.ts';
import { applyOperator } from './expression-operators.ts';
import { containsNaN } from './scalar.ts';
import { evaluateExpression } from './expression-api.ts';

export class ExpressionParser {
	private readonly stream: TokenStream;

	public constructor(
		expression: string,
		private readonly variables: Readonly<Record<string, ExpressionValue>>,
		private readonly functions: Readonly<Record<string, UserFunction>>
	) {
		this.stream = new TokenStream(tokenize(expression));
	}

	public parse(): ExpressionValue {
		if (this.stream.done) throw new Error('Expression cannot be empty');
		const result = this.parseExpression();
		if (!this.stream.done) throw new Error(`Unexpected token '${this.stream.peek()?.value}'`);
		if (containsNaN(result)) throw new Error('Result is not a valid number');
		return result;
	}

	private parseExpression(minimumPrecedence = 1): ExpressionValue {
		let left = this.parsePrimary();
		while (!this.stream.done) {
			const token = this.stream.peek()!;
			const implicit = token.kind === 'identifier' || token.value === '(' || token.value === '[';
			const operator = implicit ? '*' : token.value;
			const precedence = this.precedence(operator);
			if (precedence < minimumPrecedence) break;
			if (!implicit) this.stream.next();
			const nextMinimum = operator === '^' || operator === '**' ? precedence : precedence + 1;
			left = applyOperator(operator, left, this.parseExpression(nextMinimum));
		}
		return left;
	}

	private parsePrimary(): ExpressionValue {
		return parsePrimary(this.stream, (minimum) => this.parseExpression(minimum), this.variables, this.functions,
			(expression, variables) => evaluateExpression(expression, variables, this.functions));
	}

	private precedence(operator: string): number {
		if (operator === '+' || operator === '-') return 1;
		if (operator === '*' || operator === '/' || operator === '%') return 2;
		if (operator === '^' || operator === '**') return 3;
		return -1;
	}
}