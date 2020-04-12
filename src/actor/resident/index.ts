import * as scripts from './scripts';

import { Err } from '@quenk/noni/lib/control/error';
import { map, merge } from '@quenk/noni/lib/data/record';
import { isObject } from '@quenk/noni/lib/data/type';

import { Context } from '../system/vm/runtime/context';
import { System } from '../system';
import {
    ADDRESS_DISCARD,
    Address,
    AddressMap
} from '../address';
import { Message } from '../message';
import { Template, Templates, Spawnable } from '../template';
import { FLAG_IMMUTABLE, FLAG_BUFFERED, FLAG_TEMPORARY } from '../flags';
import { Actor, Instance } from '../';
import { Case } from './case';
import { Api } from './api';

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;

/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident<S extends System>
    extends
    Api<S>,
    Actor { }

/**
 * AbstractResident implementation.
 */
export abstract class AbstractResident<S extends System>
    implements
    Resident<S> {

    constructor(public system: S) { }

    abstract init(c: Context): Context;

    abstract select<T>(_: Case<T>[]): AbstractResident<S>;

    abstract run(): void;

    notify() {

        this.system.exec(this, new scripts.Notify());

    }

    self() {

        return <Address>this
            .system
            .exec(this, new scripts.Self())
            .orJust(() => ADDRESS_DISCARD)
            .get();

    }

    accept(_: Message) {

    }

    spawn(t: Spawnable<S>): Address {

        return spawn(this.system, this, t);

    }

    spawnGroup(group: string | string[], tmpls: Templates<S>): AddressMap {

        return map(tmpls, (t: Spawnable<S>) => this.spawn(isObject(t) ?
            merge(t, { group: group }) : { group, create: t }));

    }

    tell<M>(ref: Address, m: M): AbstractResident<S> {

        this.system.exec(this, new scripts.Tell(ref, m));
        return this;

    }

    raise(e: Err): AbstractResident<S> {

        this.system.exec(this, new scripts.Raise(e.message));
        return this;

    }

    kill(addr: Address): AbstractResident<S> {

        this.system.exec(this, new scripts.Kill(addr));
        return this;

    }

    exit(): void {

        this.system.exec(this, new scripts.Kill(this.self()));

    }

    start(): void {

        this.run();

    }

    stop(): void {


    }

}

/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Immutable<T, S extends System>
    extends AbstractResident<S> {

    /**
     * receive is a static list of Case classes 
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;

        c.behaviour.push(m => this.receive.some(c => c.match(m)));

        return c;

    }

    /**
     * select noop.
     */
    select<M>(_: Case<M>[]): Immutable<T, S> {

        return this;

    }

}

/**
 * Temp automatically removes itself from the system after a succesfull match
 * of any of its cases.
 */
export abstract class Temp<T, S extends System>
    extends Immutable<T, S> {

    init(c: Context): Context {

        c.flags = c.flags | FLAG_TEMPORARY | FLAG_BUFFERED;

        c.behaviour.push(m => this.receive.some(c => c.match(m)));

        return c;

    }

}

/**
 * Mutable actors can change their behaviour after message processing.
 */
export abstract class Mutable<S extends System>
    extends AbstractResident<S> {

    receive: Case<void>[] = [];

    init(c: Context): Context {

        c.flags = c.flags | FLAG_BUFFERED;

        return c;

    }

    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<M>(cases: Case<M>[]): Mutable<S> {

        this.system.exec(this, new scripts.Receive((m: Message) =>
            cases.some(c => c.match(m))));

        return this;

    }

}

/**
 * ref produces a function for sending messages to an actor address.
 */
export const ref = <S extends System>
    (res: Resident<S>, addr: Address): Reference =>
    (m: Message) =>
        res.tell(addr, m);

/**
 * spawn an actor using the Spawn script.
 */
export const spawn = <S extends System>
    (sys: S, i: Instance, t: Spawnable<S>): Address => {

    let tmpl = isObject(t) ? <Template<System>>t : { create: t };

    return <Address>sys
        .exec(i, new scripts.Spawn(tmpl))
        .orJust(() => ADDRESS_DISCARD)
        .get();

}
