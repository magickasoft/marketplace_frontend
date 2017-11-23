import test from 'ava';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import {
    batchActions
} from 'redux-batched-actions';
import {
    uniqueId
} from 'lodash/fp';
import {
    Nothing,
    Just
} from 'data.maybe';

import {
    getMiddlewares
} from 'store';
import {
    makeBunch
} from 'utils/bunch';
import {
    update,
    merge
} from 'actions/data';
import {
    uploadImageStart,
    uploadImageSuccess,
    uploadImageFailure,
    uploadImage,
    submitOfferStart,
    submitOfferSuccess,
    submitOfferFailure,
    createOffer,
    updateOffer,
    createOrUpdateOffer,
    __RewireAPI__
} from '../modal';


const stub$denormalize = sinon.stub();
const stub$createOfferRequest = sinon.stub();
const stub$updateOfferRequest = sinon.stub();
const stub$s3SignRequest = sinon.stub();
const stub$selectOffer = sinon.stub();
const stub$receiveMediaPage = sinon.stub();
const stub$getState = sinon.stub();

const store = configureStore(getMiddlewares())(stub$getState);

test.before(() => {
    __RewireAPI__.__set__({
        denormalize: stub$denormalize,
        createOfferRequest: stub$createOfferRequest,
        updateOfferRequest: stub$updateOfferRequest,
        s3SignRequest: stub$s3SignRequest,
        selectOffer: stub$selectOffer,
        receiveMediaPage: stub$receiveMediaPage
    });
});

test.beforeEach(() => {
    stub$denormalize.reset();
    stub$denormalize.resetBehavior();
    stub$createOfferRequest.reset();
    stub$createOfferRequest.resetBehavior();
    stub$updateOfferRequest.reset();
    stub$updateOfferRequest.resetBehavior();
    stub$s3SignRequest.reset();
    stub$s3SignRequest.resetBehavior();
    stub$selectOffer.reset();
    stub$selectOffer.resetBehavior();
    stub$receiveMediaPage.reset();
    stub$receiveMediaPage.resetBehavior();
    stub$getState.reset();
    stub$getState.resetBehavior();
    store.clearActions();
});

test.serial('uploadImage() modal is Nothing', t => {
    t.plan(2);

    const size = uniqueId('size');
    const image = uniqueId('image');
    const offer = {
        modal: Nothing()
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(uploadImage(size, image))
        .then(() => {
            t.false(stub$s3SignRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('uploadImage() image is busy', t => {
    t.plan(2);

    const size = uniqueId('size');
    const image = uniqueId('image');
    const offer = {
        modal: Just({
            fields: {
                images: {
                    [ size ]: {
                        busy: true
                    }
                }
            }
        })
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(uploadImage(size, image))
        .then(() => {
            t.false(stub$s3SignRequest.called);
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('uploadImage() success', t => {
    t.plan(1);

    const size = uniqueId('size');
    const image = uniqueId('image');
    const offer = {
        modal: Just({
            fields: {
                images: {
                    [ size ]: {
                        busy: false
                    }
                }
            }
        })
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const response = uniqueId('url');
    stub$s3SignRequest
        .withArgs(image)
        .onFirstCall().returns(Promise.resolve(response));

    return store.dispatch(uploadImage(size, image))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    uploadImageStart(size),
                    uploadImageSuccess(size, response)
                ]
            );
        });
});

test.serial('uploadImage() failure', t => {
    t.plan(1);

    const size = uniqueId('size');
    const image = uniqueId('image');
    const offer = {
        modal: Just({
            fields: {
                images: {
                    [ size ]: {
                        busy: false
                    }
                }
            }
        })
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const errors = uniqueId('errors');
    stub$s3SignRequest
        .withArgs(image)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(uploadImage(size, image))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    uploadImageStart(size),
                    uploadImageFailure(size, errors)
                ]
            );
        });
});

test.serial('createOffer() success', t => {
    t.plan(1);

    const fields = uniqueId('fields');

    const response = {
        result: uniqueId('result'),
        entities: uniqueId('entities')
    };
    stub$createOfferRequest
        .withArgs(fields)
        .onFirstCall().returns(Promise.resolve(response));

    const selectOfferAction = uniqueId('selectOffer');
    stub$selectOffer
        .withArgs(response.result)
        .onFirstCall().returns(selectOfferAction);

    const receiveMediaPageAction = {
        type: uniqueId('action')
    };
    stub$receiveMediaPage
        .withArgs(1)
        .onFirstCall().returns(receiveMediaPageAction);

    return store.dispatch(createOffer(fields))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    submitOfferStart(),
                    batchActions([
                        submitOfferSuccess(),
                        merge(response.entities),
                        selectOfferAction
                    ]),
                    receiveMediaPageAction
                ]
            );
        });
});

test.serial('createOffer() failure', t => {
    t.plan(1);

    const fields = uniqueId('fields');

    const errors = uniqueId('errors');
    stub$createOfferRequest
        .withArgs(fields)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(createOffer(fields))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    submitOfferStart(),
                    submitOfferFailure(errors)
                ]
            );
        });
});

