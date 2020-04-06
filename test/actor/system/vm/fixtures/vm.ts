import { Mock } from '@quenk/test/lib/mock';
import { Maybe, nothing } from '@quenk/noni/lib/data/maybe';
import { Err } from '@quenk/noni/lib/control/error';
import { Either, right } from '@quenk/noni/lib/data/either';

import { System } from '../../../../../lib/actor/system';
import { Template } from '../../../../../lib/actor/template';
import { State, Runtimes } from '../../../../../lib/actor/system/vm/state';
import { Address } from '../../../../../lib/actor/address';
import { Context } from '../../../../../lib/actor/system/vm/runtime/context';
import { Platform } from '../../../../../lib/actor/system/vm';
import { Runtime } from '../../../../../lib/actor/system/vm/runtime';
import { Message } from '../../../../../lib/actor/message';

export class FPVM<S extends System> implements Platform {

    state: State = { runtimes: {}, routers: {}, groups: {} };

    configuration = {};

    mock = new Mock();

    ident(): string {

        return '?';

    }

    allocate(addr: Address, t: Template<System>): Either<Err, Address> {

        return this.mock.invoke('allocate', [addr, t], right('?'));

    }

    runActor(addr: Address): Either<Err, void> {

        return this.mock.invoke('runActor', [addr], right(undefined));

    }

    sendMessage(addr: Address, m: Message): boolean {

        return this.mock.invoke('sendMessage', [addr, m], true);

    }

    getRuntime(addr: Address): Maybe<Runtime> {

        return this.mock.invoke('getContext', [addr], nothing());

    }

    getRouter(addr: Address): Maybe<Context> {

        return this.mock.invoke('getRouter', [addr], nothing());

    }

    getGroup(addr: Address): Maybe<Address[]> {

        return this.mock.invoke('getGroup', [addr], nothing());

    }

    putRuntime(addr: Address, ctx: Runtime): FPVM<S> {

        return this.mock.invoke('putRuntime', [addr, ctx], this);

    }

    getChildren(addr: Address): Maybe<Runtimes> {

        return this.mock.invoke('getChildren', [addr], nothing());

    }

    remove(addr: Address): FPVM<S> {

        return this.mock.invoke('remove', [addr], this);

    }

    putRoute(target: Address, router: Address): FPVM<S> {

        return this.mock.invoke('putRoute', [target, router], this);

    }

    removeRoute(target: Address): FPVM<S> {

        return this.mock.invoke('removeRoute', [target], this);

    }

    putMember(group: string, addr: Address): FPVM<S> {

        return this.mock.invoke('putRoute', [group, addr], this);

    }

    removeMember(group: string, addr: Address): FPVM<S> {

        return this.mock.invoke('removeGroup', [group, addr], this);

    }

    raise(err: Err): void {

        return this.mock.invoke<undefined>('raise', [err], undefined);

    }

    kill(addr: Address) {

        return this.mock.invoke('kill', [addr], undefined);

    }

}

export const newPlatform = () => new FPVM();
