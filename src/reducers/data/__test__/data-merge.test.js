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
    dataMerge,
    __RewireAPI__
} from '../data-merge';


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
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const entity = uniqueId('entity');
    const data = {
        [ namespace ]: {
            [ id ]: entity
        }
    };
    const state0 = {};

    stub$getEntityMerger
        .withArgs(namespace).returns(Nothing());

    const state1 = dataMerge(state0, data);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('not existing namespace', t => {
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const entity = uniqueId('entity');
    const data = {
        [ namespace ]: {
            [ id ]: entity
        }
    };
    const state0 = {};
    const merger = sinon.stub();

    stub$getEntityMerger
        .withArgs(namespace).returns(Just(merger));

    const state1 = dataMerge(state0, data);
    t.false(merger.called);
    t.not(state1, state0);
    t.deepEqual(state1, data);
});

test('existing other namespace', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id = uniqueId('id');
    const entity = uniqueId('entity');
    const data = {
        [ namespace1 ]: {
            [ id ]: entity
        }
    };
    const state0 = {
        [ namespace2 ]: {}
    };
    const merger = sinon.stub();

    stub$getEntityMerger
        .withArgs(namespace1).returns(Just(merger));

    const state1 = dataMerge(state0, data);
    t.false(merger.called);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace1 ]: {
            [ id ]: entity
        },
        [ namespace2 ]: {}
    });
});

test('not existing entity', t => {
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const entity = uniqueId('entity');
    const data = {
        [ namespace ]: {
            [ id ]: entity
        }
    };
    const state0 = {
        [ namespace ]: {}
    };
    const merger = sinon.stub();
    const partMerger = sinon.stub();

    merger
        .withArgs(entity).returns(partMerger);

    stub$getEntityMerger
        .withArgs(namespace).returns(Just(merger));

    const state1 = dataMerge(state0, data);
    t.false(partMerger.called);
    t.not(state1, state0);
    t.deepEqual(state1, data);
});

test('existing other entity', t => {
    const namespace = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const entity1 = uniqueId('entity');
    const entity2 = uniqueId('entity');
    const data = {
        [ namespace ]: {
            [ id1 ]: entity1
        }
    };
    const state0 = {
        [ namespace ]: {
            [ id2 ]: entity2
        }
    };
    const merger = sinon.stub();
    const partMerger = sinon.stub();

    merger
        .withArgs(entity1).returns(partMerger);

    stub$getEntityMerger
        .withArgs(namespace).returns(Just(merger));

    const state1 = dataMerge(state0, data);
    t.false(partMerger.called);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace ]: {
            [ id1 ]: entity1,
            [ id2 ]: entity2
        }
    });
});

test('existing entity', t => {
    const namespace = uniqueId('namespace');
    const id = uniqueId('id');
    const prevEntity = uniqueId('entity');
    const entity = uniqueId('entity');
    const data = {
        [ namespace ]: {
            [ id ]: entity
        }
    };
    const state0 = {
        [ namespace ]: {
            [ id ]: prevEntity
        }
    };
    const merger = sinon.stub();
    const partMerger = sinon.stub();
    const nextEntity = uniqueId('entity');

    partMerger
        .withArgs(prevEntity).returns(nextEntity);

    merger
        .withArgs(entity).returns(partMerger);

    stub$getEntityMerger
        .withArgs(namespace).returns(Just(merger));

    const state1 = dataMerge(state0, data);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace ]: {
            [ id ]: nextEntity
        }
    });
});

test('more than one namespace', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const namespace3 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const id3 = uniqueId('id');
    const entity1 = uniqueId('entity');
    const entity2 = uniqueId('entity');
    const entity3 = uniqueId('entity');
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        },
        [ namespace3 ]: {
            [ id3 ]: entity3
        }
    };
    const state0 = {};
    const merger1 = sinon.stub();
    const merger2 = sinon.stub();

    stub$getEntityMerger
        .withArgs(namespace1).returns(Just(merger1));
    stub$getEntityMerger
        .withArgs(namespace2).returns(Just(merger2));
    stub$getEntityMerger
        .withArgs(namespace3).returns(Nothing());

    const state1 = dataMerge(state0, data);
    t.false(merger1.called);
    t.false(merger2.called);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        }
    });
});

test('more than one entity', t => {
    const namespace = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const id3 = uniqueId('id');
    const entity1 = uniqueId('entity');
    const entity2 = uniqueId('entity');
    const entity3 = uniqueId('entity');
    const prevEntity1 = uniqueId('entity');
    const prevEntity2 = uniqueId('entity');
    const data = {
        [ namespace ]: {
            [ id1 ]: entity1,
            [ id2 ]: entity2,
            [ id3 ]: entity3
        }
    };
    const state0 = {
        [ namespace ]: {
            [ id1 ]: prevEntity1,
            [ id2 ]: prevEntity2
        }
    };
    const merger = sinon.stub();
    const partMerger1 = sinon.stub();
    const partMerger2 = sinon.stub();
    const partMerger3 = sinon.stub();
    const nextEntity1 = uniqueId('entity');
    const nextEntity2 = uniqueId('entity');

    partMerger1
        .withArgs(prevEntity1).returns(nextEntity1);
    partMerger2
        .withArgs(prevEntity2).returns(nextEntity2);

    merger
        .withArgs(entity1).returns(partMerger1);
    merger
        .withArgs(entity2).returns(partMerger2);
    merger
        .withArgs(entity3).returns(partMerger3);

    stub$getEntityMerger
        .withArgs(namespace).returns(Just(merger));

    const state1 = dataMerge(state0, data);
    t.false(partMerger3.called);
    t.not(state1, state0);
    t.deepEqual(state1, {
        [ namespace ]: {
            [ id1 ]: nextEntity1,
            [ id2 ]: nextEntity2,
            [ id3 ]: entity3
        }
    });
});
