var tipsy = (function($) {

    var defaults = {
        fade: false,
        fallback: '',
        gravity: 's',
        html: false,
        title: 'title',
        offset: 0
    };

    var tipsyHover = function(opts){

        $.data(this, 'cancel.tipsy', true);

        var tip = $.data(this, 'active.tipsy');
        if (!tip) {
            tip = $('<div class="tipsy"><div class="tipsy-inner"/></div>');
            tip.css({position: 'absolute', zIndex: 100000});
            $.data(this, 'active.tipsy', tip);
        }

        if ($(this).attr('title') || typeof($(this).attr('original-title')) != 'string') {
            $(this).attr('original-title', $(this).attr('title') || '').removeAttr('title');
        }

        var title;
        if (typeof opts.title == 'string') {
            title = $(this).attr(opts.title == 'title' ? 'original-title' : opts.title);
        } else if (typeof opts.title == 'function') {
            title = opts.title.call(this);
        }

        tip.find('.tipsy-inner')[opts.html ? 'html' : 'text'](title || opts.fallback);

        var pos = $.extend({}, $(this).offset(), {width: this.offsetWidth, height: this.offsetHeight});
        tip.get(0).className = 'tipsy'; // reset classname in case of dynamic gravity
        tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).appendTo(document.body);
        var actualWidth = tip[0].offsetWidth, actualHeight = tip[0].offsetHeight;
        var gravity = (typeof opts.gravity == 'function') ? opts.gravity.call(this) : opts.gravity;

        var tp;
        switch (gravity.charAt(0)) {
            case 'n':
                tp = {top: pos.top + pos.height + opts.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                break;
            case 's':
                tp = {top: pos.top - actualHeight - opts.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                break;
            case 'e':
                tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - opts.offset};
                break;
            case 'w':
                tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + opts.offset};
                break;
        }

        if (gravity.length == 2) {
            if (gravity.charAt(1) == 'w') {
                tp.left = pos.left + pos.width / 2 - 9;
            } else {
                tp.left = pos.left + pos.width / 2 - actualWidth + 9;
            }
        }

        tip.css(tp).addClass('tipsy-' + gravity); 

        if (opts.fade) {
            tip.css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: 1},200);
        } else {
            tip.css({visibility: 'visible'});
        }
    };

    var tipsyHoverOut = function(opts){
        $.data(this, 'cancel.tipsy', false);
        var self = this;
        setTimeout(function() {
            if ($.data(this, 'cancel.tipsy')) return;
            var tip = $.data(self, 'active.tipsy');
            if (opts.fade) {
                tip.stop().fadeOut(function() { $(this).remove(); });
            } else {
                tip.remove();
            }
        }, 100);
    }

    return {
        create : function( domArr, options ){
            var opts = $.extend({}, defaults, options);
            domArr.each(function(i, item){
                $(this).hover(function(){
                    tipsyHover.call(this, opts);
                }, function(){
                    tipsyHoverOut.call(this, opts);
                });
            });
        } 
    };
    
    
})(jQuery);
