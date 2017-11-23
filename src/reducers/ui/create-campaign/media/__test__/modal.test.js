import test from 'ava';
import sinon from 'sinon';
import {
    uniqueId,
    reduce
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    initialState,
    reducer,
    __RewireAPI__
} from '../modal';
import {
    OPEN,
    CLOSE,
    CHANGE_TITLE,
    CHANGE_DESCRIPTION,
    UPLOAD_IMAGE_START,
    UPLOAD_IMAGE_FAILURE,
    UPLOAD_IMAGE_SUCCESS,
    REMOVE_IMAGE,
    SUBMIT_OFFER_START,
    SUBMIT_OFFER_FAILURE,
    SUBMIT_OFFER_SUCCESS
} from 'actions/ui/create-campaign/media/modal';


const stub$defaultsPublishDate = sinon.stub();

test.before(() => {
    __RewireAPI__.__set__({
        defaultsPublishDate: stub$defaultsPublishDate
    });
});

test('not handled action', t => {
    const action1 = {
        type: uniqueId('action')
    };
    const state0 = initialState;

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.is(state1, state0);
    t.deepEqual(state1, state0);
});

test('OPEN', t => {
    const action1 = {
        type: OPEN,
        payload: Nothing()
    };
    const state00 = Nothing();

    const validDate1 = uniqueId('validDate');
    stub$defaultsPublishDate
        .withArgs([ Nothing(), Nothing() ])
        .onFirstCall().returns(validDate1);

    const state01 = reduce(reducer, state00, [ action1 ]);
    t.not(state01, state00);
    t.deepEqual(state01, Just({
        fields: {
            bunch: Nothing(),
            title: '',
            description: Nothing(),
            images: {},
            subtitle: Nothing(),
            termsAndConditions: Nothing(),
            validDate: validDate1,
            shareable: false,
            button: {
                text: Nothing()
            },
            redeem: {
                title: Nothing(),
                code: {
                    selected: true,
                    value: Nothing()
                },
                url: {
                    selected: false,
                    value: Nothing()
                }
            },
            website: {
                title: Nothing(),
                url: Nothing()
            },
            channel: Nothing()
        },
        busy: false,
        errors: Nothing(),
        channels: {
            results: Nothing(),
            busy: false,
            errors: Nothing()
        },
        modals: Just({
            images: {}
        })
    }));

    const fields2 = {
        bunch: uniqueId('bunch'),
        title: uniqueId('bunch'),
        description: Just(uniqueId('description')),
        images: {
            size_1: uniqueId('image size 1'),
            size_2: uniqueId('image size 2')
        },
        subtitle: Just(uniqueId('subtitle')),
        termsAndConditions: Just(uniqueId('termsAndConditions')),
        validDate: [ uniqueId('validDate'), uniqueId('validTime') ],
        shareable: false,
        button: {
            text: Just(uniqueId('button text'))
        },
        redeem: {
            title: Just(uniqueId('redeem title')),
            code: Nothing(),
            url: Just(uniqueId('redeem url'))
        },
        website: {
            title: Just(uniqueId('website title')),
            url: Just(uniqueId('website url'))
        },
        channel: uniqueId('channel')
    };

    const action2 = {
        type: OPEN,
        payload: Just(fields2)
    };
    const state10 = Nothing();

    const state11 = reduce(reducer, state10, [ action2 ]);
    t.not(state11, state10);
    t.deepEqual(state11, Just({
        fields: {
            bunch: Just(fields2.bunch),
            title: fields2.title,
            description: fields2.description,
            images: {
                size_1: {
                    url: Just(fields2.images.size_1),
                    busy: false,
                    errors: Nothing()
                },
                size_2: {
                    url: Just(fields2.images.size_2),
                    busy: false,
                    errors: Nothing()
                }
            },
            subtitle: fields2.subtitle,
            termsAndConditions: fields2.termsAndConditions,
            validDate: fields2.validDate,
            shareable: fields2.shareable,
            button: {
                text: fields2.button.text
            },
            redeem: {
                title: fields2.redeem.title,
                code: {
                    selected: false,
                    value: Nothing()
                },
                url: {
                    selected: true,
                    value: fields2.redeem.url
                }
            },
            website: {
                title: fields2.website.title,
                url: fields2.website.url
            },
            channel: Just(fields2.channel)
        },
        busy: false,
        errors: Nothing(),
        channels: {
            results: Nothing(),
            busy: false,
            errors: Nothing()
        },
        modals: Just({
            images: {}
        })
    }));
});

test('CLOSE | SUBMIT_OFFER_SUCCESS', t => {
    const action1 = {
        type: CLOSE
    };
    const state00 = Just(uniqueId('state'));

    const state01 = reduce(reducer, state00, [ action1 ]);
    t.not(state01, state00);
    t.is(state01, initialState);
    t.deepEqual(state01, Nothing());


    const action2 = {
        type: SUBMIT_OFFER_SUCCESS
    };
    const state10 = Just(uniqueId('state'));

    const state11 = reduce(reducer, state10, [ action2 ]);
    t.not(state11, state10);
    t.is(state11, initialState);
    t.deepEqual(state11, Nothing());
});

