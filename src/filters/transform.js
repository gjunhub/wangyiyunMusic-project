export default function(value, f) {
    const date = new Date(value);

    let str = f ? f : 'y-m-d H:i:s';

    str = str.replace('y', date.getFullYear());
    str = str.replace('m', date.getMonth() + 1);
    str = str.replace('d', date.getDate());
    str = str.replace('H', date.getHours());
    str = str.replace('i', date.getMinutes());
    str = str.replace('s', date.getSeconds());

    return str;

}
