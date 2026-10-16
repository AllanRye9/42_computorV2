import { ComputorV2 } from './interpreter.ts';

async function main(): Promise<void> {
	const interpreter = new ComputorV2();
	await interpreter.start();
}

void main();