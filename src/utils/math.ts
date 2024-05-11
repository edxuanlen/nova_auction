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
