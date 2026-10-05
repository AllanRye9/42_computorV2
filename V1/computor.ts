/**
 * ComputorV1 - Polynomial Equation Solver
 * Entry point for the application
 */

import { solvePolynomial } from './polynomial.ts';

try {
	solvePolynomial(process.argv.slice(2).join(' '));
} catch (error) {
	console.error(error instanceof Error ? error.message : String(error));
	process.exitCode = 1;
}
