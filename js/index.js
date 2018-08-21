$(function () {
//    1.定义全局变量/初始化相关参数
//    1.1全局变量
    let $audio = $('audio');
    let player = new Player($audio);
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
                // initMusicLyric(data[0]);
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
            // initMusicLyric($farther.get(0).music);//歌词信息
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
            //4.1删除歌曲
            $(this).parents('.music-list-content').remove();
            //4.2更改剩余歌曲序号
        });

        //    5.监听播放器中*播放*按钮的点击事件
        $('.play').click(function () {
            //6.1播放器播放音乐;
            player.audio.play();
            //6.2切换按钮
            $controlBtn.addClass('playing');
            //6.3同步音乐列表中当前音乐的暂停按钮
            $('.music-list-content').eq(player.playingIndex).addClass('music-play');
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
            //7.1播放上一首音乐
            player.playMusic(player.preIndex(),player.musicList[player.preIndex()]);
            //7.2切换音乐表单样式
            //waiting for write;
        });

        //    8.监听播放器中*下一首*按钮的点击事件
        $('.next').click(function () {
            //8.1播放下一首音乐
            player.playMusic(player.nextIndex(),player.musicList[player.nextIndex()]);
            //8.2切换音乐表单样式
            //waiting for write;
        });
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

        $musicImg.attr('src',music.cover);
        $musicBg.css('background',`url("${music.cover}") no-repeat center center`);
        $musicInfoName.text(music.name);
        $musicInfoSinger.text(music.singer);
        $musicInfoAlbum.text(music.album);
        $playerName.text(music.name);
        $playerSinger.text(music.singer);
        $playerCurrent.text(music.time);
    }

    /*function initMusicLyric(music){
        let $lyric =$('.lyric-box');
        let $item = $('');
    }*/
});


