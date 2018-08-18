$(function () {
//    0.定义全局变量/初始化相关参数
//    全局变量
    let $audio = $('audio');
    let player = new Player($audio);
//    初始化滚动条
    $(".music-box").mCustomScrollbar();

//    1.动态添加歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            url:'./source/musiclist.json',
            dataType:'json',
            success : function (data) {
                player.musicList = data;
                // 1.1遍历获取到的数据, 创建每一条音乐
                let $musicList = $(".music-list");
                $.each(data, function (index, ele) {
                    //创建音乐并插入
                    let $item = crateMusicItem(index, ele);
                    $musicList.append($item);
                });
                //1.2初始化页面信息
                // initMusicInfo(data[0]);
                // initMusicLyric(data[0]);
            },
            error:function (e) {
                console.log(e);
            }
        });
    }


//    2.监听歌曲列表鼠标移入移出事件
    $('.music-list').delegate('.music-list-content','mouseenter',function () {
        $(this).addClass('music-hover');
    });
    $('.music-list').delegate('.music-list-content','mouseleave',function () {
        $(this).removeClass('music-hover');
    });

//    3.监听复选框点击事件
//    3.1标题栏复选框，点击全选
    $('.music-list').delegate('.music-list-header>.checkbox>span','click',function () {
        $(this).parent('.checkbox').toggleClass('checked');
        if ($(this).parent('.checkbox').hasClass('checked')){
            $('.checkbox').addClass('checked');
        }else {
            $('.checkbox').removeClass('checked');
        }
    });
//    3.2其他复选框，点击选择
    $('.music-list').delegate('.music-list-content>.checkbox>span','click',function () {
        $(this).parent('.checkbox').toggleClass('checked');
        $('.music-list-header>.checkbox').removeClass('checked');
    });

//    4.监听歌曲列表子菜单按钮事件
//    4.1播放按钮事件
    $('.music-list').delegate('.play','click',function () {
        $(this).hide();
        $(this).siblings('.stop').css('display','inline-block');//直接使用show会是display值为inline,所以使用css
    });
//    4.2暂停按钮事件
    $('.music-list').delegate('.stop','click',function () {
        $(this).hide();
        $(this).siblings('.play').show();
    });

//    5.监听删除按钮点击事件
    $('.music-list').delegate('.del','click',function () {
        //5.1删除歌曲
        $(this).parents('.music-list-content').remove();
    //    5.2更改剩余歌曲序号

    });

    /**
     * 动态创建一条歌曲表单
     * @param index
     * @param ele
     * @returns {jQuery|HTMLElement}
     */
    function crateMusicItem(index,ele) {
        let $music = $(`<li class="music-list-content">
                            <div class="checkbox"><span></span></div>
                            <div class="index"><a>${index + 1}</a></div>
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
});


    function initMusicInfo(ele) {

    }