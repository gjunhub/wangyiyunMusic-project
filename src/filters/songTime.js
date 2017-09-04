export default function(value, f) {
    const date = new Date(value);

    let str = f ? f : 'm:s';

    str = str.replace('m', date.getMinutes());
    str = str.replace('s', date.getSeconds());

    let Str = str.split(':');

    Str[0] = Str[0] < 10? '0' + Str[0]: '' + Str[0];
    Str[1] = Str[1] < 10? '0' + Str[1]: '' + Str[1];
    str = Str.join(':');
    return str;

}
