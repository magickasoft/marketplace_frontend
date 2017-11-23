import moment from 'moment';

export function formatDate(date) {
    return moment(date).format('MMM Do');
}

export function formatDateTime([ date, time ]) {
    return moment(`${date}T${time}`).format('MMM D HH:mm');
}

export const getISOStringFromDate = date => new Date(date).toISOString();

export function dateToHumanReadable(date) {

    const currentDate = moment().format('YYYY-MM-DD');
    const yesterday = moment().add(-1, 'days').format('YYYY-MM-DD');

    switch (date) {
        case currentDate: {
            return 'Today';
        }

        case yesterday: {
            return 'Yesterday';
        }

        default: {
            return formatDate(date);
        }
    }
}
