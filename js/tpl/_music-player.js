
(function() {

    var glyphicon = $('.glyphicon');
    var  toggleClass = glyphicon.data('toggle-class');
    // glyphicon.data('toggle-class', glyphicon.attr('class')).removeClass().addClass(toggleClass);
    var audio = $('.js-audioWrap').find('.js-audioCont');
    var timeline = audio.closest('.js-audioWrap').find('.js-timeline');
    var duration = audio.prop('duration');
    var width = timeline.width();
    var playClass = 'btn--play';
    var pauseClass = 'btn--pause';
    var glyphiconPlay = 'glyphicon--play';
    var glyphiconPause = 'glyphicon--pause';
    var mainTrack = $('.js-audioCont source');
    var mainTrackDownload = $('.js-audioCont a');
    var firstTrackAddress = $('.js-trackCont').first().data('audio-src');
    var trackListAddress = $('.js-trackCont').data('audio-src');
    var prevTrackBtn = $('.js-prevTrackBtn');
    var nextTrackBtn = $('.js-nextTrackBtn');
    var trackListBtn =  $('.js-trackListBtn');


    // play first song

    // if (mainTrack.attr('src') == '') {
    //     console.log('rerererererer');
    //     mainTrack.attr('src', firstTrackAddress);
    //     mainTrackDownload.attr('href', firstTrackAddress);
    //     $('.js-audioCont')[0].load();  //to stop the song instead of pause
    // }


    /**
     * замена src песни
     */
    $('.js-trackListBtn').on('click', function () {
        var currentTrackAddress = $(this).parent().data('audio-src');
        var playingTrack = $('.js-audioCont source');
        var playingTrackDownload = $('.js-audioCont a');
        $this = $(this);
        console.log(currentTrackAddress);

        if (playingTrack.attr('src') !== currentTrackAddress) {
            playingTrack.attr('src', currentTrackAddress);
            playingTrackDownload.attr('href', currentTrackAddress);
            $('.js-audioCont')[0].load(); //to stop the song instead of pause
            // console.log(playingTrack.attr('src')+'TRUE');
        }


        setTimeout(function () {
            $('.js-audioPlay').click();
        }, 100);


        //change icon

        var trackBtnPlay = $this.find('.track-list__btn');
        var trackCurrent = $this.parent();

        if (trackBtnPlay.hasClass(playClass)) {
            trackBtnPlay.removeClass(playClass).addClass(pauseClass);
            // glyphicon.removeClass(glyphiconPlay).addClass(glyphiconPause);
            trackCurrent.siblings().find('.js-trackListBtn').find('.track-list__btn').removeClass(pauseClass).addClass(playClass);
        }
        else {
            trackBtnPlay.removeClass(pauseClass).addClass(playClass);
            // glyphicon.removeClass(glyphiconPause).addClass(glyphiconPlay);
            // audio.trigger('pause');
            // clearInterval(idInterval);
        }
    });



    nextTrackBtn.on('click', function () {

        var $this =  $(this),
            $parent = $this.parents('.js-audioWrap'),
            $listTracks = $('.js-trackListCont').find('.js-trackCont'),
            srcCurrentTrack = $parent.find('.js-audioCont source').attr('src');
        // currentTrack = $parent.find('.js-audioCont source');

        $listTracks.each(function () {

            var $this = $(this),
                thisData = $this.data('audio-src'),
                nextTrackPlayBtn = $this.next().find('.track-list__btn');

            if(srcCurrentTrack === thisData){
                var nextTrackAddress = $this.next().data('audio-src'),
                    nextTrack = $this.next();

                $parent.find('.js-audioCont source').attr('src', nextTrackAddress);
                $('.js-audioCont')[0].load();
                playNext = setTimeout(function () {
                    $('.js-audioPlay').click();
                    //change icon
                    nextTrackPlayBtn.removeClass(playClass).addClass(pauseClass);
                    nextTrackPlayBtn.parent().siblings().removeClass(pauseClass).addClass(playClass);
                }, 100);

            }
        });
    });


    prevTrackBtn.on('click', function () {

        var $this =  $(this),
            $parent = $this.parents('.js-audioWrap'),
            $listTracks = $('.js-trackListCont').find('.js-trackCont'),
            srcCurrentTrack = $parent.find('.js-audioCont source').attr('src');
        // currentTrack = $parent.find('.js-audioCont source');

        $listTracks.each(function () {

            var $this = $(this),
                thisData = $this.data('audio-src'),
                prevTrackPlayBtn = $this.prev().find('.track-list__btn');

            if(srcCurrentTrack === thisData){
                var prevTrackAddress = $this.prev().data('audio-src'),
                    prevTrack = $this.prev();

                $parent.find('.js-audioCont source').attr('src', prevTrackAddress);
                $('.js-audioCont')[0].load();
                playPrev = setTimeout(function () {
                    $('.js-audioPlay').click();
                    //change icon
                    prevTrackPlayBtn.removeClass(playClass).addClass(pauseClass);
                    prevTrackPlayBtn.parent().siblings().removeClass(pauseClass).addClass(playClass);
                }, 100);

                // prevTrackPlayBtn.parent().siblings().removeClass(pauseClass).addClass(playClass);
                // glyphicon.removeClass(glyphiconPlay).addClass(glyphiconPause);
            }
        });
    });


    /**
     * Пауза, выключение звука и сдвиг ползунка timeline
     */
    $('.js-audioPlay, .js--audio-mute, .js-trackListBtn').on('click', mainMoveTrack);

    function mainMoveTrack () {
        // Меняем иконку
        glyphicon = $(this).find('.glyphicon');
        toggleClass = glyphicon.data('toggle-class');
        // glyphicon.data('toggle-class', glyphicon.attr('class')).removeClass().addClass(toggleClass);

        var trackBtnPlay = $this.find('.track-list__btn');
        var trackCurrent = $this.parent();
        if (trackBtnPlay.hasClass(playClass)) {
            trackBtnPlay.removeClass(playClass).addClass(pauseClass);
            glyphicon.removeClass(glyphiconPlay).addClass(glyphiconPause);
            trackCurrent.siblings().find('.js-trackListBtn').find('.track-list__btn').removeClass(pauseClass).addClass(playClass);
        }

        else {
            trackBtnPlay.removeClass(pauseClass).addClass(playClass);
            glyphicon.removeClass(glyphiconPause).addClass(glyphiconPlay);
        }

        audio = $(this).closest('.js-audioWrap').find('.js-audioCont');
        timeline = audio.closest('.js-audioWrap').find('.js-timeline');
        duration = audio.prop('duration');

        var playingTrack = $('.js-audioCont source');

        // console.log(duration);
        width = timeline.width();
        if ($(this).hasClass('js-audioPlay')) {
            // Старт/пауза и двигаем ползунок
            if(audio.prop('paused')) {
                audio.trigger('play');
                var idInterval = setInterval(function () {
                    var currentTime = audio.prop('currentTime');

                    // left = 100*currentTime/duration;
                    // timeline.find('.js-timeline-control').css('left', left+'%');
                    // if (currentTime == duration) {
                    //     clearInterval(idInterval);
                    // }

                    var left = width*currentTime/duration;
                    timeline.find('.js-timeline-control').css('left', left+'px');
                    // console.log('idInterval'+left);
                    if (currentTime == duration) {
                        clearInterval(idInterval);
                    }
                }, 1000);
            } else {
                audio.trigger('pause');
                clearInterval(idInterval);
            }
        }
        // else {
        //     // Переключаем звук
        //     audio.prop("muted",!audio.prop("muted"));
        // }
        return false;
    }

//function for autoplay
    setTimeout(function () {
        $('.js-trackListBtn').first().click();
        // setTimeout(function () {
        //     $('.js-audioPlay').click();
        // }, 100);
    }, 1100);

    /**
     * Перемотка трека по клику на timeline
     */
    $('.js-timeline').on('click', function (e) {
        var audioTime = $(this).closest('.js-audioWrap').find('.js-audioCont');
        var duration = audioTime.prop('duration');
        if (duration > 0) {
            var offset = $(this).offset();
            var left = e.clientX-offset.left;
            var width = $(this).width();
            // $(this).find('.js--timeline-control').css('left', 100*left/duration/2+'%');
            $(this).find('.js-timeline-control').css('left', left+'px');
            audioTime.prop('currentTime', duration*left/width);
            console.log('timeline'+duration*left/width)
        }
        return false;
    });



// jQuery UI


    $( function() {
        var width = $('.js-timeline').width();

        $( '.audio__timeline' ).slider({
            range: "min",
            value: 0,
            min: 0,
            max: width,
            step: 0.01,
            create: function( event, ui ) {
                $('.ui-slider-handle').addClass('audio__timeline-control js-timeline-control');
            },
            slide: function( event, ui ) {
                var rangeWidth = $('.ui-slider-range').width();
                // console.log(rangeWidth);
                $('.js-timeline').find('.js-timeline-control').css('left', rangeWidth+'px');
                console.log('ui'+rangeWidth)
            },
            start: function( event, ui ) {
            },
            stop: function( event, ui ) {
                // var rangeWidth = $('.ui-slider-range').width();
                // $('.js--timeline').find('.js--timeline-control').css('left', rangeWidth+'px');
                //
                //
                // var audio = $(this).closest('.js--audio-wrap').find('.js--audio-cont')[0];
                // audio.play();
                // }
                var audioTime = $(this).closest('.js-audioWrap').find('.js-audioCont');
                var duration = audioTime.prop('duration');
                if (duration > 0) {
                    var offset = $(this).offset();
                    var left = event.clientX-offset.left;
                    var width = $(this).width();
                    // $(this).find('.js--timeline-control').css('left', 100*left/duration/2+'%');
                    $(this).find('.js-timeline-control').css('left', left+'px');
                    audioTime.prop('currentTime', duration*left/width);
                }
                return false;
            }
        });
        // $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
    });
// $('.ui-slider-handle').addClass('audio__timeline-control');

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ0cGwvX211c2ljLXBsYXllci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbihmdW5jdGlvbigpIHtcblxuICAgIHZhciBnbHlwaGljb24gPSAkKCcuZ2x5cGhpY29uJyk7XG4gICAgdmFyICB0b2dnbGVDbGFzcyA9IGdseXBoaWNvbi5kYXRhKCd0b2dnbGUtY2xhc3MnKTtcbiAgICAvLyBnbHlwaGljb24uZGF0YSgndG9nZ2xlLWNsYXNzJywgZ2x5cGhpY29uLmF0dHIoJ2NsYXNzJykpLnJlbW92ZUNsYXNzKCkuYWRkQ2xhc3ModG9nZ2xlQ2xhc3MpO1xuICAgIHZhciBhdWRpbyA9ICQoJy5qcy1hdWRpb1dyYXAnKS5maW5kKCcuanMtYXVkaW9Db250Jyk7XG4gICAgdmFyIHRpbWVsaW5lID0gYXVkaW8uY2xvc2VzdCgnLmpzLWF1ZGlvV3JhcCcpLmZpbmQoJy5qcy10aW1lbGluZScpO1xuICAgIHZhciBkdXJhdGlvbiA9IGF1ZGlvLnByb3AoJ2R1cmF0aW9uJyk7XG4gICAgdmFyIHdpZHRoID0gdGltZWxpbmUud2lkdGgoKTtcbiAgICB2YXIgcGxheUNsYXNzID0gJ2J0bi0tcGxheSc7XG4gICAgdmFyIHBhdXNlQ2xhc3MgPSAnYnRuLS1wYXVzZSc7XG4gICAgdmFyIGdseXBoaWNvblBsYXkgPSAnZ2x5cGhpY29uLS1wbGF5JztcbiAgICB2YXIgZ2x5cGhpY29uUGF1c2UgPSAnZ2x5cGhpY29uLS1wYXVzZSc7XG4gICAgdmFyIG1haW5UcmFjayA9ICQoJy5qcy1hdWRpb0NvbnQgc291cmNlJyk7XG4gICAgdmFyIG1haW5UcmFja0Rvd25sb2FkID0gJCgnLmpzLWF1ZGlvQ29udCBhJyk7XG4gICAgdmFyIGZpcnN0VHJhY2tBZGRyZXNzID0gJCgnLmpzLXRyYWNrQ29udCcpLmZpcnN0KCkuZGF0YSgnYXVkaW8tc3JjJyk7XG4gICAgdmFyIHRyYWNrTGlzdEFkZHJlc3MgPSAkKCcuanMtdHJhY2tDb250JykuZGF0YSgnYXVkaW8tc3JjJyk7XG4gICAgdmFyIHByZXZUcmFja0J0biA9ICQoJy5qcy1wcmV2VHJhY2tCdG4nKTtcbiAgICB2YXIgbmV4dFRyYWNrQnRuID0gJCgnLmpzLW5leHRUcmFja0J0bicpO1xuICAgIHZhciB0cmFja0xpc3RCdG4gPSAgJCgnLmpzLXRyYWNrTGlzdEJ0bicpO1xuXG5cbiAgICAvLyBwbGF5IGZpcnN0IHNvbmdcblxuICAgIC8vIGlmIChtYWluVHJhY2suYXR0cignc3JjJykgPT0gJycpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ3JlcmVyZXJlcmVyZXInKTtcbiAgICAvLyAgICAgbWFpblRyYWNrLmF0dHIoJ3NyYycsIGZpcnN0VHJhY2tBZGRyZXNzKTtcbiAgICAvLyAgICAgbWFpblRyYWNrRG93bmxvYWQuYXR0cignaHJlZicsIGZpcnN0VHJhY2tBZGRyZXNzKTtcbiAgICAvLyAgICAgJCgnLmpzLWF1ZGlvQ29udCcpWzBdLmxvYWQoKTsgIC8vdG8gc3RvcCB0aGUgc29uZyBpbnN0ZWFkIG9mIHBhdXNlXG4gICAgLy8gfVxuXG5cbiAgICAvKipcbiAgICAgKiDQt9Cw0LzQtdC90LAgc3JjINC/0LXRgdC90LhcbiAgICAgKi9cbiAgICAkKCcuanMtdHJhY2tMaXN0QnRuJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY3VycmVudFRyYWNrQWRkcmVzcyA9ICQodGhpcykucGFyZW50KCkuZGF0YSgnYXVkaW8tc3JjJyk7XG4gICAgICAgIHZhciBwbGF5aW5nVHJhY2sgPSAkKCcuanMtYXVkaW9Db250IHNvdXJjZScpO1xuICAgICAgICB2YXIgcGxheWluZ1RyYWNrRG93bmxvYWQgPSAkKCcuanMtYXVkaW9Db250IGEnKTtcbiAgICAgICAgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50VHJhY2tBZGRyZXNzKTtcblxuICAgICAgICBpZiAocGxheWluZ1RyYWNrLmF0dHIoJ3NyYycpICE9PSBjdXJyZW50VHJhY2tBZGRyZXNzKSB7XG4gICAgICAgICAgICBwbGF5aW5nVHJhY2suYXR0cignc3JjJywgY3VycmVudFRyYWNrQWRkcmVzcyk7XG4gICAgICAgICAgICBwbGF5aW5nVHJhY2tEb3dubG9hZC5hdHRyKCdocmVmJywgY3VycmVudFRyYWNrQWRkcmVzcyk7XG4gICAgICAgICAgICAkKCcuanMtYXVkaW9Db250JylbMF0ubG9hZCgpOyAvL3RvIHN0b3AgdGhlIHNvbmcgaW5zdGVhZCBvZiBwYXVzZVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocGxheWluZ1RyYWNrLmF0dHIoJ3NyYycpKydUUlVFJyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJCgnLmpzLWF1ZGlvUGxheScpLmNsaWNrKCk7XG4gICAgICAgIH0sIDEwMCk7XG5cblxuICAgICAgICAvL2NoYW5nZSBpY29uXG5cbiAgICAgICAgdmFyIHRyYWNrQnRuUGxheSA9ICR0aGlzLmZpbmQoJy50cmFjay1saXN0X19idG4nKTtcbiAgICAgICAgdmFyIHRyYWNrQ3VycmVudCA9ICR0aGlzLnBhcmVudCgpO1xuXG4gICAgICAgIGlmICh0cmFja0J0blBsYXkuaGFzQ2xhc3MocGxheUNsYXNzKSkge1xuICAgICAgICAgICAgdHJhY2tCdG5QbGF5LnJlbW92ZUNsYXNzKHBsYXlDbGFzcykuYWRkQ2xhc3MocGF1c2VDbGFzcyk7XG4gICAgICAgICAgICAvLyBnbHlwaGljb24ucmVtb3ZlQ2xhc3MoZ2x5cGhpY29uUGxheSkuYWRkQ2xhc3MoZ2x5cGhpY29uUGF1c2UpO1xuICAgICAgICAgICAgdHJhY2tDdXJyZW50LnNpYmxpbmdzKCkuZmluZCgnLmpzLXRyYWNrTGlzdEJ0bicpLmZpbmQoJy50cmFjay1saXN0X19idG4nKS5yZW1vdmVDbGFzcyhwYXVzZUNsYXNzKS5hZGRDbGFzcyhwbGF5Q2xhc3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJhY2tCdG5QbGF5LnJlbW92ZUNsYXNzKHBhdXNlQ2xhc3MpLmFkZENsYXNzKHBsYXlDbGFzcyk7XG4gICAgICAgICAgICAvLyBnbHlwaGljb24ucmVtb3ZlQ2xhc3MoZ2x5cGhpY29uUGF1c2UpLmFkZENsYXNzKGdseXBoaWNvblBsYXkpO1xuICAgICAgICAgICAgLy8gYXVkaW8udHJpZ2dlcigncGF1c2UnKTtcbiAgICAgICAgICAgIC8vIGNsZWFySW50ZXJ2YWwoaWRJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuXG5cbiAgICBuZXh0VHJhY2tCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciAkdGhpcyA9ICAkKHRoaXMpLFxuICAgICAgICAgICAgJHBhcmVudCA9ICR0aGlzLnBhcmVudHMoJy5qcy1hdWRpb1dyYXAnKSxcbiAgICAgICAgICAgICRsaXN0VHJhY2tzID0gJCgnLmpzLXRyYWNrTGlzdENvbnQnKS5maW5kKCcuanMtdHJhY2tDb250JyksXG4gICAgICAgICAgICBzcmNDdXJyZW50VHJhY2sgPSAkcGFyZW50LmZpbmQoJy5qcy1hdWRpb0NvbnQgc291cmNlJykuYXR0cignc3JjJyk7XG4gICAgICAgIC8vIGN1cnJlbnRUcmFjayA9ICRwYXJlbnQuZmluZCgnLmpzLWF1ZGlvQ29udCBzb3VyY2UnKTtcblxuICAgICAgICAkbGlzdFRyYWNrcy5lYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB0aGlzRGF0YSA9ICR0aGlzLmRhdGEoJ2F1ZGlvLXNyYycpLFxuICAgICAgICAgICAgICAgIG5leHRUcmFja1BsYXlCdG4gPSAkdGhpcy5uZXh0KCkuZmluZCgnLnRyYWNrLWxpc3RfX2J0bicpO1xuXG4gICAgICAgICAgICBpZihzcmNDdXJyZW50VHJhY2sgPT09IHRoaXNEYXRhKXtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFRyYWNrQWRkcmVzcyA9ICR0aGlzLm5leHQoKS5kYXRhKCdhdWRpby1zcmMnKSxcbiAgICAgICAgICAgICAgICAgICAgbmV4dFRyYWNrID0gJHRoaXMubmV4dCgpO1xuXG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuanMtYXVkaW9Db250IHNvdXJjZScpLmF0dHIoJ3NyYycsIG5leHRUcmFja0FkZHJlc3MpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1hdWRpb0NvbnQnKVswXS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgcGxheU5leHQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWF1ZGlvUGxheScpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vY2hhbmdlIGljb25cbiAgICAgICAgICAgICAgICAgICAgbmV4dFRyYWNrUGxheUJ0bi5yZW1vdmVDbGFzcyhwbGF5Q2xhc3MpLmFkZENsYXNzKHBhdXNlQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBuZXh0VHJhY2tQbGF5QnRuLnBhcmVudCgpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MocGF1c2VDbGFzcykuYWRkQ2xhc3MocGxheUNsYXNzKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBwcmV2VHJhY2tCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHZhciAkdGhpcyA9ICAkKHRoaXMpLFxuICAgICAgICAgICAgJHBhcmVudCA9ICR0aGlzLnBhcmVudHMoJy5qcy1hdWRpb1dyYXAnKSxcbiAgICAgICAgICAgICRsaXN0VHJhY2tzID0gJCgnLmpzLXRyYWNrTGlzdENvbnQnKS5maW5kKCcuanMtdHJhY2tDb250JyksXG4gICAgICAgICAgICBzcmNDdXJyZW50VHJhY2sgPSAkcGFyZW50LmZpbmQoJy5qcy1hdWRpb0NvbnQgc291cmNlJykuYXR0cignc3JjJyk7XG4gICAgICAgIC8vIGN1cnJlbnRUcmFjayA9ICRwYXJlbnQuZmluZCgnLmpzLWF1ZGlvQ29udCBzb3VyY2UnKTtcblxuICAgICAgICAkbGlzdFRyYWNrcy5lYWNoKGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB0aGlzRGF0YSA9ICR0aGlzLmRhdGEoJ2F1ZGlvLXNyYycpLFxuICAgICAgICAgICAgICAgIHByZXZUcmFja1BsYXlCdG4gPSAkdGhpcy5wcmV2KCkuZmluZCgnLnRyYWNrLWxpc3RfX2J0bicpO1xuXG4gICAgICAgICAgICBpZihzcmNDdXJyZW50VHJhY2sgPT09IHRoaXNEYXRhKXtcbiAgICAgICAgICAgICAgICB2YXIgcHJldlRyYWNrQWRkcmVzcyA9ICR0aGlzLnByZXYoKS5kYXRhKCdhdWRpby1zcmMnKSxcbiAgICAgICAgICAgICAgICAgICAgcHJldlRyYWNrID0gJHRoaXMucHJldigpO1xuXG4gICAgICAgICAgICAgICAgJHBhcmVudC5maW5kKCcuanMtYXVkaW9Db250IHNvdXJjZScpLmF0dHIoJ3NyYycsIHByZXZUcmFja0FkZHJlc3MpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1hdWRpb0NvbnQnKVswXS5sb2FkKCk7XG4gICAgICAgICAgICAgICAgcGxheVByZXYgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWF1ZGlvUGxheScpLmNsaWNrKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vY2hhbmdlIGljb25cbiAgICAgICAgICAgICAgICAgICAgcHJldlRyYWNrUGxheUJ0bi5yZW1vdmVDbGFzcyhwbGF5Q2xhc3MpLmFkZENsYXNzKHBhdXNlQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICBwcmV2VHJhY2tQbGF5QnRuLnBhcmVudCgpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MocGF1c2VDbGFzcykuYWRkQ2xhc3MocGxheUNsYXNzKTtcbiAgICAgICAgICAgICAgICB9LCAxMDApO1xuXG4gICAgICAgICAgICAgICAgLy8gcHJldlRyYWNrUGxheUJ0bi5wYXJlbnQoKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKHBhdXNlQ2xhc3MpLmFkZENsYXNzKHBsYXlDbGFzcyk7XG4gICAgICAgICAgICAgICAgLy8gZ2x5cGhpY29uLnJlbW92ZUNsYXNzKGdseXBoaWNvblBsYXkpLmFkZENsYXNzKGdseXBoaWNvblBhdXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIC8qKlxuICAgICAqINCf0LDRg9C30LAsINCy0YvQutC70Y7Rh9C10L3QuNC1INC30LLRg9C60LAg0Lgg0YHQtNCy0LjQsyDQv9C+0LvQt9GD0L3QutCwIHRpbWVsaW5lXG4gICAgICovXG4gICAgJCgnLmpzLWF1ZGlvUGxheSwgLmpzLS1hdWRpby1tdXRlLCAuanMtdHJhY2tMaXN0QnRuJykub24oJ2NsaWNrJywgbWFpbk1vdmVUcmFjayk7XG5cbiAgICBmdW5jdGlvbiBtYWluTW92ZVRyYWNrICgpIHtcbiAgICAgICAgLy8g0JzQtdC90Y/QtdC8INC40LrQvtC90LrRg1xuICAgICAgICBnbHlwaGljb24gPSAkKHRoaXMpLmZpbmQoJy5nbHlwaGljb24nKTtcbiAgICAgICAgdG9nZ2xlQ2xhc3MgPSBnbHlwaGljb24uZGF0YSgndG9nZ2xlLWNsYXNzJyk7XG4gICAgICAgIC8vIGdseXBoaWNvbi5kYXRhKCd0b2dnbGUtY2xhc3MnLCBnbHlwaGljb24uYXR0cignY2xhc3MnKSkucmVtb3ZlQ2xhc3MoKS5hZGRDbGFzcyh0b2dnbGVDbGFzcyk7XG5cbiAgICAgICAgdmFyIHRyYWNrQnRuUGxheSA9ICR0aGlzLmZpbmQoJy50cmFjay1saXN0X19idG4nKTtcbiAgICAgICAgdmFyIHRyYWNrQ3VycmVudCA9ICR0aGlzLnBhcmVudCgpO1xuICAgICAgICBpZiAodHJhY2tCdG5QbGF5Lmhhc0NsYXNzKHBsYXlDbGFzcykpIHtcbiAgICAgICAgICAgIHRyYWNrQnRuUGxheS5yZW1vdmVDbGFzcyhwbGF5Q2xhc3MpLmFkZENsYXNzKHBhdXNlQ2xhc3MpO1xuICAgICAgICAgICAgZ2x5cGhpY29uLnJlbW92ZUNsYXNzKGdseXBoaWNvblBsYXkpLmFkZENsYXNzKGdseXBoaWNvblBhdXNlKTtcbiAgICAgICAgICAgIHRyYWNrQ3VycmVudC5zaWJsaW5ncygpLmZpbmQoJy5qcy10cmFja0xpc3RCdG4nKS5maW5kKCcudHJhY2stbGlzdF9fYnRuJykucmVtb3ZlQ2xhc3MocGF1c2VDbGFzcykuYWRkQ2xhc3MocGxheUNsYXNzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHJhY2tCdG5QbGF5LnJlbW92ZUNsYXNzKHBhdXNlQ2xhc3MpLmFkZENsYXNzKHBsYXlDbGFzcyk7XG4gICAgICAgICAgICBnbHlwaGljb24ucmVtb3ZlQ2xhc3MoZ2x5cGhpY29uUGF1c2UpLmFkZENsYXNzKGdseXBoaWNvblBsYXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgYXVkaW8gPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1hdWRpb1dyYXAnKS5maW5kKCcuanMtYXVkaW9Db250Jyk7XG4gICAgICAgIHRpbWVsaW5lID0gYXVkaW8uY2xvc2VzdCgnLmpzLWF1ZGlvV3JhcCcpLmZpbmQoJy5qcy10aW1lbGluZScpO1xuICAgICAgICBkdXJhdGlvbiA9IGF1ZGlvLnByb3AoJ2R1cmF0aW9uJyk7XG5cbiAgICAgICAgdmFyIHBsYXlpbmdUcmFjayA9ICQoJy5qcy1hdWRpb0NvbnQgc291cmNlJyk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coZHVyYXRpb24pO1xuICAgICAgICB3aWR0aCA9IHRpbWVsaW5lLndpZHRoKCk7XG4gICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKCdqcy1hdWRpb1BsYXknKSkge1xuICAgICAgICAgICAgLy8g0KHRgtCw0YDRgi/Qv9Cw0YPQt9CwINC4INC00LLQuNCz0LDQtdC8INC/0L7Qu9C30YPQvdC+0LpcbiAgICAgICAgICAgIGlmKGF1ZGlvLnByb3AoJ3BhdXNlZCcpKSB7XG4gICAgICAgICAgICAgICAgYXVkaW8udHJpZ2dlcigncGxheScpO1xuICAgICAgICAgICAgICAgIHZhciBpZEludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBhdWRpby5wcm9wKCdjdXJyZW50VGltZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxlZnQgPSAxMDAqY3VycmVudFRpbWUvZHVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIC8vIHRpbWVsaW5lLmZpbmQoJy5qcy10aW1lbGluZS1jb250cm9sJykuY3NzKCdsZWZ0JywgbGVmdCsnJScpO1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiAoY3VycmVudFRpbWUgPT0gZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGNsZWFySW50ZXJ2YWwoaWRJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdCA9IHdpZHRoKmN1cnJlbnRUaW1lL2R1cmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICB0aW1lbGluZS5maW5kKCcuanMtdGltZWxpbmUtY29udHJvbCcpLmNzcygnbGVmdCcsIGxlZnQrJ3B4Jyk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpZEludGVydmFsJytsZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lID09IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGlkSW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGF1ZGlvLnRyaWdnZXIoJ3BhdXNlJyk7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpZEludGVydmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBlbHNlIHtcbiAgICAgICAgLy8gICAgIC8vINCf0LXRgNC10LrQu9GO0YfQsNC10Lwg0LfQstGD0LpcbiAgICAgICAgLy8gICAgIGF1ZGlvLnByb3AoXCJtdXRlZFwiLCFhdWRpby5wcm9wKFwibXV0ZWRcIikpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbi8vZnVuY3Rpb24gZm9yIGF1dG9wbGF5XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5qcy10cmFja0xpc3RCdG4nKS5maXJzdCgpLmNsaWNrKCk7XG4gICAgICAgIC8vIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAgICAgJCgnLmpzLWF1ZGlvUGxheScpLmNsaWNrKCk7XG4gICAgICAgIC8vIH0sIDEwMCk7XG4gICAgfSwgMTEwMCk7XG5cbiAgICAvKipcbiAgICAgKiDQn9C10YDQtdC80L7RgtC60LAg0YLRgNC10LrQsCDQv9C+INC60LvQuNC60YMg0L3QsCB0aW1lbGluZVxuICAgICAqL1xuICAgICQoJy5qcy10aW1lbGluZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBhdWRpb1RpbWUgPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy1hdWRpb1dyYXAnKS5maW5kKCcuanMtYXVkaW9Db250Jyk7XG4gICAgICAgIHZhciBkdXJhdGlvbiA9IGF1ZGlvVGltZS5wcm9wKCdkdXJhdGlvbicpO1xuICAgICAgICBpZiAoZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gJCh0aGlzKS5vZmZzZXQoKTtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gZS5jbGllbnRYLW9mZnNldC5sZWZ0O1xuICAgICAgICAgICAgdmFyIHdpZHRoID0gJCh0aGlzKS53aWR0aCgpO1xuICAgICAgICAgICAgLy8gJCh0aGlzKS5maW5kKCcuanMtLXRpbWVsaW5lLWNvbnRyb2wnKS5jc3MoJ2xlZnQnLCAxMDAqbGVmdC9kdXJhdGlvbi8yKyclJyk7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJy5qcy10aW1lbGluZS1jb250cm9sJykuY3NzKCdsZWZ0JywgbGVmdCsncHgnKTtcbiAgICAgICAgICAgIGF1ZGlvVGltZS5wcm9wKCdjdXJyZW50VGltZScsIGR1cmF0aW9uKmxlZnQvd2lkdGgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RpbWVsaW5lJytkdXJhdGlvbipsZWZ0L3dpZHRoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcblxuXG5cbi8vIGpRdWVyeSBVSVxuXG5cbiAgICAkKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHdpZHRoID0gJCgnLmpzLXRpbWVsaW5lJykud2lkdGgoKTtcblxuICAgICAgICAkKCAnLmF1ZGlvX190aW1lbGluZScgKS5zbGlkZXIoe1xuICAgICAgICAgICAgcmFuZ2U6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgIG1heDogd2lkdGgsXG4gICAgICAgICAgICBzdGVwOiAwLjAxLFxuICAgICAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiggZXZlbnQsIHVpICkge1xuICAgICAgICAgICAgICAgICQoJy51aS1zbGlkZXItaGFuZGxlJykuYWRkQ2xhc3MoJ2F1ZGlvX190aW1lbGluZS1jb250cm9sIGpzLXRpbWVsaW5lLWNvbnRyb2wnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzbGlkZTogZnVuY3Rpb24oIGV2ZW50LCB1aSApIHtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2VXaWR0aCA9ICQoJy51aS1zbGlkZXItcmFuZ2UnKS53aWR0aCgpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJhbmdlV2lkdGgpO1xuICAgICAgICAgICAgICAgICQoJy5qcy10aW1lbGluZScpLmZpbmQoJy5qcy10aW1lbGluZS1jb250cm9sJykuY3NzKCdsZWZ0JywgcmFuZ2VXaWR0aCsncHgnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndWknK3JhbmdlV2lkdGgpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RvcDogZnVuY3Rpb24oIGV2ZW50LCB1aSApIHtcbiAgICAgICAgICAgICAgICAvLyB2YXIgcmFuZ2VXaWR0aCA9ICQoJy51aS1zbGlkZXItcmFuZ2UnKS53aWR0aCgpO1xuICAgICAgICAgICAgICAgIC8vICQoJy5qcy0tdGltZWxpbmUnKS5maW5kKCcuanMtLXRpbWVsaW5lLWNvbnRyb2wnKS5jc3MoJ2xlZnQnLCByYW5nZVdpZHRoKydweCcpO1xuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgICAgICAvLyB2YXIgYXVkaW8gPSAkKHRoaXMpLmNsb3Nlc3QoJy5qcy0tYXVkaW8td3JhcCcpLmZpbmQoJy5qcy0tYXVkaW8tY29udCcpWzBdO1xuICAgICAgICAgICAgICAgIC8vIGF1ZGlvLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgdmFyIGF1ZGlvVGltZSA9ICQodGhpcykuY2xvc2VzdCgnLmpzLWF1ZGlvV3JhcCcpLmZpbmQoJy5qcy1hdWRpb0NvbnQnKTtcbiAgICAgICAgICAgICAgICB2YXIgZHVyYXRpb24gPSBhdWRpb1RpbWUucHJvcCgnZHVyYXRpb24nKTtcbiAgICAgICAgICAgICAgICBpZiAoZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXQgPSAkKHRoaXMpLm9mZnNldCgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbGVmdCA9IGV2ZW50LmNsaWVudFgtb2Zmc2V0LmxlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3aWR0aCA9ICQodGhpcykud2lkdGgoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gJCh0aGlzKS5maW5kKCcuanMtLXRpbWVsaW5lLWNvbnRyb2wnKS5jc3MoJ2xlZnQnLCAxMDAqbGVmdC9kdXJhdGlvbi8yKyclJyk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLXRpbWVsaW5lLWNvbnRyb2wnKS5jc3MoJ2xlZnQnLCBsZWZ0KydweCcpO1xuICAgICAgICAgICAgICAgICAgICBhdWRpb1RpbWUucHJvcCgnY3VycmVudFRpbWUnLCBkdXJhdGlvbipsZWZ0L3dpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gJCggXCIjYW1vdW50XCIgKS52YWwoIFwiJFwiICsgJCggXCIjc2xpZGVyLXJhbmdlLW1pblwiICkuc2xpZGVyKCBcInZhbHVlXCIgKSApO1xuICAgIH0pO1xuLy8gJCgnLnVpLXNsaWRlci1oYW5kbGUnKS5hZGRDbGFzcygnYXVkaW9fX3RpbWVsaW5lLWNvbnRyb2wnKTtcblxufSkoKTsiXSwiZmlsZSI6InRwbC9fbXVzaWMtcGxheWVyLmpzIn0=
