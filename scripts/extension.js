var Extension = (function () {
    function Extension() {
    }
    Extension.InnerString = function (Data, Start, End) {
        var result = Data.substring(0);
        result = result.substr(result.indexOf(Start) + Start.length);
        return result.substr(0, result.indexOf(End));
    };

    Extension.UrlToObject = function (Url) {
        var result = {};

        var index = Url.indexOf('?'), hostUrl;

        if (index > -1) {
            hostUrl = Url.split('?')[0];
            Url = Url.substring(index + 1);
        }

        var Params = Url.split('&');
        result['__host__'] = hostUrl;
        for (var Key in Params) {
            var KeyValue = Params[Key].split('=');
            result[KeyValue[0]] = decodeURIComponent(KeyValue[1]);
        }

        result.toString = function () {
            var host = this.__host__;

            if (host)
                host += '?';
            else
                host = '';

            var i = 0;
            var ary = new Array();
            for (var Key in this) {
                if (Key == '__host__' || Key == 'toString')
                    continue;
                ary[i++] = Key + "=" + encodeURIComponent(this[Key]);
            }

            return host + ary.join('&');
        };
        return result;
    };
    return Extension;
})();
//# sourceMappingURL=extension.js.map
