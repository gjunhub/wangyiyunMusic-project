export default function(value) {
    value = Number(value);
    if (Number.isNaN(value)) {
        return 0;
    }
    return value < 10 ? '0' + value: '' + value;
}
