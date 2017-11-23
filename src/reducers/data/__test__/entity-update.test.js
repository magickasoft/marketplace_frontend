import test from 'ava';
import sinon from 'sinon';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    makeBunch
} from 'utils/bunch';
import {
    entityUpdate,
    __RewireAPI__
} from '../entity-update';


const stub$getEntityMerger = sinon.stub();

test.before(() => {
    __RewireAPI__.__set__({
        getEntityMerger: stub$getEntityMerger
    });
});

test.beforeEach(() => {
    stub$getEntityMerger.reset();
    stub$getEntityMerger.resetBehavior();
});

test('not existing merger', t => {
    const diff = uniqueId('diff');
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const bunch = makeBunch(namespace, id);
    const state0 = {};

    stub$getEntityMerger
        .withArgs(namespace)
        .onFirstCall().returns(Nothing());

    const state1 = entityUpdate(state0, bunch, diff);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('not existing namespace', t => {
    const diff = uniqueId('diff');
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const bunch = makeBunch(namespace, id);
    const state0 = {};
    const merger = sinon.stub();

    stub$getEntityMerger
        .withArgs(namespace)
        .onFirstCall().returns(Just(merger));

    const state1 = entityUpdate(state0, bunch, diff);
    t.false(merger.called);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('not existing entity', t => {
    const diff = uniqueId('diff');
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const bunch = makeBunch(namespace, id);
    const state0 = {
        [ namespace ]: {}
    };
    const merger = sinon.stub();

    stub$getEntityMerger
        .withArgs(namespace)
        .onFirstCall().returns(Just(merger));

    const state1 = entityUpdate(state0, bunch, diff);
    t.false(merger.called);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('existing entity', t => {
    const diff = uniqueId('diff');
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const bunch = makeBunch(namespace, id);
    const entity = uniqueId('entity');
    const state0 = {
        [ namespace ]: {
            [ id ]: entity
        }
    };
    const nextEntity = uniqueId('nextEntity');
    const merger = sinon.stub();
    merger
        .withArgs(diff, entity)
        .onFirstCall().returns(nextEntity);

    stub$getEntityMerger
        .withArgs(namespace)
        .onFirstCall().returns(Just(merger));

    const state1 = entityUpdate(state0, bunch, diff);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace ]: {
            [ id ]: nextEntity
        }
    });
});

test('existing other entity', t => {
    const diff = uniqueId('diff');
    const namespace = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const bunch1 = makeBunch(namespace, id1);
    const entity1 = uniqueId('entity');
    const entity2 = uniqueId('entity');
    const state0 = {
        [ namespace ]: {
            [ id1 ]: entity1,
            [ id2 ]: entity2
        }
    };
    const nextEntity1 = uniqueId('nextEntity');
    const merger = sinon.stub();
    merger
        .withArgs(diff, entity1)
        .onFirstCall().returns(nextEntity1);

    stub$getEntityMerger
        .withArgs(namespace)
        .onFirstCall().returns(Just(merger));

    const state1 = entityUpdate(state0, bunch1, diff);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace ]: {
            [ id1 ]: nextEntity1,
            [ id2 ]: entity2
        }
    });
});

test('existing other namespace', t => {
    const diff = uniqueId('diff');
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const entity1 = uniqueId('entity');
    const entity2 = uniqueId('entity');
    const state0 = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        }
    };
    const nextEntity1 = uniqueId('nextEntity');
    const merger = sinon.stub();
    merger
        .withArgs(diff, entity1)
        .onFirstCall().returns(nextEntity1);

    stub$getEntityMerger
        .withArgs(namespace1)
        .onFirstCall().returns(Just(merger));

    const state1 = entityUpdate(state0, bunch1, diff);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace1 ]: {
            [ id1 ]: nextEntity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        }
    });
});
