import { Context } from '../../../context';
import { System } from '../../';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Restart the current actor.
 */
export declare class Restart<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
