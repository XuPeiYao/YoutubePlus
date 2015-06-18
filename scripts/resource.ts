class Resource {
    public static Regex: any = {
        Youtube: /(youtu.be\/|v\/|u\/\w\/|feature|\/embed\/|watch\?v=|[a-zA-Z0-9_\-]+\?v=)([^#\&\?\n<>\'\"]*)/gi
    }

    public static MenuTemplet: string = '<div id="YoutubePlusMenu" class="yt-ui-menu-content yt-uix-menu-content yt-uix-menu-content-external yt-uix-kbd-nav" tabindex="-1" style="z-index:20;min-width: 23px; left: 38px; top: 618px;"> <div class="hide-on-create-pl-panel"> <h3>下載</h3> </div> <div class="add-to-widget"> <div class="addto-menu"> <div id="Download-list-panel" class="menu-panel active-panel addto-playlist-panel yt-scrollbar"> <div class="playlists yt-uix-scroller"> <ul id="YoutubePlusDownloadList" role="menu" tabindex="0" class="yt-uix-kbd-nav yt-uix-kbd-nav-list"> <li style="display:none" id="YoutubePlusDownloadItem" class="addto-playlist-item yt-uix-button-menu-item"> <span class="item-type playlist-name" style="width: 40px;">webm</span> <span class="item-name playlist-name">MP4</span> <span class="item-info playlist-name">MP4</span> <span class="item-icon yt-sprite" title="影音"></span> </li> </ul> </div> </div> </div> </div></div>';

    public static AudioItags: any = {
        //AAC
        139: {
            Class: 'Audio',
            FileExt: 'm4a',
            AudioCodec: 'AAC',
            ABR:48
        },
        140: {
            Class: 'Audio',
            FileExt: 'm4a',
            AudioCodec: 'AAC',
            ABR: 128
        },
        141: {
            Class: 'Audio',
            FileExt: 'm4a',
            AudioCodec: 'AAC',
            ABR: 256
        },

        //VORB
        171: {
            Class: 'Audio',
            FileExt: 'webm',
            AudioCodec: 'VORB',
            ABR: 128
        },
        172: {
            Class: 'Audio',
            FileExt: 'webm',
            AudioCodec: 'VORB',
            ABR: 256
        },

        //OPUS
        249: {
            Class: 'Audio',
            FileExt: 'webm',
            AudioCodec: 'OPUS',
            ABR: 50
        },
        250: {
            Class: 'Audio',
            FileExt: 'webm',
            AudioCodec: 'OPUS',
            ABR: 70
        },
        251: {
            Class: 'Audio',
            FileExt: 'webm',
            AudioCodec: 'OPUS',
            ABR: 160
        }
    }

    public static FileNameChar: any = {//檔案名稱對應表
        '\\': '-',
        '/' : '-',
        ':' : '.',
        '*' : '.',
        '?' : '.',
        '「' : '{',
        '」' : '}',
        '<' : '(',
        '>' : ')',
        '|' : '-'
    };

    public static ExtMap: any = {
        '3gpp' : '3gp',
        'x-flv' : 'flv'
    }
}