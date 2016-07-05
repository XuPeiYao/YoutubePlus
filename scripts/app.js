var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class YoutubeGetter {
    static get IsYoutubeUrl() {
        if (!this.Url)
            return false;
        return this.Url.match(Resource.Regex.Youtube) != null;
    }
    //#endregion
    static Display(StreamList) {
        console.log(StreamList);
        var item = $("#YoutubePlusDownloadItem").clone();
        $("#YoutubePlusDownloadList").html("");
        $("#YoutubePlusDownloadList").append($(item));
        for (var i = 0; i < StreamList.length; i++) {
            AddMenuItem(StreamList[i]);
        }
        DisplayMenu();
    }
    static Main(Url) {
        return __awaiter(this, void 0, Promise, function* () {
            var yt = new MediaGet.Extractors.YoutubeExtractor();
            this.Display(yield yt.getMediaInfosAsync(Url));
        });
    }
}
;
//# sourceMappingURL=app.js.map