test('CHANGE_TITLE', t => {
    const action1 = {
        type: CHANGE_TITLE,
        payload: uniqueId('value')
    };
    const state0 = Just({
        fields: {
            bunch: Nothing(),
            title: uniqueId('title'),
            description: Nothing(),
            image: {
                url: Nothing(),
                busy: false,
                errors: Nothing()
            }
        },
        busy: false,
        errors: Just({
            title: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    });

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, Just({
        fields: {
            bunch: state0.get().fields.bunch,
            title: action1.payload,
            description: state0.get().fields.description,
            image: state0.get().fields.image
        },
        busy: state0.get().busy,
        errors: Just({
            title: Nothing(),
            description: state0.get().errors.get().description,
            common: Nothing()
        })
    }));
});

test('CHANGE_DESCRIPTION', t => {
    const action1 = {
        type: CHANGE_DESCRIPTION,
        payload: uniqueId('value')
    };
    const action2 = {
        type: CHANGE_DESCRIPTION,
        payload: ''
    };
    const state0 = Just({
        fields: {
            bunch: Nothing(),
            title: uniqueId('title'),
            description: Nothing(),
            image: {
                url: Nothing(),
                busy: false,
                errors: Nothing()
            }
        },
        busy: false,
        errors: Just({
            title: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    });

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, Just({
        fields: {
            bunch: state0.get().fields.bunch,
            title: state0.get().fields.title,
            description: Just(action1.payload),
            image: state0.get().fields.image
        },
        busy: state0.get().busy,
        errors: Just({
            title: state0.get().errors.get().title,
            description: Nothing(),
            common: Nothing()
        })
    }));

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, Just({
        fields: {
            bunch: state1.get().fields.bunch,
            title: state1.get().fields.title,
            description: Nothing(),
            image: state1.get().fields.image
        },
        busy: state1.get().busy,
        errors: Just({
            title: state1.get().errors.get().title,
            description: Nothing(),
            common: Nothing()
        })
    }));
});

test('UPLOAD_IMAGE_*', t => {
    const size = uniqueId('size');
    const action1 = {
        type: UPLOAD_IMAGE_START,
        payload: {
            size
        }
    };
    const action2 = {
        type: UPLOAD_IMAGE_FAILURE,
        payload: {
            size,
            errors: uniqueId('errors')
        }
    };
    const action3 = {
        type: UPLOAD_IMAGE_SUCCESS,
        payload: {
            size,
            url: uniqueId('url')
        }
    };
    const state0 = Just({
        fields: {
            images: {}
        },
        errors: Just({
            images: {},
            common: Just(uniqueId('errors'))
        })
    });

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, Just({
        fields: {
            images: {
                [ size ]: {
                    url: Nothing(),
                    busy: true,
                    errors: Nothing()
                }
            }
        },
        errors: Just({
            images: {},
            common: Nothing()
        })
    }));

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, Just({
        fields: {
            images: {
                [ size ]: {
                    url: state1.get().fields.images[ size ].url,
                    busy: false,
                    errors: Just(action2.payload.errors)
                }
            }
        },
        errors: state1.get().errors
    }));

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, Just({
        fields: {
            images: {
                [ size ]: {
                    url: state2.get().fields.images[ size ].url,
                    busy: true,
                    errors: Nothing()
                }
            }
        },
        errors: Just({
            images: {},
            common: Nothing()
        })
    }));

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.deepEqual(state4, Just({
        fields: {
            images: {
                [ size ]: {
                    url: Just(action3.payload.url),
                    busy: false,
                    errors: state3.get().fields.images[ size ].errors
                }
            }
        },
        errors: state3.get().errors
    }));
});

test('REMOVE_IMAGE', t => {
    const size1 = uniqueId('size');
    const size2 = uniqueId('size');
    const action1 = {
        type: REMOVE_IMAGE,
        payload: {
            size: size1
        }
    };
    const state0 = Just({
        fields: {
            images: {
                [ size1 ]: uniqueId('image'),
                [ size2 ]: uniqueId('image')
            }
        },
        errors: Just({
            images: {
                [ size1 ]: Just(uniqueId('image')),
                [ size2 ]: Just(uniqueId('image'))
            },
            common: Just(uniqueId('errors'))
        })
    });

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, Just({
        fields: {
            images: {
                [ size2 ]: state0.get().fields.images[ size2 ]
            }
        },
        errors: Just({
            images: {
                [ size2 ]: state0.get().errors.get().images[ size2 ]
            },
            common: Nothing()
        })
    }));
});

test('SUBMIT_OFFER_*', t => {
    const action1 = {
        type: SUBMIT_OFFER_START
    };
    const action2 = {
        type: SUBMIT_OFFER_FAILURE,
        payload: uniqueId('errors')
    };
    const action3 = {
        type: SUBMIT_OFFER_SUCCESS
    };
    const state0 = Just({
        fields: {
            bunch: Nothing(),
            title: uniqueId('title'),
            description: Nothing(),
            image: {
                url: Nothing(),
                busy: false,
                errors: Just({
                    common: Just(uniqueId('errors'))
                })
            }
        },
        busy: false,
        errors: Just({
            title: Just(uniqueId('errors')),
            description: Just(uniqueId('errors')),
            image: Just(uniqueId('errors')),
            common: Just(uniqueId('errors'))
        })
    });

    const state1 = reduce(reducer, state0, [ action1 ]);
    t.not(state1, state0);
    t.deepEqual(state1, Just({
        fields: state0.get().fields,
        busy: true,
        errors: Nothing()
    }));

    const state2 = reduce(reducer, state1, [ action2 ]);
    t.not(state2, state1);
    t.deepEqual(state2, Just({
        fields: state1.get().fields,
        busy: false,
        errors: Just(action2.payload)
    }));

    const state3 = reduce(reducer, state2, [ action1 ]);
    t.not(state3, state2);
    t.deepEqual(state3, Just({
        fields: state2.get().fields,
        busy: true,
        errors: Nothing()
    }));

    const state4 = reduce(reducer, state3, [ action3 ]);
    t.not(state4, state3);
    t.is(state4, initialState);
    t.deepEqual(state4, initialState);
});
