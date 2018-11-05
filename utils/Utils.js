export default class Utils {
    static isset() {
        const a = arguments, l = a.length;
        let i = 0;
        if (l === 0) {
            console.log('Empty isset');
        }

        while (i !== l) {
            if (typeof(a[i]) === 'undefined' || a[i] === null) {
                return false;
            } else {
                i++;
            }
        }
        return true;
    }
}