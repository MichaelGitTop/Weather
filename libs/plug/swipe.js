/***================================
+ 适用于移动端的 bs 架构的滑动事件
+ by dk.lan 
+ e.g: $('').touchwipe({})
===================================*/
(function ($) {
    $.fn.touchwipe = function (settings) {
        var config = {
            min_move_x: 20,
            wipeLeft: function () { alert("left"); },
            wipeRight: function () { alert("right"); },
            preventDefaultEvents: true
        };

        if (settings) $.extend(config, settings);

        this.each(function () {
            var startX;
            var isMoving = false;
            function cancelTouch() {
                this.removeEventListener('touchmove', onTouchMove);
                startX = null;
                isMoving = false;
            }
            function onTouchMove(e) {
                if (config.preventDefaultEvents) {
                    e.preventDefault();
                }
                if (isMoving) {
                    var x = e.touches[0].pageX;
                    var dx = startX - x;
                    if (Math.abs(dx) >= config.min_move_x) {
                        cancelTouch();
                        if (dx > 0) {
                            config.wipeLeft(e);
                        }
                        else {
                            config.wipeRight(e);
                        }
                    }
                }
            }
            function onTouchStart(e) {
                if (e.touches.length == 1) {
                    startX = e.touches[0].pageX;
                    isMoving = true;
                    this.addEventListener('touchmove', onTouchMove, false);
                }
            }
            this.addEventListener('touchstart', onTouchStart, false);
        });
        return this;
    };

})(jQuery);