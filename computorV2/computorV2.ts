import { solvePolynomial } from '../computorV1/polynomial.ts';

try {
	solvePolynomial(process.argv.slice(2).join(' '));
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}