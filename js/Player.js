(function (window) {
    function Player($audio) {
        return new Player.prototype._init($audio);
    }

    Player.prototype = {
        constructor: Player,
        musicList: [],
        _init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },

        playingIndex: -1,//当前播放音乐索引

        playMusic: function (index, music) {
            //判断音乐播放器中的音乐是否是当前点击的音乐
            if (this.playingIndex !== index) {//不是当前播放的音乐
                this.$audio.attr('src', music.link_url);
                this.audio.play();
                //更新播放器中的音乐索引
                this.playingIndex = index;
            } else {
                //    是当前正在播放的音乐
                this.audio.play();
            }
        },

        preIndex: function () {
            let index = this.playingIndex - 1;
            if (index < 0) {
                index = this.musicList.length - 1;
            }
            return index;
        },

        nextIndex: function () {
            let index = this.playingIndex + 1;
            if (index > this.musicList.length - 1) {
                index = 0;
            }
            return index;
        },

        changeMusic: function (index) {
            //删除对应的数据
            this.musicList.splice(index, 1);
            //判断点击的是否为当前音乐前面的音乐
            if (index < this.playingIndex){
                //触发这个行为时,有两种情况：
                //1.删除的音乐为当前播放的音乐前面的音乐,所以播放索引需要-1;
                //2.删除的音乐为当前播放的音乐,播放索引不需要改变,但是,这时候已经触发了nextMusic行为,使播放索引已经+1,所以需要-1回到原来的值.
                this.playingIndex -= 1;
            }
        }

    };
    Player.prototype._init.prototype = Player.prototype;
    //使之变成全局变量,全局可调用
    window.Player = Player;
})(window);