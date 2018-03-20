import * as event from '../../system/log/event';
import { System, Envelope } from '../../system';
import {Maybe, just } from 'afpl/lib/monad/Maybe';
import { Receiver } from '.';

/**
 * Receive block for messages.
 */
export class Receive<T> {

    constructor(public fn: Receiver<T>, public system: System) { }

    apply(e: Envelope): Maybe<Receive<T>> {

        let received = false;

        this
            .fn(e.message)
            .orElse(() => { received = true; this.system.discard(e); })

        if (received)
            this.system.log(new event.MessageReceivedEvent(e.to, e.from, e.message));

        return just(this);

    }

}
