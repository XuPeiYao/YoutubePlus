class Extension {
    public static InnerString(Data: string, Start: string, End: string):string {
        var result = Data.substring(0);//Clone
        result = result.substr(result.indexOf(Start) + Start.length);
        return result.substr(0, result.indexOf(End));
    }
        
    public static UrlToObject(Url: string) {
        var result = {};

        var index = Url.indexOf('?'),hostUrl;

        if (index > -1) {
            hostUrl = Url.split('?')[0];
            Url = Url.substring(index + 1);
        }

        var Params = Url.split('&');
        result['__host__'] = hostUrl;
        for (var Key in Params) {
            var KeyValue: string[] = Params[Key].split('=');
            result[KeyValue[0]] = decodeURIComponent(KeyValue[1]);
        }

        result.toString = function () {
            var host = this.__host__;

            if (host) host += '?';
            else host = '';
                
            var i = 0;
            var ary = new Array();        
            for (var Key in this) {
                if (Key == '__host__' || Key == 'toString') continue;
                ary[i++] = Key + "=" + encodeURIComponent(this[Key]);
            }

            return host + ary.join('&');
        }
        return result;
    }
}