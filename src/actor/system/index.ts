import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Address } from '../address';
import { Instance } from '../';
import { PVM_Value, Script } from './vm/script';

/**
 * System represents a dynamic collection of actors that 
 * can communicate with each other via message passing.
 */
export interface System extends Instance {

    ident(i: Instance): Address

    exec(i: Instance, s: Script): Maybe<PVM_Value>

}

/**
 * Void system.
 *
 * This can be used to prevent a stopped actor from executing further commands.
 */
export class Void implements System {

    ident(): Address {

        return '?';

    }

    accept(): void {

    }

    run(): void {

    }

    notify(): void {


    }

    stop(): void {


    }

    exec(_: Instance, __: Script): Maybe<PVM_Value> {

        return nothing();

    }

}
