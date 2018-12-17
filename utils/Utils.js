export default class Utils {
    static isset() {
        let i = 0;
        if (arguments.length === 0) {
            console.log("Empty isset");
        }

        while (i !== arguments.length) {
            if (typeof(arguments[i]) === "undefined" || arguments[i] === null || arguments[i].trim() === "") {
                return false;
            } else {
                i++;
            }
        }
        return true;
    }
}