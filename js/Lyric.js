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
        index: -1,
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
            this.timeArray = [];
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
                if (text.length === 1) return true;
                    $this.lyricArray.push(text);


                //3.2提取时间
                //分割时间
                let time = timeReg.exec(ele);
                if (time === null) return true;//等于continue;
                    let timeStr = time[1];
                    let res2 = timeStr.split(':');
                    let min = parseInt(res2[0]) * 60;
                    let sec = parseFloat(res2[1]);
                    let timeSum = parseFloat(Number(min + sec).toFixed(2));
                    // console.log(timeSum);
                    $this.timeArray.push(timeSum);

            });
        },

        currentIndex: function (currentTime) {
            if (currentTime > this.timeArray[0]){//如果播放时间大于时间数组第一个的时间，说明播放器已经播放到数组第一个索引对应的时间，这个时候需要显示第一句歌词，所以需要吧index(即对应的歌词索引)返回给播放器，让播放器知道播放到哪句歌词了，并在外界操作歌词高亮；之后，把时间数组的第一个已经判断过的时间删去(注意：此时歌词数组没变，而index对应的是歌词数组，与时间数组无关，即时间数组只需要用索引0对应的时间与currentTime作比较判断即可)，index不断+1，用来不断往后返回歌词。
                this.index++;
                this.timeArray.shift();
            }
            return this.index;
        }


    };
    Lyric.prototype._init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);