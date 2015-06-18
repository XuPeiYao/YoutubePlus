var Convert = (function () {
    function Convert() {
    }
    Convert.SecondToString = function (sec) {
        sec -= 1;
        var hours = Math.floor(sec / 3600);
        var minutes = Math.floor((sec - (hours * 3600)) / 60);
        var seconds = sec - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var time = hours + ':' + minutes + ':' + seconds;
        return time;
    };

    Convert.FileExtConvert = function (itag, ext) {
        var Itag = parseInt(itag);
        if (Resource.AudioItags[Itag]) {
            return Resource.AudioItags[Itag].FileExt;
        }

        if (Resource.ExtMap[ext]) {
            ext = Resource.ExtMap[ext];
        }

        return ext;
    };

    Convert.GetCodec = function (Type, codec) {
        var result = null;
        result = {
            'Audio': null,
            'Video': null
        };

        if (!codec)
            return result;
        codec = codec.replace(/(\+|"|codecs=)/g, "");

        if (Type == 'audio') {
            result.Audio = codec;
            result.Video = null;
        } else {
            var C = codec.split(',');
            result.Audio = C[1];
            result.Video = C[0];
        }

        if (!result.Audio)
            result.Audio = null;

        return result;
    };

    Convert.GetRate = function (stream) {
        var Itag = parseInt(stream.itag);

        var result = null;
        result = {
            'FPS': null,
            'ABR': null
        };

        if (Resource.AudioItags[Itag]) {
            result.ABR = Resource.AudioItags[Itag].ABR;
        }

        if (stream.fps) {
            result.FPS = stream.fps;
        }
        return result;
    };

    Convert.GetSize = function (stream, Fml) {
        var result;
        if (stream.size) {
            result = stream.size;
        } else {
            result = Fml[stream.itag];
        }
        if (!result)
            result = null;
        return result;
    };

    Convert.GetFileName = function (Name) {
        var result = Name;
        for (var S in Resource.FileNameChar) {
            result = result.replace(new RegExp("/\\" + S + "+/g"), Resource.FileNameChar[S]);
        }
        return result;
    };
    return Convert;
})();
//# sourceMappingURL=convert.js.map
