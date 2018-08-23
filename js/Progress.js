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

        /*progressClick: function () {
            let $this = this;
            this.$bar.click(function (event) {
                //获取鼠标点击位置X轴距离
                let mouseLeft = event.clientX ? event.clientX : event.pageX;
                //获取进度条左边距
                let progressLeft = $(this).offset().left;
                //计算进度
                let num = mouseLeft - progressLeft;
                //设置进度线宽度
                $this.$line.width(num);
                //设置进度点左边距
                //$this.$dot.offset({'left':num});//不能用此方法,offset()设置是相对于整个body而言,使父元素绝对定位无效
                $this.$dot.css('left',num - 4);//微调位置
                //计算进度条比例
                //waiting for write
            });
        },*/

        isMove: false,
        progressMove: function (callBack) {
            let $this = this;
            let progressLeft = this.$bar.offset().left;
            let barWidth = this.$bar.width();
            let mouseLeft;

            //鼠标按下
            this.$bar.mousedown(function (event) {
                //1.按下鼠标改变一次进度条位置
                //取消字段选择功能
                document.onselectstart = function () {return false;};
                //正在移动
                $this.isMove = true;
                //获取鼠标点击位置X轴距离
                mouseLeft = event.clientX ? event.clientX : event.pageX;
                //计算进度
                let num = mouseLeft - progressLeft;
                //设置进度线宽度
                $this.$line.width(num);
                //设置进度点左边距
                //$this.$dot.offset({'left':num});//不能用此方法,offset()设置是相对于整个body而言,使父元素绝对定位无效
                $this.$dot.css('left',num - 4);//微调位置

                //2.触发移动事件
                $(document).mousemove(function (event) {
                    //2.1重新赋值鼠标X轴距离
                    mouseLeft = event.clientX ? event.clientX : event.pageX;
                    //2.2重新赋值移动距离
                    num = mouseLeft - progressLeft;
                    if (num >= 0 && num <= barWidth){//限制num的范
                        //2.3设置进度线宽度
                        $this.$line.width(num);
                        //2.4设置进度点左边距
                        $this.$dot.css('left',num - 4);//微调位置
                    }
                });
            });

            //抬起鼠标
            $(document).mouseup(function () {//此处有BUG，全局生效,且一次返回两个value值分别给musicProgress和volumeProgress,
                //关闭移动事件
                $(document).off('mousemove');
                //恢复字段选择功能
                document.onselectstart = function () {return true;};
                //取消移动
                $this.isMove = false;
                // //计算进度条比例
                let value = (mouseLeft - progressLeft) / barWidth;
                callBack(value);
            })
        }

    };
    Progress.prototype._init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);