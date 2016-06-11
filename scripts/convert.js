class Convert {
    static GetFileName(Name) {
        var result = Name;
        for (var S in Resource.FileNameChar) {
            result = result.replace(new RegExp("/\\" + S + "+/g"), Resource.FileNameChar[S]);
        }
        return result;
    }
}
//# sourceMappingURL=convert.js.map