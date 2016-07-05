declare module MediaGet {
    class Exception {
        name: string;
        message: string;
    }
    class NotSupportException extends Exception {
        constructor();
    }
    class ArgumentsException extends Exception {
        constructor();
    }
    class UrlFormatException extends ArgumentsException {
        constructor();
    }
}
interface NodeList {
    toArray(): Array<Node>;
}
interface Array<T> {
    first(): T;
    last(): T;
}
interface String {
    innerString(start: string, end: string): string;
    splitCount(sig: string, count: number): string[];
}
declare module MediaGet {
    class UrlQueryStringBuilder {
        path: string;
        query: any;
        toString(): string;
        static parse(url: string): UrlQueryStringBuilder;
    }
}
declare module MediaGet {
    enum MethodTypes {
        GET = 0,
        POST = 1,
    }
    abstract class ExtractorBase implements IExtractor {
        abstract getMediaInfosAsync(url: string): Promise<MediaInfo[]>;
        isMatch(url: string): boolean;
        protected safeEval<T>(script: string): T;
        protected downloadStringAsync(method: MethodTypes, url: string, data?: any): Promise<string>;
        protected downloadJSONAsync(method: MethodTypes, url: string, data?: any): Promise<JSON>;
        private ParseHTML(HTMLString);
        private ParseXML(XMLString);
        protected downloadHtmlDocumentAsync(method: MethodTypes, url: string, data?: any): Promise<HTMLDocument>;
    }
}
declare module MediaGet.Extractors {
    class XuiteExtractor extends ExtractorBase {
        getMediaInfosAsync(url: string): Promise<MediaInfo[]>;
        private getMediaApiData(mediaId);
        private getMediaId(url);
    }
}
declare module MediaGet.Extractors {
    class YoutubeExtractor extends ExtractorBase {
        getMediaInfosAsync(url: string): Promise<MediaInfo[]>;
        private getMediaJObject(htmlDoc);
        private getDecodingFunction(url);
        private getStreamFormatList(mediaJSON);
        private getStreamMap(mediaJSON);
        private convertMediaTypes(mime);
    }
}
declare module MediaGet {
    interface IExtractor {
        getMediaInfosAsync(url: string): Promise<MediaInfo[]>;
        isMatch(url: string): boolean;
    }
}
declare module MediaGet {
    /**
     * 剖析結果的相關資訊
     */
    class MediaInfo {
        /**
         * 媒體的名稱或標題
         */
        name: string;
        /**
         * 媒體類型
         */
        type: MediaTypes;
        /**
         * 媒體來源網址
         */
        sourceUrl: string;
        /**
         * 媒體真實位址
         */
        realUrl: string;
        /**
         * 媒體長度(秒)
         */
        duration: number;
        /**
         * 媒體敘述
         */
        description: string;
        /**
         * 影片縮圖網址
         */
        thumbnail: URL;
        /**
         * 剖析結果來源類型
         */
        extractorType: Function;
        /**
         * 媒體其他相關屬性
         */
        attributes: any;
        clone(): MediaInfo;
    }
}
declare module MediaGet {
    enum MediaTypes {
        Video = 0,
        Audio = 1,
    }
}
import Extractors = MediaGet.Extractors;
declare module MediaGet {
    var matchRegex: {};
}
