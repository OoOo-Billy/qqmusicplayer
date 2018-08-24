(function (window) {
    function Lyric(path) {
        return new Lyric.prototype._init(path);
    }

    Lyric.prototype = {
        constructor: Lyric,
        _init: function (path) {
            this.path = path;
        },
        lyricArray: [],
        timeArray: [],
        loadLyric: function (callBack) {
            let $this = this;
            $.ajax({
                url: $this.path,
                dataType: 'text',
                success: function (data) {
                    //此处传入的歌词信息为string类型
                    $this.parseLyric(data);
                    callBack();
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },

        parseLyric: function (data) {
            let $this = this;
            //1.先清空上一首歌曲的歌词和时间
            this.lyricArray = [];
            this.time = [];
            //2.分割歌词:data数据为string类型，所以实用split来分割成数组
            let array = data.split('\n');
            //**定义一个提取时间数组的正则表达式
            let timeReg = /\[(\d*:\d*\.\d*)\]/;
            //3.歌词数组遍历，取出每一条歌词
            $.each(array,function (index,ele) {
                //3.1提取出歌词
                // 分割歌词
                let text = ele.split(']')[1];
                //排除空项
                if (text.length !== 1) {
                    $this.lyricArray.push(text);
                }

                //3.2提取时间
                //分割时间
                let time = timeReg.exec(ele);
                if (time !== null){
                    let timeStr = time[1];
                    let res2 = timeStr.split(':');
                    let min = parseInt(res2[0]) * 60;
                    let sec = parseFloat(res2[1]);
                    let timeSum = parseFloat((min + sec).toFixed(2));
                    // console.log(timeSum);
                    $this.timeArray.push(timeSum);
                }
            });
        },

        currentIndex: function (currentTime) {
            
        }


    };
    Lyric.prototype._init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);