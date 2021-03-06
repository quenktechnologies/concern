import { Constructor } from '@quenk/noni/lib/data/type/constructor';
import { Pattern } from '@quenk/noni/lib/data/type';
import { Message } from '../message';
import { Eff } from '../';
export { Pattern };
/**
 * Handler function type for Cases.
 */
export declare type Handler<T> = (t: T) => Eff;
/**
 * Case is provided for situations where it is better to extend
 * the Case class instead of creating new instances.
 */
export declare class Case<T> {
    pattern: Pattern<T>;
    handler: Handler<T>;
    constructor(pattern: NumberConstructor, f: (value: number) => void);
    constructor(pattern: BooleanConstructor, f: (value: boolean) => void);
    constructor(pattern: StringConstructor, f: (value: string) => void);
    constructor(pattern: object, f: (value: {
        [P in keyof T]: Message;
    }) => void);
    constructor(pattern: string, f: (value: string) => void);
    constructor(pattern: number, f: (value: number) => void);
    constructor(pattern: boolean, f: (value: boolean) => void);
    constructor(pattern: Constructor<T>, f: (value: T) => void);
    /**
     * test whether the supplied message satisfies the Case test.
     */
    test(m: Message): boolean;
    /**
     * apply the handler to the message.
     */
    apply(m: Message): Eff;
}
/**
 * Default matches any message value.
 */
export declare class Default<T> extends Case<T> {
    handler: Handler<T>;
    constructor(handler: Handler<T>);
    test(_: Message): boolean;
    apply(m: Message): Eff;
}
