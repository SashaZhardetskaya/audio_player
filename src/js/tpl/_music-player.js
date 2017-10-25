
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
