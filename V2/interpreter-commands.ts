import { solvePolynomial } from '../V1/polynomial.ts';
import { evaluateExpression, formatExpressionValue } from './expression-api.ts';
import type { ExpressionValue, UserFunction } from './value-types.ts';
import { expandUserFunctionCalls } from './function-expansion.ts';
import { formatFunctionExpression } from './function-format.ts';
import { computeExpression, showHelp, showHistory, showVariables } from './interpreter-display.ts';

export interface InterpreterState {
	variables: Record<string, ExpressionValue>;
	functions: Record<string, UserFunction>;
}

export function handleCommand(line: string, state: InterpreterState, history: string[]): boolean {
	history.push(line);
	const command = line.toLowerCase();
	if (command === 'exit' || command === 'quit') {
		console.log('Exiting ......');
		return false;
	}
	if (command === 'help') showHelp();
	else if (command === 'history' || command === 'histroy') showHistory(history);
	else if (command === 'vars') showVariables(state.variables);
	else evaluateInstruction(line, state);
	return true;
}

function evaluateInstruction(instruction: string, state: InterpreterState): void {
	try {
		const trimmed = instruction.trim();
		const equals = trimmed.indexOf('=');
		if (equals < 0) {
			const result = computeExpression(trimmed, state.variables, state.functions);
			console.log(formatExpressionValue(result));
			state.variables.ans = result;
			return;
		}
		if (trimmed.split('=').length !== 2) throw new Error("Malformed assignment: expected exactly one '='");
		const target = trimmed.slice(0, equals).trim();
		const expression = trimmed.slice(equals + 1).trim();
		if (!expression) throw new Error('Assignment requires an expression on the right-hand side');
		const functionMatch = target.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*\(\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\)$/);
		if (functionMatch && expression !== '?') {
			state.functions[functionMatch[1]] = { parameter: functionMatch[2], expression };
			console.log(formatFunctionExpression(expression));
			return;
		}
		if (expression !== '?' && /\bX\b/i.test(trimmed) && target !== 'X' && !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(target)) {
			solvePolynomial(trimmed);
			return;
		}
		if (expression === '?') {
			showQuery(target, state);
			return;
		}
		if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(target)) throw new Error(`Invalid variable name: '${target}'`);
		const result = computeExpression(expression, state.variables, state.functions);
		state.variables[target] = result;
		state.variables.ans = result;
		console.log(formatExpressionValue(result));
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
	}
}

function showQuery(expression: string, state: InterpreterState): void {
	try {
		const result = computeExpression(expression, state.variables, state.functions);
		state.variables.ans = result;
		console.log(formatExpressionValue(result));
	} catch (error) {
		const composition = expandUserFunctionCalls(expression, state.functions);
		if (composition === undefined) throw error;
		console.log(formatFunctionExpression(composition));
	}
}