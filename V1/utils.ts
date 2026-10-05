/**
 * Mathematical Utility Functions
 */

export const absoluteValue = (value: number): number => {
    return value < 0 ? -value : value;
};

export const squareRoot = (value: number): number => {
    const epsilon = 0.000001;
    let prediction = value / 2;

    while (absoluteValue(prediction * prediction - value) > epsilon) {
        prediction = (prediction + value / prediction) / 2;
    }

    const intValue = prediction | 0;
    if ((intValue + 1) * (intValue + 1) === value) {
        return intValue + 1;
    }
    if (intValue * intValue === value) {
        return intValue;
    }

    return prediction;
};

export function greatestCommonDivisor(a: number, b: number): number {
    a = absoluteValue(a);
    b = absoluteValue(b);

    while (b !== 0) {
        const temp = a % b;
        a = b;
        b = temp;
    }

    return a;
}

export function formatFraction(numerator: number, denominator: number): string {
    const divisor = greatestCommonDivisor(numerator, denominator);

    numerator /= divisor;
    denominator /= divisor;

    if (denominator < 0) {
        numerator = -numerator;
        denominator = -denominator;
    }

    return `${numerator}/${denominator}`;
}
