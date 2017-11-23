import test from 'ava';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    denormalize
} from '..';
import {
    makeBunch
} from 'utils/bunch';


test('not existing namespace', t => {
    const namespace1 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const data = {};

    t.deepEqual(
        denormalize(Nothing(), data, bunch1),
        Nothing()
    );
});

test('not existing entity', t => {
    const namespace1 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const data = {
        [ namespace1 ]: {}
    };

    t.deepEqual(
        denormalize(Nothing(), data, bunch1),
        Nothing()
    );
});

test('existing entity', t => {
    const namespace1 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        }
    };

    t.deepEqual(
        denormalize(Nothing(), data, bunch1),
        Just({
            bunch: bunch1,
            foo: entity1.foo
        })
    );
});

test('existing list of entity', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        }
    };

    t.deepEqual(
        denormalize(Nothing(), data, [ bunch1, bunch2 ]),
        [
            {
                bunch: bunch1,
                foo: entity1.foo
            },
            {
                bunch: bunch2,
                foo: entity2.foo
            }
        ]
    );
});

test('existing entity with not existing relation', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: bunch2
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Nothing()
        })
    );
});

test('existing entity with existing relation', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: bunch2
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Just({
                bunch: bunch2,
                foo: entity2.foo
            })
        })
    );
});

test('existing entity with Nothing relation', t => {
    const namespace1 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: Nothing()
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Nothing()
        })
    );
});

test('existing entity with not existing Just relation', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: Just(bunch2)
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Nothing()
        })
    );
});

test('existing entity with existing Just relation', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: Just(bunch2)
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Just({
                bunch: bunch2,
                foo: entity2.foo
            })
        })
    );
});

test('existing entity with existing list of relation', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const id3 = uniqueId('id');
    const id4 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const bunch3 = makeBunch(namespace2, id3);
    const bunch4 = makeBunch(namespace2, id4);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: [ bunch2, bunch3, bunch4 ]
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const entity4 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2,
            [ id4 ]: entity4
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: [
                {
                    bunch: bunch2,
                    foo: entity2.foo
                },
                {
                    bunch: bunch4,
                    foo: entity4.foo
                }
            ]
        })
    );
});

test('existing entity with existing and not existing relations', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const namespace3 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const id3 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const bunch3 = makeBunch(namespace3, id3);
    const entity1 = {
        foo: uniqueId('foo'),
        bar: bunch2,
        baz: bunch3
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing(),
                baz: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Just({
                bunch: bunch2,
                foo: entity2.foo
            }),
            baz: Nothing()
        })
    );
});

test('existing entity with existing relations', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const namespace3 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const id3 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const bunch3 = makeBunch(namespace3, id3);
    const entity1 = {
        foo: uniqueId('foo'),
        bar: bunch2,
        baz: bunch3
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const entity3 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
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

    t.deepEqual(
        denormalize(
            Just({
                bar: Nothing(),
                baz: Nothing()
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Just({
                bunch: bunch2,
                foo: entity2.foo
            }),
            baz: Just({
                bunch: bunch3,
                foo: entity3.foo
            })
        })
    );
});

test('existing entity with existing deep relations', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const namespace3 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const id3 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const bunch3 = makeBunch(namespace3, id3);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: bunch2
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        baz: bunch3
    };
    const entity3 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
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

    t.deepEqual(
        denormalize(
            Just({
                bar: Just({
                    baz: Nothing()
                })
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Just({
                bunch: bunch2,
                foo: entity2.foo,
                baz: Just({
                    bunch: bunch3,
                    foo: entity3.foo
                })
            })
        })
    );
});

test('existing entity with existing deep list relations', t => {
    const namespace1 = uniqueId('namespace');
    const namespace2 = uniqueId('namespace');
    const namespace3 = uniqueId('namespace');
    const id1 = uniqueId('id');
    const id2 = uniqueId('id');
    const id3 = uniqueId('id');
    const id4 = uniqueId('id');
    const bunch1 = makeBunch(namespace1, id1);
    const bunch2 = makeBunch(namespace2, id2);
    const bunch3 = makeBunch(namespace3, id3);
    const bunch4 = makeBunch(namespace3, id4);
    const entity1 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        bar: bunch2
    };
    const entity2 = {
        id: uniqueId('id'),
        foo: uniqueId('foo'),
        baz: [ bunch3, bunch4 ]
    };
    const entity3 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const entity4 = {
        id: uniqueId('id'),
        foo: uniqueId('foo')
    };
    const data = {
        [ namespace1 ]: {
            [ id1 ]: entity1
        },
        [ namespace2 ]: {
            [ id2 ]: entity2
        },
        [ namespace3 ]: {
            [ id3 ]: entity3,
            [ id4 ]: entity4
        }
    };

    t.deepEqual(
        denormalize(
            Just({
                bar: Just({
                    baz: Nothing()
                })
            }),
            data,
            bunch1
        ),
        Just({
            bunch: bunch1,
            foo: entity1.foo,
            bar: Just({
                bunch: bunch2,
                foo: entity2.foo,
                baz: [
                    {
                        bunch: bunch3,
                        foo: entity3.foo
                    },
                    {
                        bunch: bunch4,
                        foo: entity4.foo
                    }
                ]
            })
        })
    );
});
