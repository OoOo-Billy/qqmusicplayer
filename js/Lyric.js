(function (window) {
    function Lyric(data) {
        return new Lyric.prototype._init(data);
    }

    Lyric.prototype = {
        constructor: Lyric,
        _init: function (data) {

        },
    };
    Lyric.prototype._init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);