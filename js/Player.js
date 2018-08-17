(function (window) {
    function Player($audio) {
        return new Player.prototype._init($audio);
    }
    Player.prototype = {
        constructor : Player,
        musicList: [],
        _init:function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        }


    };
    Player.prototype._init.prototype = Player.prototype;
    window.Player = Player;
})(window);