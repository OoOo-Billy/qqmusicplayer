$(function () {
//    0.定义全局变量
    let $audio = $('audio');
    let player = new Player($audio);

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
                    // let $item = crateMusicItem(index, ele);
                    // $musicList.append($item);
                });
                //
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

    })
});