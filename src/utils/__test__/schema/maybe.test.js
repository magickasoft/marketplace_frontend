import test from 'ava';
import {
    uniqueId
} from 'lodash/fp';
import {
    normalize,
    schema
} from 'normalizr';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    Maybe
} from '../../schema';


test('throws for non Maybe value', t => {
    const namespace1 = uniqueId('namespace');
    const entity1 = new Maybe(
        new schema.Entity(namespace1)
    );
    const source1 = uniqueId('source');

    t.throws(
        () => normalize(source1, entity1)
    );
});

test('normalize a root Nothing', t => {
    const namespace1 = uniqueId('namespace');
    const entity1 = new Maybe(
        new schema.Entity(namespace1)
    );

    t.deepEqual(
        normalize(Nothing(), entity1),
        {
            result: Nothing(),
            entities: {}
        }
    );
});

test('normalize a root Just', t => {
    const namespace1 = uniqueId('namespace');
    const entity1 = new Maybe(
        new schema.Entity(namespace1)
    );
    const source1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };

    t.deepEqual(
        normalize(Just(source1), entity1),
        {
            result: Just(source1.id),
            entities: {
                [ namespace1 ]: {
                    [ source1.id ]: source1
                }
            }
        }
    );
});

test('normalize an undefined child', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const entity1 = new schema.Entity(namespace1);
    const entity2 = new schema.Entity(namespace2, {
        foo: new Maybe(entity1)
    });
    const source2 = {
        id: uniqueId('id')
    };

    t.deepEqual(
        normalize(source2, entity2),
        {
            result: source2.id,
            entities: {
                [ namespace2 ]: {
                    [ source2.id ]: {
                        id: source2.id
                    }
                }
            }
        }
    );
});

test('normalize a Nothing child', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const entity1 = new schema.Entity(namespace1);
    const entity2 = new schema.Entity(namespace2, {
        foo: new Maybe(entity1)
    });
    const source2 = {
        id: uniqueId('id'),
        foo: Nothing()
    };

    t.deepEqual(
        normalize(source2, entity2),
        {
            result: source2.id,
            entities: {
                [ namespace2 ]: {
                    [ source2.id ]: {
                        id: source2.id,
                        foo: Nothing()
                    }
                }
            }
        }
    );
});

test('normalize a Just child', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const entity1 = new schema.Entity(namespace1);
    const entity2 = new schema.Entity(namespace2, {
        foo: new Maybe(entity1)
    });
    const source1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const source2 = {
        id: uniqueId('id'),
        foo: Just(source1)
    };

    t.deepEqual(
        normalize(source2, entity2),
        {
            result: source2.id,
            entities: {
                [ namespace1 ]: {
                    [ source1.id ]: {
                        id: source1.id,
                        foo: source1.foo
                    }
                },
                [ namespace2 ]: {
                    [ source2.id ]: {
                        id: source2.id,
                        foo: Just(source1.id)
                    }
                }
            }
        }
    );
});

test('normalize a Just List children', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const entity1 = new schema.Entity(namespace1);
    const entity2 = new schema.Entity(namespace2, {
        foo: new Maybe(
            new schema.Array(entity1)
        )
    });
    const source11 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const source12 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const source13 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const source2 = {
        id: uniqueId('id'),
        foo: Just([ source11, source12, source13 ])
    };

    t.deepEqual(
        normalize(source2, entity2),
        {
            result: source2.id,
            entities: {
                [ namespace1 ]: {
                    [ source11.id ]: {
                        id: source11.id,
                        foo: source11.foo
                    },
                    [ source12.id ]: {
                        id: source12.id,
                        foo: source12.foo
                    },
                    [ source13.id ]: {
                        id: source13.id,
                        foo: source13.foo
                    }
                },
                [ namespace2 ]: {
                    [ source2.id ]: {
                        id: source2.id,
                        foo: Just([
                            source11.id,
                            source12.id,
                            source13.id
                        ])
                    }
                }
            }
        }
    );
});
