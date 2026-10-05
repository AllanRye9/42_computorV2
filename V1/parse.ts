/**
 * Parser Module
 * Handles equation parsing and validation
 */

export type Term = [number, number];

/**
 * Validates the equation format
 */
export function validateEquation(formula: string): [string, string] {
    const sides = formula.split('=');
    if (sides.length !== 2 || sides.some((side) => side.trim() === '')) {
        throw new Error('Format: equation must contain one = and a non-empty expression on each side');
    }
    return [sides[0], sides[1]];
}

const numberPattern = '[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)';

/**
 * Parses one side of the equation
 */
export const parseEquationSide = (side: string): Term[] => {
    const compactSide = side.toUpperCase().replace(/\s+/g, '');
    if (!compactSide || /[^\dX^*.+-]/.test(compactSide)) {
        throw new Error('Invalid or empty expression');
    }

    const tokens = compactSide.match(/[+-]?[^+-]+/g) ?? [];
    if (tokens.join('') !== compactSide) {
        throw new Error('Malformed expression');
    }

    return tokens.map((token): Term => {
        if (new RegExp(`^${numberPattern}$`).test(token)) {
            return [Number(token), 0];
        }

        const variableMatch = token.match(new RegExp(`^(${numberPattern}?)\\*?X(?:\\^(\\d+))?$`));
        if (!variableMatch) {
            throw new Error(`Malformed term: ${token}`);
        }

        const coefficientText = variableMatch[1];
        const coefficient = coefficientText === '' || coefficientText === '+'
            ? 1
            : coefficientText === '-'
                ? -1
                : Number(coefficientText);
        const degree = variableMatch[2] === undefined ? 1 : Number(variableMatch[2]);

        if (!Number.isFinite(coefficient) || !Number.isSafeInteger(degree)) {
            throw new Error(`Invalid coefficient or degree: ${token}`);
        }

        return [coefficient, degree];
    });
};