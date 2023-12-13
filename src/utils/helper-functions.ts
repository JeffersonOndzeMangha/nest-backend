export const toFixedNumber = (num: number): number => Number(num.toFixed(2));
export const singularize = (name: string): string => {
    if (name.endsWith('s')) {
        return name.slice(0, -1);
    }
    if (name === 'people') {
        return 'person';
    }
    return name;
};