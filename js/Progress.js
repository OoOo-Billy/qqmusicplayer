(function (window) {
    function Progress($bar,$line,$dot) {
        return new Progress.prototype._init($bar,$line,$dot);
    }
    Progress.prototype = {
        constructor: Progress,
        _init: function ($bar,$line,$dot) {
            this.$bar = $bar;
            this.$line = $line;
            this.$dot = $dot;
        },
    };
    Progress.prototype._init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);