test.serial('updateOffer() offer does not exist', t => {
    t.plan(1);

    const diff = uniqueId('diff');
    const bunch = uniqueId('bunch');
    const state = {
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    stub$denormalize
        .withArgs(Nothing(), state.data, bunch)
        .onFirstCall().returns(Nothing());

    return store.dispatch(updateOffer(diff, bunch))
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('updateOffer() success', t => {
    t.plan(1);

    const diff = uniqueId('diff');
    const offerId = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), offerId);
    const state = {
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    const offerEntity = uniqueId('offer');
    stub$denormalize
        .withArgs(Nothing(), state.data, bunch)
        .onFirstCall().returns(Just(offerEntity));

    const selectOfferAction = uniqueId('selectOffer');
    stub$selectOffer
        .withArgs(bunch)
        .onFirstCall().returns(selectOfferAction);

    stub$updateOfferRequest
        .withArgs(diff, offerId)
        .onFirstCall().returns(Promise.resolve());

    return store.dispatch(updateOffer(diff, bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    batchActions([
                        submitOfferStart(),
                        update(diff, bunch),
                        selectOfferAction
                    ]),
                    submitOfferSuccess()
                ]
            );
        });
});

test.serial('updateOffer() failure', t => {
    t.plan(1);

    const diff = {
        foo: uniqueId('foo')
    };
    const offerId = uniqueId('id');
    const bunch = makeBunch(uniqueId('namespace'), offerId);
    const state = {
        data: uniqueId('data')
    };
    stub$getState
        .onFirstCall().returns(state);

    const offerEntity = {
        foo: uniqueId('foo'),
        bar: uniqueId('bar')
    };
    stub$denormalize
        .withArgs(Nothing(), state.data, bunch)
        .onFirstCall().returns(Just(offerEntity));

    const selectOfferAction = uniqueId('selectOffer');
    stub$selectOffer
        .withArgs(bunch)
        .onFirstCall().returns(selectOfferAction);

    const errors = uniqueId('errors');
    stub$updateOfferRequest
        .withArgs(diff, offerId)
        .onFirstCall().returns(Promise.reject(errors));

    return store.dispatch(updateOffer(diff, bunch))
        .then(() => {
            t.deepEqual(
                store.getActions(),
                [
                    batchActions([
                        submitOfferStart(),
                        update(diff, bunch),
                        selectOfferAction
                    ]),
                    batchActions([
                        submitOfferFailure(errors),
                        update({
                            foo: offerEntity.foo
                        }, bunch)
                    ])
                ]
            );
        });
});

test.serial('createOrUpdateOffer() modal is Nothing', t => {
    t.plan(1);

    const offer = {
        modal: Nothing()
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(createOrUpdateOffer())
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('createOrUpdateOffer() ui is busy', t => {
    t.plan(1);

    const offer = {
        modal: Just({
            busy: true
        })
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    return store.dispatch(createOrUpdateOffer())
        .then(() => {
            t.deepEqual(store.getActions(), []);
        });
});

test.serial('createOrUpdateOffer() offer updating', t => {
    t.plan(1);

    const stub$updateOffer = sinon.stub();
    __RewireAPI__.__set__({
        updateOffer: stub$updateOffer
    });

    const offer = {
        modal: Just({
            busy: false,
            fields: {
                bunch: Just(uniqueId('bunch')),
                title: uniqueId('title'),
                channel: Just(uniqueId('channel')),
                images: {
                    small: {
                        url: Just(uniqueId('url'))
                    }
                },
                redeem: {
                    code: {
                        selected: true,
                        value: Just(uniqueId('code'))
                    },
                    url: {
                        selected: false,
                        value: Just(uniqueId('url'))
                    }
                }
            }
        })
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const stub$updateOfferCurried = sinon.stub();
    const updateOfferAction = () => Promise.resolve();
    stub$updateOfferCurried
        .withArgs(offer.modal.get().fields.bunch.get())
        .onFirstCall().returns(updateOfferAction);

    stub$updateOffer
        .withArgs(offer.modal.map(({ fields }) => ({
            bunch: fields.bunch,
            title: fields.title,
            channel: fields.channel.get(),
            images: {
                small: fields.images.small.url.get()
            },
            redeem: {
                code: fields.redeem.code.value,
                url: Nothing()
            }
        })).get())
        .onFirstCall().returns(stub$updateOfferCurried);

    return store.dispatch(createOrUpdateOffer())
        .then(() => {
            t.deepEqual(store.getActions(), []);

            __RewireAPI__.__reset__('updateOffer');
        });
});

test.serial('createOrUpdateOffer() offer creating', t => {
    t.plan(1);

    const stub$createOffer = sinon.stub();
    __RewireAPI__.__set__({
        createOffer: stub$createOffer
    });

    const offer = {
        modal: Just({
            busy: false,
            fields: {
                bunch: Nothing(),
                title: uniqueId('title'),
                channel: Just(uniqueId('channel')),
                images: {
                    small: {
                        url: Just(uniqueId('url'))
                    }
                },
                redeem: {
                    code: {
                        selected: false,
                        value: Just(uniqueId('code'))
                    },
                    url: {
                        selected: true,
                        value: Nothing()
                    }
                }
            }
        })
    };
    const state = {
        ui: {
            createCampaign: {
                tabs: [ null, null, offer ]
            }
        }
    };
    stub$getState
        .onFirstCall().returns(state);

    const createOfferAction = () => Promise.resolve();
    stub$createOffer
        .withArgs(offer.modal.map(({ fields }) => ({
            bunch: fields.bunch,
            title: fields.title,
            channel: fields.channel.get(),
            images: {
                small: fields.images.small.url.get()
            },
            redeem: {
                code: Nothing(),
                url: fields.redeem.url.value
            }
        })).get())
        .onFirstCall().returns(createOfferAction);

    return store.dispatch(createOrUpdateOffer())
        .then(() => {
            t.deepEqual(store.getActions(), []);

            __RewireAPI__.__reset__('createOffer');
        });
});
