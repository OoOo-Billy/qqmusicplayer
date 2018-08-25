$(function () {
//    1.定义全局变量/初始化相关参数
//    1.1全局变量
    let $audio = $('audio');
    let player = new Player($audio);
    let progress;
    let volumeProgress;
    let lyric = new Lyric;
//    1.2初始化滚动条
    $(".music-box").mCustomScrollbar();
//    1.3初始化音乐列表高度
    initMusicBox();


//    2.动态添加歌曲列表
    getPlayerList();

    /**
     * 动态创建歌曲并添加
     */
    function getPlayerList() {
        $.ajax({
            url: './source/musiclist.json',
            dataType: 'json',
            success: function (data) {
                player.musicList = data;
                // 2.1遍历获取到的数据, 创建每一条音乐
                let $musicList = $(".music-list");
                $.each(data, function (index, ele) {
                    //创建音乐并插入
                    let $item = crateMusicItem(index, ele);
                    $musicList.append($item);
                });
                //2.2初始化页面信息
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    //3.初始化事件监听
    initEvents();

    /**
     * 初始化监听事件
     */
    function initEvents() {
        //    1.监听歌曲列表鼠标移入移出事件
        let $musicList = $('.music-list');
        $musicList.delegate('.music-list-content', 'mouseenter', function () {
            $(this).addClass('music-hover');
        });
        $musicList.delegate('.music-list-content', 'mouseleave', function () {
            $(this).removeClass('music-hover');
        });

        //    2.监听复选框点击事件
        //    2.1标题栏复选框，点击全选
        $musicList.delegate('.music-list-header>.checkbox>span', 'click', function () {
            $(this).parent('.checkbox').toggleClass('checked');
            if ($(this).parent('.checkbox').hasClass('checked')) {
                $('.checkbox').addClass('checked');
            } else {
                $('.checkbox').removeClass('checked');
            }
        });
        //    2.2其他复选框，点击选择
        $musicList.delegate('.music-list-content>.checkbox>span', 'click', function () {
            $(this).parent('.checkbox').toggleClass('checked');
            $('.music-list-header>.checkbox').removeClass('checked');
        });

        //    3.监听歌曲列表子菜单按钮事件
        //    3.1播放按钮事件
        let $controlBtn = $('.control-btn');
        $musicList.delegate('.play', 'click', function () {
            let $farther = $(this).parents('.music-list-content');
            //3.1.1初始化全局音乐信息
            initMusicInfo($farther.get(0).music);//歌曲信息
            initMusicLyric($farther.get(0).music);//歌词信息
            //3.1.2按钮切换到暂停
            $farther.toggleClass('music-play');
            $farther.siblings(".music-play").removeClass('music-play');
            //3.1.3播放器按钮同步切换到暂停
            $controlBtn.addClass('playing');
            //3.1.4播放器播放音乐
            player.playMusic($farther.get(0).index, $farther.get(0).music);
        });
        //    3.2暂停按钮事件
        $musicList.delegate('.stop', 'click', function () {
            //3.2.1按钮切换回播放
            $(this).parents('.music-list-content').removeClass('music-play');
            //3.2.2播放器按钮同步回播放
            $controlBtn.removeClass('playing');
            //3.2.3暂停播放
            player.audio.pause();
        });

        //    4.监听删除按钮点击事件
        $musicList.delegate('.del', 'click', function () {
            let $farther = $(this).parents('.music-list-content');
            //判断是否是正在播放的歌曲
            if ($farther.get(0).index === player.playingIndex){
                $('.next').trigger('click');
            }
            //4.1删除歌曲
            $farther.remove();
            //4.2删除歌曲在播放器中的数据
            player.changeMusic($farther.get(0).index);

            //4.3重新给音乐列表排序
            $('.music-list-content').each(function (index, ele) {
                ele.index = index;
                $(ele).find('.index a').text(index + 1);
            });
        });

        //    5.监听播放器中*播放*按钮的点击事件
        $('.play').click(function () {
            let $item = $('.music-list-content');
            //5.1判断是否播放过音乐
            if (player.playingIndex === -1) {
                //从未播放过，默认播放第一首音乐
                player.playMusic($item.get(0).index, $item.get(0).music);
            } else {
                //已经播放过，继续播放播放器中的音乐;
                player.audio.play();
            }
            //5.2切换按钮
            $controlBtn.addClass('playing');
            //5.3同步音乐列表中当前音乐的暂停按钮
            $item.eq(player.playingIndex).addClass('music-play');
        });

        //    6.监听播放器中*暂停*按钮的点击事件
        $('.stop').click(function () {
            //6.1暂停播放器;
            player.audio.pause();
            //6.2切换按钮
            $controlBtn.removeClass('playing');
            //6.3同步音乐列表中当前音乐的暂停按钮
            $('.music-list-content').eq(player.playingIndex).removeClass('music-play');
        });

        //    7.监听播放器中*上一首*按钮的点击事件
        $('.pre').click(function () {
            //恢复下一首音乐表单样式
            nextMusic(player.preIndex());
            $('.music-list-content').eq(player.nextIndex()).removeClass('music-play');
        });

        //    8.监听播放器中*下一首*按钮的点击事件
        $('.next').click(function () {
            //恢复上一首音乐表单样式
            nextMusic(player.nextIndex());
            $('.music-list-content').eq(player.preIndex()).removeClass('music-play');
        });

        //    9.监听播放的进度
        let lyricIndex;
        let $lyricItem;
        player.timeUpdate(function (currentTime,duration,timeStr) {
            //9.1同步播放器时间
            $('.now').text(timeStr);
            //9.2同步进度条
            let value = currentTime / duration * 100;
            progress.setProgress(value);

            //9.3实现歌词同步:实现方法——把currentTime传给Lyric，让它与timeArray匹配，一但匹配成功，则返回一个索引value，播放器拿到索引，让相应的歌词滚动高亮
            lyricIndex = lyric.currentIndex(currentTime);
            $lyricItem = $('.lyric-box li').eq(lyricIndex);
            $lyricItem.addClass('cur');
            $lyricItem.siblings('.cur').removeClass('cur');
            //9.4实现歌词滚动
            if (lyricIndex <= 2) return;
            $('.lyric-box ul').css('marginTop',(-lyricIndex + 1) * 28);
        });

        //10.监听歌词拖拽:暂时无法使用
        /*$('.lyric-box').mousedown(function (event) {
            let $box = $('.lyric-box ul');
            let begin = event.clientY ? event.clientY : event.pageY;
            let target,dis;
            let lyricTop = parseInt($box.css('marginTop'));
            $(document).mousemove(function (event) {
                target = event.clientY ? event.clientY : event.pageY;
                dis = target - begin;
                $box.css({
                    marginTop:(lyricTop + dis),
                    transition: 'all 0.2s',
                });
            })
        })*/
    }

    //4.初始化进度条
    initProgress();

    /**
     * 初始化进度条
     */
    function initProgress() {
        //4.1初始化播放器进度条
        let $progressBar = $('.player .progress');
        let $progressLine = $('.player .progress-bg');
        let $progressDot = $('.player .progress-bar');
        progress = new Progress($progressBar,$progressLine,$progressDot);
        progress.progressMove(function (value) {
            player.musicSeekTo(value);
        });

        //4.2初始化音量进度条
        let $musicProgressBar = $('.volume .progress');
        let $musicProgressLine = $('.volume .progress-bg');
        let $musicProgressDot = $('.volume .progress-bar');
        volumeProgress = new Progress($musicProgressBar,$musicProgressLine,$musicProgressDot);
        volumeProgress.progressMove(function (value) {
            player.volumeSeekTo(value);
        });

    }

    /**
     * 上一首/下一首公用部分
     * @param index
     */
    function nextMusic(index) {
        let $item = $('.music-list-content');
        //1.播放上/下一首
        player.playMusic(index, player.musicList[index]);
        //2.切换音乐表单样式
        $item.eq(player.playingIndex).addClass('music-play');
        //3.初始化页面信息
        initMusicInfo($item.get(player.playingIndex).music);
        initMusicLyric($item.get(player.playingIndex).music);
        //4.切换成暂停按钮
        $('.control-btn').addClass('playing');
    }

    /**
     * 动态创建一条歌曲表单
     * @param index
     * @param ele
     * @returns {jQuery|HTMLElement}
     */
    function crateMusicItem(index, ele) {
        let $music = $(`<li class="music-list-content">
                            <div class="checkbox"><span></span></div>
                            <div class="index">
                                <a>${index + 1}</a>
                                <span class="index-play"></span>
                            </div>
                            <div class="title">
                                <div class="title-text"><a title="${ele.name}">${ele.name}</a></div>
                                <div class="title-control">
                                    <a class="stop" href="javascript:;" title="暂停"></a>
                                    <a class="play" href="javascript:;" title="播放"></a>
                                    <a href="javascript:;" title="添加到歌单"></a>
                                    <a href="javascript:;" title="下载"></a>
                                    <a href="javascript:;" title="分享"></a>
                                </div>
                            </div>
                            <div class="singer"><a href="javascript:;" title="${ele.singer}">${ele.singer}</a></div>
                            <div class="duration">
                                <a class="duration-time">${ele.time}</a>
                                <a class="del" href="javascript:;" title="删除"></a>
                            </div>
                        </li>`);

        //初始化这个歌曲单元的信息
        $music.get(0).index = index;
        $music.get(0).music = ele;
        return $music;
    }

    /**
     * 初始化音乐列表盒子的高度
     */
    function initMusicBox() {
        let $height = $(window).height();
        $('.music-box').css('height', $height - 250);
    }

    /**
     * 初始化全局歌曲信息
     * @param music
     */
    function initMusicInfo(music) {
        let $musicImg = $('.music-img img');
        let $musicBg = $('.mask_bg');
        let $musicInfo = $('.music-info p a');
        let $musicInfoName = $musicInfo.eq(0);
        let $musicInfoSinger = $musicInfo.eq(1);
        let $musicInfoAlbum = $musicInfo.eq(2);
        let $playerInfo = $('.info a');
        let $playerName = $playerInfo.eq(0);
        let $playerSinger = $playerInfo.eq(1);
        let $playerCurrent = $('.current');

        $musicImg.attr('src', music.cover);
        $musicBg.css('background', `url("${music.cover}") no-repeat center center`);
        $musicInfoName.text(music.name);
        $musicInfoSinger.text(music.singer);
        $musicInfoAlbum.text(music.album);
        $playerName.text(music.name);
        $playerSinger.text(music.singer);
        $playerCurrent.text(music.time);
    }

    /**
     * 初始化歌词信息
     * @param music
     */
    function initMusicLyric(music){
        //1.将当前播放歌曲的歌词文件路径传入lyric对象
        lyric.path = music.link_lrc;
        //2.清空当前网页歌词
        let $lyricBox = $('.lyric-box ul');
        $lyricBox.html('');
        lyric.index = -1;
        //3.重新添加歌词
        lyric.loadLyric(function () {
            $.each(lyric.lyricArray,function (index,ele) {
                let $item = $(`<li>${ele}</li>`);
                $lyricBox.append($item);
            })
        });
        //4.恢复歌词滚动
        $lyricBox.css('marginTop',0);
    }
});


