export type ExcludesAllFalsy = <T>(x: T | undefined | null | false) => x is T;
