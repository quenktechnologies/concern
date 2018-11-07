import { Address } from '../../address';
import { Context } from '../../context';
import { Op, Executor } from './';
/**
 * Route instruction.
 */
export declare class Route<C extends Context> extends Op<C> {
    from: Address;
    to: Address;
    constructor(from: Address, to: Address);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execRoute
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
export declare const execRoute: <C extends Context>(s: Executor<C>, { from, to }: Route<C>) => void;
