import { solvePolynomial } from '../V1/polynomial.ts';

const com = process.argv;
function compLoop() : void{
	while (true){
		if(com){
			try {
				solvePolynomial(com.slice(2).join(' '));
			} catch (error) {
				console.error(error instanceof Error ? error.message : String(error));
				process.exitCode = 1;
			}
		}
	}
}

compLoop();