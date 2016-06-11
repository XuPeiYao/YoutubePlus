declare var MediaGet,$,chrome;//JQuery And Chrome
class YoutubeGetter{
    //#region Current Tab Information
    public static Url: any;
    public static get IsYoutubeUrl(): boolean {
        if (!this.Url) return false;
        return this.Url.match(Resource.Regex.Youtube) != null;
    }
    //#endregion

    public static StreamList : any = new Array();
    
    public static Display() {
        console.log(this.StreamList);
        var item = $("#YoutubePlusDownloadItem").clone();
        $("#YoutubePlusDownloadList").html("");
        $("#YoutubePlusDownloadList").append($(item));
        for (var i = 0; i < this.StreamList.length; i++) {
            AddMenuItem(this.StreamList[i]);
        }

        DisplayMenu();
    }
    //#endregion

    public static async Main(Url): Promise<void> {//進入點
        var yt = new MediaGet.Extractors.YoutubeExtractor();
        this.StreamList = await yt.getMediaInfosAsync(Url);
        this.Display();
    }
};