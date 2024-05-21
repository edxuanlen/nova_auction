export function extractSignature(input: string): string {
    const signatureRegex = /0x[a-fA-F0-9]{8}/;
    const match = input.match(signatureRegex);

    if (match && match.length > 0) {
        return match[0];
    } else {
        return '';
    }
}
