$(function () {
//    1.监听歌曲列表鼠标移入移出事件
    $('.music-list').delegate('.music-list-content','mouseenter',function () {
        $(this).addClass('music-hover');
    });
    $('.music-list').delegate('.music-list-content','mouseleave',function () {
        $(this).removeClass('music-hover');
    });

//    2.监听复选框点击事件
//    2.1标题栏复选框，点击全选
    $('.music-list').delegate('.music-list-header>.checkbox>span','click',function () {
        $(this).parent('.checkbox').toggleClass('checked');
        if ($(this).parent('.checkbox').hasClass('checked')){
            $('.checkbox').addClass('checked');
        }else {
            $('.checkbox').removeClass('checked');
        }
    });
//    2.2其他复选框，点击选择
    $('.music-list').delegate('.music-list-content>.checkbox>span','click',function () {
        $(this).parent('.checkbox').toggleClass('checked');
        if ($(this).parent('.checkbox').hasClass('checked')){
        }else {
            $('.music-list-header>.checkbox').removeClass('checked');
        }
    });

//    3.监听歌曲列表子菜单按钮事件
//    3.1播放按钮事件
//     $('.music-list').delegate()
});