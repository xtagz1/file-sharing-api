export function parseBoolean(value: string | undefined): boolean | undefined {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
}