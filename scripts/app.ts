declare var $,chrome;//JQuery And Chrome
class YoutubeGetter{
    //#region Current Tab Information
    public static Url: any;
    public static get IsYoutubeUrl(): boolean {
        if (!this.Url) return false;
        return this.Url.match(Resource.Regex.Youtube) != null;
    }
    //#endregion
        
    public static Display(StreamList: MediaGet.MediaInfo[]) {
        console.log(StreamList);
        var item = $("#YoutubePlusDownloadItem").clone();
        $("#YoutubePlusDownloadList").html("");
        $("#YoutubePlusDownloadList").append($(item));
        for (var i = 0; i < StreamList.length; i++) {
            AddMenuItem(StreamList[i]);
        }

        DisplayMenu();
    }

    public static async Main(Url): Promise<void> {//進入點
        var yt = new MediaGet.Extractors.YoutubeExtractor();
        this.Display(await yt.getMediaInfosAsync(Url));
    }
};