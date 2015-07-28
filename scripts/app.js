var YoutubeGetter = (function () {
    function YoutubeGetter() {
    }
    Object.defineProperty(YoutubeGetter, "IsYoutubeUrl", {
        get: function () {
            if (!this.Url)
                return false;
            return this.Url.match(Resource.Regex.Youtube) != null;
        },
        enumerable: true,
        configurable: true
    });

    YoutubeGetter.DecodingSignature = function (sig) {
        return eval(this['DecodingScript'].replace("{SIG}", sig));
    };

    //#region Main Process
    YoutubeGetter.Process = function (step) {
        switch (step) {
            case 0:
                this.LoadYoutubeConfig();
                break;
            case 1:
                this.InitDecodingScript();
                break;
            case 2:
                this.ConvertConfig();
                break;
            case 3:
                this.Display();
                break;
        }
    };

    //#endregion
    //#region Sub Process
    YoutubeGetter.LoadYoutubeConfig = function () {
        var request = new XMLHttpRequest();
        request.open('get', this.Url);
        request.onload = function () {
            var xmlString = request.responseText, parser = new DOMParser(), doc = parser.parseFromString(xmlString, "text/html");
            var scripts = doc.getElementsByTagName("script");
            for (var j = 0; j < scripts.length; j++) {
                if (scripts[j].innerText.indexOf("var ytplayer") > -1) {
                    YoutubeGetter.YoutubeConfig = eval(scripts[j].innerText + ";ytplayer.config;");
                    console.log("OK:Config資訊載入成功");
                    console.log(YoutubeGetter.YoutubeConfig);
                    if (YoutubeGetter.YoutubeConfig.args.url_encoded_fmt_stream_map == "") {
                        return;
                    }
                    YoutubeGetter.Process(1); //NextProcess
                    break;
                }
            }
        };
        request.send();
    };
    YoutubeGetter.InitDecodingScript = function () {
        function GetDecodingScript(script) {
            console.log("實作解碼程式...");
            var THIS = YoutubeGetter;

            //#region 取得解密程式碼
            THIS['FunctionName'] = Extension.InnerString(script, '"signature",', '(');

            var script1 = script.substring(script.indexOf("function " + THIS['FunctionName']));
            script1 = script1.substring(0, script1.indexOf(';function'));

            var script2 = script.substring(0, script.indexOf(";function " + THIS['FunctionName']) + 1);
            script2 = script2.substring(script2.lastIndexOf(";var") + 1);
            script2 = script2.substring(0, script2.length - 1);

            //#endregion
            //#region 切割解密函數
            var Fun0 = Extension.InnerString(script1, "function ", "(");
            var Fun1 = Extension.InnerString(script2, "var ", "=");
            var Fun0Body = script1.replace(' ' + THIS['FunctionName'], '');
            var Fun1Body = script2.substring(script2.indexOf("=") + 1);

            var regex = new RegExp(Fun1, "g");

            //#endregion
            //#region 寫入解碼程式
            var decodingObj = "var obj = function(value){" + "var " + Fun1 + "=" + Fun1Body + ";" + "var " + Fun0 + "=" + Fun0Body + ";" + "return " + Fun0 + "(value);" + "};" + "obj('{SIG}');";
            THIS['DecodingScript'] = decodingObj;

            //#endregion
            THIS.Process(2);
        }

        console.log("檢查是否為Live影片...");
        if (this.YoutubeConfig.args.livestream) {
            console.log("ERROR:不支援Live影片下載");
            return;
        }

        console.log("取得解碼程式...");
        var request = new XMLHttpRequest();
        request.open('get', location.protocol + this.YoutubeConfig.assets.js);
        request.onload = function () {
            GetDecodingScript(request.response);
        };
        request.send();
    };

    YoutubeGetter.ConvertConfig = function () {
        console.log("轉換真實位址");

        //#region 取得格式表
        this.FormatList = {};
        var Formats = YoutubeGetter.YoutubeConfig.args.fmt_list.split(',');
        for (var i = 0; i < Formats.length; i++) {
            var temp = Formats[i].split('/');
            this.FormatList[temp[0]] = temp[1];
        }

        //#endregion
        var stream_string = YoutubeGetter.YoutubeConfig.args.url_encoded_fmt_stream_map;
        stream_string += "," + YoutubeGetter.YoutubeConfig.args.adaptive_fmts;

        var streamList = stream_string.split(',');
        for (var key in streamList) {
            if (streamList[key] == "undefined")
                continue;
            var stream = Extension.UrlToObject(streamList[key]);
            var url = Extension.UrlToObject(stream.url);
            var signature = stream.s || stream.sig || stream.signature;
            if (!signature)
                signature = url.s || url.sig || url.signature;

            //#region 解密
			var old_signature = signature;
			signature = this.DecodingSignature(signature);
			
            if (signature.length != 81 || old_signature.length == 81) {//Fix https://www.youtube.com/watch?v=VCDu8Qa34rQ
                signature = old_signature;
            }
			console.log("舊簽章:" + old_signature);
			console.log("簽章:" + signature);
            //#endregion
            url.signature = signature;

            var types = stream.type.split(';');

            var Rate = Convert.GetRate(stream);
            var Size = Convert.GetSize(stream, this.FormatList);
            var Quality = stream.quality;
            if (!Quality)
                Quality = null;

            this.StreamList[key] = {
                'Url': url.toString(),
                'Itag': stream.itag,
                'FileExt': Convert.FileExtConvert(stream.itag, types[0].split('/')[1]),
                'Type': types[0].split('/')[0],
                'Codec': Convert.GetCodec(types[0].split('/')[0], types[1]),
                'Rate': Rate,
                'Size': Size,
                'Quality': Quality
            };
        }
        this.Process(3);
    };

    YoutubeGetter.Display = function () {
        console.log(this.StreamList);
        var item = $("#YoutubePlusDownloadItem").clone();
        $("#YoutubePlusDownloadList").html("");
        $("#YoutubePlusDownloadList").append($(item));
        for (var i = 0; i < this.StreamList.length; i++) {
            AddMenuItem(this.StreamList[i]);
        }

        DisplayMenu();
    };

    //#endregion
    YoutubeGetter.Main = function (Url) {
        YoutubeGetter.Url = Url;
        YoutubeGetter.Process(0); //開始程序
    };
    YoutubeGetter.StreamList = new Array();
    return YoutubeGetter;
})();
;
//# sourceMappingURL=app.js.map
