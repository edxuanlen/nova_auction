export function fastPow(base: number, exponent: number): number {
    if (exponent === 0) {
        return 1;
    }

    if (exponent % 2 === 0) {
        const half = fastPow(base, exponent / 2);
        return half * half;
    } else {
        return base * fastPow(base, exponent - 1);
    }
}


export function formatPercentage(value: number): string {
    return `${value.toFixed(6)}%`;
}


export function calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) {
        return 0;
    }

    const sum = numbers.reduce((acc, curr) => acc + curr, 0);

    const average = sum / numbers.length;

    return average;
}

Number.prototype.toFixed = function (digits) {
    if (typeof digits !== 'number' || digits < 0 || digits > 20) {
        throw new RangeError('toFixed() digits argument must be between 0 and 20');
    }

    var multiplier = Math.pow(10, digits);
    var truncatedNumber = Math.trunc(this * multiplier) / multiplier;

    var truncatedString = truncatedNumber.toString();
    var parts = truncatedString.split('.');

    if (parts.length === 1) {
        return truncatedString;
    }

    var decimal = parts[1].slice(0, digits);

    return parts[0] + '.' + decimal;
};
