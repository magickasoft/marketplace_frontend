import moment from 'moment';


export const FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

export function decode(json) {
    const dateTime = moment(json, FORMAT);

    return [ dateTime.format('YYYY-MM-DD'), dateTime.format('HH:mm') ];
}

export function encode([ date, time ]) {
    return moment(`${date}T${time}`).format(FORMAT);
}
