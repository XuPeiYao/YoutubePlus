var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var MediaGet;
(function (MediaGet) {
    "use strict";
    class Exception {
    }
    MediaGet.Exception = Exception;
    class NotSupportException extends Exception {
        constructor() {
            super();
            this.name = "不支援項目";
        }
    }
    MediaGet.NotSupportException = NotSupportException;
    class ArgumentsException extends Exception {
        constructor() {
            super();
            this.name = "不正確的參數";
        }
    }
    MediaGet.ArgumentsException = ArgumentsException;
    class UrlFormatException extends ArgumentsException {
        constructor() {
            super();
            this.name = "不正確的參數";
            this.message = "不支援的目標連結";
        }
    }
    MediaGet.UrlFormatException = UrlFormatException;
})(MediaGet || (MediaGet = {}));
NodeList.prototype.toArray = function () {
    var result = new Array();
    for (var i = 0; i < this.length; i++)
        result.push(this[i]);
    return result;
};
Array.prototype.first = function () {
    return this[0];
};
Array.prototype.last = function () {
    return this[this.length - 1];
};
String.prototype.innerString = function (start, end) {
    var index = this.indexOf(start);
    if (index < 0)
        return null;
    var result = this.substring(index + start.length);
    index = result.indexOf(end);
    if (index < 0)
        return null;
    return result.substring(0, index);
};
String.prototype.splitCount = function (sig, count) {
    var result = new Array();
    var temp = this.split(sig);
    for (var i = 0; i < count - 1; i++) {
        result.push(temp.shift());
    }
    result.push(temp.join(sig));
    return result;
};
var MediaGet;
(function (MediaGet) {
    "use strict";
    class UrlQueryStringBuilder {
        constructor() {
            this.query = {};
        }
        toString() {
            var result = [];
            for (var key in this.query) {
                result.push(key + "=" + encodeURIComponent(this.query[key]));
            }
            return this.path + "?" + result.join('&');
        }
        static parse(url) {
            var result = new UrlQueryStringBuilder();
            var temp = url.splitCount('?', 2);
            result.path = temp[0];
            temp[1].split('&').forEach(item => {
                var keyValue = item.splitCount('=', 2);
                result.query[keyValue[0]] = decodeURIComponent(keyValue[1]);
            });
            return result;
        }
    }
    MediaGet.UrlQueryStringBuilder = UrlQueryStringBuilder;
})(MediaGet || (MediaGet = {}));
var MediaGet;
(function (MediaGet) {
    "use strict";
    (function (MethodTypes) {
        MethodTypes[MethodTypes["GET"] = 0] = "GET";
        MethodTypes[MethodTypes["POST"] = 1] = "POST";
    })(MediaGet.MethodTypes || (MediaGet.MethodTypes = {}));
    var MethodTypes = MediaGet.MethodTypes;
    class ExtractorBase {
        isMatch(url) {
            return MediaGet.matchRegex[this.constructor].test(url);
        }
        ;
        safeEval(script) {
            return eval("(function(){" + script + "})()");
        }
        //#region Extractor Factory
        downloadStringAsync(method, url, data) {
            return __awaiter(this, void 0, Promise, function* () {
                return new Promise((resolve, reject) => {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState !== 4)
                            return;
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(xhr.responseText);
                        }
                        else {
                            reject(xhr.statusText);
                        }
                    };
                    xhr.open(MethodTypes[method], url, true);
                    xhr.send();
                });
            });
        }
        downloadJSONAsync(method, url, data) {
            return __awaiter(this, void 0, Promise, function* () {
                return JSON.parse(yield this.downloadStringAsync(method, url, data));
            });
        }
        ParseHTML(HTMLString) {
            return new DOMParser().parseFromString(HTMLString, "text/html");
        }
        ParseXML(XMLString) {
            return new DOMParser().parseFromString(XMLString, "text/xml");
        }
        downloadHtmlDocumentAsync(method, url, data) {
            return __awaiter(this, void 0, Promise, function* () {
                return this.ParseHTML(yield this.downloadStringAsync(method, url, data));
            });
        }
    }
    MediaGet.ExtractorBase = ExtractorBase;
})(MediaGet || (MediaGet = {}));
var MediaGet;
(function (MediaGet) {
    var Extractors;
    (function (Extractors) {
        "use strict";
        /*
         * 針對Xuite的剖析器
         */
        class XuiteExtractor extends MediaGet.ExtractorBase {
            getMediaInfosAsync(url) {
                return __awaiter(this, void 0, Promise, function* () {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        if (!this.isMatch(url))
                            throw new MediaGet.UrlFormatException();
                        var mediaId = this.getMediaId(url);
                        var apiData = yield this.getMediaApiData(mediaId);
                        var result = new Array();
                        var baseInfo = new MediaGet.MediaInfo();
                        baseInfo.sourceUrl = url;
                        baseInfo.name = apiData.title;
                        baseInfo.duration = parseFloat(apiData.duration);
                        baseInfo.description = apiData.description;
                        baseInfo.thumbnail = apiData.thumb;
                        baseInfo.extractorType = XuiteExtractor;
                        baseInfo.type = apiData.type == 'video' ? MediaGet.MediaTypes.Video : MediaGet.MediaTypes.Audio;
                        baseInfo.attributes.author = apiData.author_name;
                        if (apiData.src) {
                            var def_src = baseInfo.clone();
                            def_src.realUrl = apiData.src;
                            if (baseInfo.type == MediaGet.MediaTypes.Video) {
                                def_src.attributes.size = '480x360';
                                def_src.attributes.quality = 'default';
                                def_src.attributes.mime = 'video/mp4';
                            }
                            else if (baseInfo.type == MediaGet.MediaTypes.Audio) {
                                def_src.attributes.mime = 'audio/mp3';
                            }
                            result.push(def_src);
                        }
                        if (apiData.flv_src) {
                            var flv_src = baseInfo.clone();
                            flv_src.realUrl = apiData.flv_src;
                            if (baseInfo.type == MediaGet.MediaTypes.Video) {
                                flv_src.attributes.size = '480x360';
                                flv_src.attributes.quality = 'default';
                                flv_src.attributes.mime = 'video/x-flv';
                            }
                            else {
                                flv_src.attributes.mime = 'audio/x-flv';
                            }
                            result.push(flv_src);
                        }
                        if (apiData.hq_src) {
                            var hq_src = baseInfo.clone();
                            hq_src.realUrl = apiData.hq_src;
                            if (baseInfo.type == MediaGet.MediaTypes.Video) {
                                hq_src.attributes.size = '1280x720';
                                hq_src.attributes.quality = 'hq';
                            }
                            hq_src.attributes.mime = 'video/mp4';
                            result.push(hq_src);
                        }
                        if (apiData.hd1080_src) {
                            var hd1080_src = baseInfo.clone();
                            hd1080_src.realUrl = apiData.hd1080_src;
                            if (baseInfo.type == MediaGet.MediaTypes.Video) {
                                hd1080_src.attributes.size = '1920x1080';
                                hd1080_src.attributes.quality = 'hd';
                            }
                            hd1080_src.attributes.mime = 'video/mp4';
                            result.push(hd1080_src);
                        }
                        return result;
                    }));
                });
            }
            getMediaApiData(mediaId) {
                return __awaiter(this, void 0, Promise, function* () {
                    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                        var apiData = yield this.downloadHtmlDocumentAsync(MediaGet.MethodTypes.GET, `http://vlog.xuite.net/flash/player?media=${mediaId}`);
                        var propertys = apiData.getElementsByTagName('property');
                        var result = {};
                        for (var i = 0; i < propertys.length; i++) {
                            var key = atob(propertys[i].getAttribute('id'));
                            var value = atob(propertys[i].textContent);
                            if (!value || value.length)
                                result[key] = decodeURIComponent(value);
                        }
                        return result;
                    }));
                });
            }
            getMediaId(url) {
                return btoa(atob(url.split('/').last().innerString('-', '.')));
            }
        }
        Extractors.XuiteExtractor = XuiteExtractor;
    })(Extractors = MediaGet.Extractors || (MediaGet.Extractors = {}));
})(MediaGet || (MediaGet = {}));
var MediaGet;
(function (MediaGet) {
    var Extractors;
    (function (Extractors) {
        "use strict";
        /*
         * 針對Youtube的剖析器
         */
        class YoutubeExtractor extends MediaGet.ExtractorBase {
            getMediaInfosAsync(url) {
                return __awaiter(this, void 0, Promise, function* () {
                    if (!this.isMatch(url))
                        throw new MediaGet.UrlFormatException();
                    var youtubePage = yield this.downloadHtmlDocumentAsync(MediaGet.MethodTypes.GET, url, null);
                    var mediaJSON = this.getMediaJObject(youtubePage);
                    if (mediaJSON['args']['livestream'] == '1')
                        throw new MediaGet.NotSupportException();
                    var description = youtubePage.querySelector('meta[name="description"]').getAttribute("content");
                    var decodingFunction = yield this.getDecodingFunction("https:" + mediaJSON['assets']['js']);
                    var streamFormatList = this.getStreamFormatList(mediaJSON);
                    var streamMap = this.getStreamMap(mediaJSON);
                    var result = new Array();
                    streamMap.forEach(item => {
                        var resultItem = new MediaGet.MediaInfo();
                        //#region 通用屬性
                        resultItem.sourceUrl = url;
                        resultItem.extractorType = YoutubeExtractor;
                        resultItem.name = mediaJSON['args']['title'];
                        resultItem.duration = mediaJSON['args']['length_seconds'];
                        resultItem.description = description;
                        resultItem.thumbnail = mediaJSON['args']['thumbnail_url'];
                        resultItem.type = this.convertMediaTypes(item['type']['mime']);
                        //#endregion
                        //#region 連結解密
                        var realUrlBuilder = MediaGet.UrlQueryStringBuilder.parse(item['url']);
                        var urlSignature = realUrlBuilder.query['s'] || realUrlBuilder.query['sig'] || realUrlBuilder.query['signature'];
                        var itemSignature = item['s'] || item['sig'] || item['signature'];
                        realUrlBuilder.query['signature'] = decodingFunction(urlSignature || itemSignature, urlSignature != null);
                        resultItem.realUrl = realUrlBuilder.toString();
                        //#endregion
                        //#region 擴充屬性
                        resultItem.attributes['mime'] = item['type']['mime'];
                        resultItem.attributes['codecs'] = item['type']['codecs'];
                        resultItem.attributes['author'] = mediaJSON['args']['author'];
                        if (resultItem.type == MediaGet.MediaTypes.Video) {
                            resultItem.attributes['size'] = item['size'] || streamFormatList[item['itag']];
                            resultItem.attributes['quality'] = item['quality'];
                        }
                        else if (resultItem.type == MediaGet.MediaTypes.Audio) {
                            resultItem.attributes['bitrate'] = item['bitrate'];
                        }
                        //#endregion
                        result.push(resultItem);
                    });
                    return result;
                });
            }
            getMediaJObject(htmlDoc) {
                var script = htmlDoc.querySelectorAll("script").toArray()
                    .filter(item => item.textContent != null && item.textContent.indexOf("var ytplayer") > -1)[0].textContent;
                return this.safeEval(script + ";return ytplayer.config;");
            }
            getDecodingFunction(url) {
                return __awaiter(this, void 0, Promise, function* () {
                    var playerScript = yield this.downloadStringAsync(MediaGet.MethodTypes.GET, url);
                    var functionName = playerScript.innerString('"signature",', "(");
                    console.log("FunctionName " + functionName);
                    if (functionName == null || functionName.length == 0)
                        return (value, inUrl) => value;
                    var functionBody = `function${playerScript.innerString(`,${functionName}=function`, '}')};}`;
                    console.log("FunctionBody " + functionBody);
                    var functionRefName = functionBody.innerString(";\n", ".");
                    var functionRef = playerScript.innerString("var " + functionRefName + "=", ";var");
                    var args = functionBody.innerString("(", ")");
                    functionBody = functionBody.substring(functionBody.indexOf("{") + 1);
                    functionBody = "function(" + args + "){var " + functionRefName + "=" + functionRef + ";" + functionBody;
                    return (value, inUrl) => {
                        var scriptResult = this.safeEval("return (" + functionBody + ")('" + value + "');");
                        var result = value;
                        if (inUrl) {
                            if (value.length != 81 && scriptResult.length == 81)
                                result = scriptResult;
                        }
                        else {
                            result = scriptResult;
                        }
                        return result;
                    };
                });
            }
            getStreamFormatList(mediaJSON) {
                var result = {};
                mediaJSON['args']['fmt_list'].split(',').map(item => item.split('/')).forEach(item => {
                    result[item[0]] = item[1];
                });
                ;
                return result;
            }
            getStreamMap(mediaJSON) {
                function getStreamMapByKey(_mediaJSON_, key) {
                    if (!_mediaJSON_['args'][key])
                        return null;
                    var result = _mediaJSON_['args'][key].split(',')
                        .map(item => item.split('&'))
                        .map(item => {
                        var temp = {};
                        item.forEach(item2 => {
                            var keyValue = item2.splitCount('=', 2);
                            temp[keyValue[0]] = decodeURIComponent(keyValue[1]);
                        });
                        return temp;
                    });
                    result.forEach(item => {
                        var hasCodecs = item['type'].indexOf(';');
                        var typeJSON = {};
                        typeJSON['mime'] = item['type'].substring(0, hasCodecs == -1 ? item['type'].length : hasCodecs);
                        console.log(typeJSON);
                        if (hasCodecs > -1) {
                            var temp = item['type'].innerString('"', '"');
                            if (temp)
                                temp.replace(/\+/g, "");
                            typeJSON['codecs'] = temp;
                        }
                        item['type'] = typeJSON;
                    });
                    return result;
                }
                return getStreamMapByKey(mediaJSON, 'url_encoded_fmt_stream_map').concat(getStreamMapByKey(mediaJSON, 'adaptive_fmts') || []);
            }
            convertMediaTypes(mime) {
                mime = mime.split('/')[0];
                if (mime == 'video')
                    return MediaGet.MediaTypes.Video;
                return MediaGet.MediaTypes.Audio;
            }
        }
        Extractors.YoutubeExtractor = YoutubeExtractor;
    })(Extractors = MediaGet.Extractors || (MediaGet.Extractors = {}));
})(MediaGet || (MediaGet = {}));
var MediaGet;
(function (MediaGet) {
    "use strict";
    /**
     * 剖析結果的相關資訊
     */
    class MediaInfo {
        constructor() {
            /**
             * 媒體其他相關屬性
             */
            this.attributes = {};
        }
        /*
         * 取得深層副本
         */
        clone() {
            var result = new MediaInfo();
            for (var key in result) {
                if (key == "attributes") {
                    for (var key2 in this[key])
                        result.attributes[key2] = this.attributes[key2];
                }
                else {
                    result[key] = this[key];
                }
            }
            return result;
        }
    }
    MediaGet.MediaInfo = MediaInfo;
})(MediaGet || (MediaGet = {}));
var MediaGet;
(function (MediaGet) {
    (function (MediaTypes) {
        MediaTypes[MediaTypes["Video"] = 0] = "Video";
        MediaTypes[MediaTypes["Audio"] = 1] = "Audio";
    })(MediaGet.MediaTypes || (MediaGet.MediaTypes = {}));
    var MediaTypes = MediaGet.MediaTypes;
})(MediaGet || (MediaGet = {}));
var Extractors = MediaGet.Extractors;
var MediaGet;
(function (MediaGet) {
    MediaGet.matchRegex = {
        [MediaGet.Extractors.YoutubeExtractor]: /http(s)?:\/\/www.youtube.com\/watch\?v=.+/
    };
})(MediaGet || (MediaGet = {}));
//# sourceMappingURL=MediaGet.js.map