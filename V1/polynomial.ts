/**
 * Polynomial Solver Module
 * Core logic for solving polynomial equations
 */

import { validateEquation, parseEquationSide, type Term } from './parse.ts';
import { squareRoot, formatFraction, greatestCommonDivisor } from './utils.ts';

const simplifyEquationSide = (terms: Term[]): Term[] => {
    if (!Array.isArray(terms) || terms.length === 0) {
        throw new Error('Invalid input format');
    }

    const accumulator: number[] = [];

    terms.forEach(([coefficient, degree]) => {
        if (
            degree < 0 ||
            !Number.isInteger(degree) ||
            !Number.isFinite(coefficient)
        ) {
            throw new Error('Invalid degree or coefficient');
        }

        if (coefficient == null || degree == null) {
            return;
        }

        accumulator[degree] = (accumulator[degree] ?? 0) + coefficient;
    });

    return accumulator
        .map((coefficient, degree) => (coefficient != null ? [coefficient, degree] : null))
        .filter((item): item is Term => item != null);
};

const moveTermsToLeft = (leftSide: Term[], rightSide: Term[]): Term[] => {
    rightSide.forEach(([coefficient, degree]) => {
        if (coefficient === 0) return;

        const existingIndex = leftSide.findIndex((item) => item[1] === degree);

        if (existingIndex < 0) {
            leftSide.push([-coefficient, degree]);
        } else {
            leftSide[existingIndex][0] -= coefficient;
        }
    });

    return leftSide.filter((item) => item != null);
};

const stringifyEquation = (terms: Term[]): string => {
    if (terms.length === 0) {
        return '0 * X^0';
    }

    let equationString = `${terms[0][0]} * X^${terms[0][1]}`;

    terms.forEach((term, index) => {
        if (index === 0) return;

        const [coefficient, degree] = term;
        const sign = coefficient < 0 ? ' - ' : ' + ';
        const absCoefficient = coefficient < 0 ? -coefficient : coefficient;

        equationString += `${sign}${absCoefficient} * X^${degree}`;
    });

    return equationString;
};

const findMaxDegree = (terms: Term[]): Term => {
    return terms.reduce((max, current) => {
        return max[1] > current[1] ? max : current;
    }, [0, 0] as Term);
};

const getCoefficient = (terms: Term[], degree: number): number => {
    const term = terms.find((x) => x[1] === degree);
    return term ? term[0] : 0;
};

const solveLinear = (b: number, c: number): void => {
    console.log('The solution is:');
    console.log(-c / b);
};

const solveQuadratic = (a: number, b: number, c: number): void => {
    const discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
        console.log('Discriminant is strictly positive, the two solutions are:');

        const sqrtDiscriminant = squareRoot(discriminant);
        const solution1 = (-b - sqrtDiscriminant) / (2 * a);
        const solution2 = (-b + sqrtDiscriminant) / (2 * a);

        console.log(solution1.toFixed(6));
        console.log(solution2.toFixed(6));
    } else if (discriminant === 0) {
        console.log('Discriminant is zero, the solution is:');
        console.log(-b / (2 * a));
    } else {
        solveComplexQuadratic(a, b, c, discriminant);
    }
};

const solveComplexQuadratic = (a: number, b: number, c: number, discriminant: number): void => {
    console.log('Discriminant is strictly negative, the two complex solutions are:');

    let sqrtNegDiscriminant = squareRoot(-discriminant);

    const intValue = sqrtNegDiscriminant | 0;
    if ((intValue + 1) * (intValue + 1) === -discriminant) {
        sqrtNegDiscriminant = intValue + 1;
    } else if (intValue * intValue === -discriminant) {
        sqrtNegDiscriminant = intValue;
    }

    const denominator = 2 * a;
    const realPart = formatFraction(-b, denominator);

    const formatImaginaryPart = (numerator: number, denominator: number): string => {
        const divisor = greatestCommonDivisor(numerator, denominator);
        numerator /= divisor;
        denominator /= divisor;

        if (denominator < 0) {
            numerator = -numerator;
            denominator = -denominator;
        }

        return denominator === 1 ? `${numerator}i` : `${numerator}i/${denominator}`;
    };

    const imaginaryPart = formatImaginaryPart(sqrtNegDiscriminant, denominator);

    console.log(`${realPart} + ${imaginaryPart}`);
    console.log(`${realPart} - ${imaginaryPart}`);
};

export const solvePolynomial = (formula: string): void => {
    const [leftExpression, rightExpression] = validateEquation(formula);
    const rightSide = simplifyEquationSide(parseEquationSide(rightExpression));
    let leftSide = simplifyEquationSide(parseEquationSide(leftExpression));

    leftSide = moveTermsToLeft(leftSide, rightSide);

    console.log(`Reduced form: ${stringifyEquation(leftSide)} = 0`);

    if (leftSide.length === 0) {
        console.log('Any real number is a solution.');
        return;
    }

    if (leftSide[0][0] < 0 && leftSide.length === 1 && leftSide[0][1] === 0) {
        console.log('No solution.');
        return;
    }

    const maxDegreeTerm = findMaxDegree(leftSide);
    const degree = maxDegreeTerm[1];

    if (!(leftSide[0][0] === 0 && leftSide[0][1] === 0)) {
        console.log(`Polynomial degree: ${degree}`);
    }

    if (degree > 2) {
        console.log("The polynomial degree is strictly greater than 2, I can't solve.");
        return;
    }

    const a = getCoefficient(leftSide, 2);
    const b = getCoefficient(leftSide, 1);
    const c = getCoefficient(leftSide, 0);

    if (degree === 0) {
        const message = a !== 0 ? 'No solution.' : 'Any real number is a solution.';
        console.log(message);
        return;
    }

    if (degree === 1) {
        solveLinear(b, c);
    }

    if (degree === 2) {
        solveQuadratic(a, b, c);
    }
    return;
};