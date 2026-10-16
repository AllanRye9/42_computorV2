import type { Token } from './value-types.ts';

export class TokenStream {
	private position = 0;

	public constructor(private readonly tokens: Token[]) {}

	public get done(): boolean {
		return this.position >= this.tokens.length;
	}

	public peek(): Token | undefined {
		return this.tokens[this.position];
	}

	public next(): Token | undefined {
		return this.tokens[this.position++];
	}

	public expect(value: string): void {
		const token = this.next();
		if (!token || token.value !== value) throw new Error(`Expected '${value}'`);
	}
}