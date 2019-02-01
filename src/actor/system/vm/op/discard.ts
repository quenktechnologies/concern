import { Context } from '../../../context';
import { System } from '../../';
import { Runtime } from '../runtime';
import {OP_CODE_DISCARD, Log, Op, Level } from './';

/**
 * Discard removes and discards the first message in a Context's mailbox.
 */
export class Discard<C extends Context, S extends System<C>> implements Op<C, S> {

    public code = OP_CODE_DISCARD

    public level = Level.Actor;

    exec(e: Runtime<C, S>): void {

        e.current().get().context.mailbox.map(box => box.shift());

    }

    toLog(): Log {

        return ['discard', [], []];

    }

}
