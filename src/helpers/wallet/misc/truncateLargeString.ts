// const truncatedAddress = `${publicEvmAddress?.substring(
//     0,
//     10
// )}...${publicEvmAddress?.substring(publicEvmAddress?.length - 5)}`;

export function truncateLargeString(
    str: string,
    initialDigitsCount: number,
    lastDigitsCount: number
): string {
    return `${str?.substring(0, initialDigitsCount)}...${str?.substring(
        str?.length - lastDigitsCount
    )}`;
}
