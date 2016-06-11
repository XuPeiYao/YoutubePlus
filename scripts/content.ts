declare var $,chrome;
var port = chrome.runtime.connect();
console.clear();
//#region 按鈕建立
function CreateDownloadButton() : boolean{
    console.log("Call Create Download Button");
    if ($("#YoutubePlusButton") && $("#YoutubePlusButton").length > 0) {
        console.log("Page Had Download Button!");
        return false;//防止重複建立按鈕
    }
    var DownloadButton = $(".addto-button").clone();
    $(DownloadButton).attr('id', 'YoutubePlusButton');
    $(DownloadButton).removeClass('yt-uix-clickcard-target');
    $(DownloadButton).removeClass("addto-button");
    $(DownloadButton).addClass("downloadYoutube-icon-button");
    $(DownloadButton).css('width', 'auto');
    $(DownloadButton).attr('title', '下載');
    $(DownloadButton).attr('data-tooltip-text', '下載');
    $(DownloadButton).find("span").html("下載");
    $(DownloadButton).attr("data-menu-content-id", "YoutubePlusMenu");
    $('[data-trigger-for="action-panel-share"]').after(DownloadButton);
    CreateDownloadMenu();
    $("#YoutubePlusButton").off("click");
    $("#YoutubePlusButton").on('click', OnClick); //連結事件函數
    return true;
}
function CreateDownloadMenu() {//產生下載選單
    $('#YoutubePlusMenu').remove();
    $("body").append($(Resource.MenuTemplet));

    $('body').click(function (evt) {
        
        if ($(evt.target).parents("#YoutubePlusButton").length > 0) return;//Show Button
        if ($(evt.target).parents("#YoutubePlusMenu").length > 0) return;//Show Menu
        if (evt.target.id != "YoutubePlusMenu"
            && evt.target.id != "YoutubePlusButton"
            ) {
            $('#YoutubePlusMenu').hide();
        }
    });
    $('#YoutubePlusMenu').hide();
} 

chrome.runtime.onMessage.addListener((message, sender, sendResponse)=> {//等待接受建立按鈕指令
    if (!message.action || message.action != "createButton") return;
    CreateDownloadButton();
})
//#endregion


//#region 監聽DOM NODE更新
/*
function nodeInsertedCallback(event) {
    if (event.target.nodeName && event.target.nodeName != "DIV") return;
    if ($(event.target).attr('id') == "YoutubePlusMenu") return;
    
    var Target = ["watch-header"];    
    if (Target.indexOf($(event.target).attr("id")) > -1) return;
    console.log("Header Update");
    if (CreateDownloadButton()) {
    }
};
document.addEventListener('DOMNodeInserted', nodeInsertedCallback);
*/
//#endregion

CreateDownloadButton();//初次載入頁面執行建立按鈕動作

function OnClick() {
    YoutubeGetter.Main(window.location.href);
}

function DisplayMenu() {
    var left = $("#YoutubePlusButton").offset().left;
    var top = $("#YoutubePlusButton").offset().top + $("#YoutubePlusButton").height();
    $('#YoutubePlusMenu').css("left", left).css("top", top);
    $('#YoutubePlusMenu').show();
    console.log("顯示清單");
}

function AddMenuItem(Info) {
    var item = $("#YoutubePlusDownloadItem").clone();
    $(item).removeAttr("id");
    $(item).removeAttr("hidden");
    $(item).removeAttr("style");
    if (Info.attributes.codecs && Info.attributes.size) {
        $(item).find(".item-type").html("[影音]");
    } else if (Info.attributes.codecs) {
        $(item).find(".item-type").html("[音訊]");
    } else if (Info.attributes.size) {
        $(item).find(".item-type").html("[視訊]");
    } else if (Info.attributes.mime =="video/x-flv") {
        $(item).find(".item-type").html("[影音]");
    }

    if (Info.type == MediaGet.MediaTypes.Video) {
        $(item).find(".item-info").html(Info.attributes.size);
    } else {
        var time :any = "";
        try {
            time = (parseInt(Info.attributes.bitrate) / 1000);
            time = time.toString().split('.')[0];
        } catch (e) { }
        $(item).find(".item-info").html(time + " kbps");
    }
    
    $(item).find(".item-name").html(Info.attributes.mime.split('/')[1]);

    $(item).find(".item-icon").removeAttr("title");
    $(item).find(".item-icon").addClass(Info.type == MediaGet.MediaTypes.Video?"video-icon":"audio-icon");


    $(item).attr("file-ext", Info.attributes.mime.split('/')[1]);
    $(item).attr("file-url", Info.realUrl);
    $(item).on('click', (e) => {
        var target = $(e.target).parents(".addto-playlist-item");
        if (target.length == 0) target = e.target;
        else target = target[0];
        SaveFile(
            $(target).attr("file-url"),
            Convert.GetFileName($('meta[itemprop="name"]').attr('content'))
            + "." + $(target).attr("file-ext")
        );
    });
    $("#YoutubePlusDownloadList").append($(item));
}

function SaveFile(Url, FileName) {
    chrome.runtime.sendMessage(
        chrome.runtime.id,
        { action: "downloadFile", filename: FileName, url: Url }
    );
}