export default function(value) {
    value = Number(value);
    if (Number.isNaN(value)) {
        return 0;
    }
    return value < 10000 ? value : Math.ceil(value / 10000) + '万';
}
