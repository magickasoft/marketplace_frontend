import {
    split,
    curry,
    compose,
    property
} from 'lodash/fp';
import {
    Just
} from 'data.maybe';

const pSecond = property(1);
const pHead = property(0);

const splitSecondComma = compose(pSecond, split(','));
const splitHeadComma = compose(pHead, split(','));
const splitSecondColon = compose(pSecond, split(':'));
const splitHeadSemicolon = compose(pHead, split(';'));
const prefBase64 = compose(
    splitHeadSemicolon,
    splitSecondColon,
    splitHeadComma
);

export function dataURItoBlob(dataURI) {
    const byteString = atob(splitSecondComma(dataURI));
    const mimeString = prefBase64(dataURI);

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}

export const imageAsset = curry(
    lineString => {
        const [width, height] = split('x', lineString);

        return Just({ width, height });
    }
);
