$(document).ready(function () {
    /*
     * $1 script for section scrolling
     * */


    function Player(playerContent, songs) {
        var self = this;

        this.isPlaying = false;
        this.currentTiming = 0;
        this.currentSongIndex = 0;
        this.songs = songs;
        this.playerContent = playerContent;
        this.playerAudioSource = playerContent.find('source');
        this.timelineMoving = false;

        this.changeSong = function (step) {
            self.isPlaying && self.songs[this.currentSongIndex].togglePlayingIcon();

            self.currentSongIndex = (self.currentSongIndex + step) % self.songs.length;
            if (self.currentSongIndex < 0) {
                self.currentSongIndex = self.songs.length + self.currentSongIndex;
            }

            self.isPlaying && self.songs[this.currentSongIndex].togglePlayingIcon();

            self.playerAudioSource.attr('src', self.songs[self.currentSongIndex].path);
            self.playerContent[0].load();

            if(self.isPlaying) {
                playerContent.trigger('play');
            } else {
                playerContent.trigger('pause');
            }

            console.log('now playing ' + self.songs[self.currentSongIndex].name);
        };

        this.nextSong = function() {
            self.changeSong(1);
        };
        this.previousSong = function() {
            self.changeSong(-1);
        };
        this.setSong = function(songToSet) {
            var index = self.getSongIndexByPath(songToSet);
            console.log(self.songs[self.currentSongIndex], self.songs[index]);
            if (index != self.currentSongIndex) { //pause on small play btns instead of stop
                self.changeSong(index - self.currentSongIndex);
                return false;
            }
            return true;
        };
        this.getSongIndexByPath = function(songPath) {
            for (var i = 0; i < self.songs.length; ++i) {
                if (self.songs[i].path === songPath) {
                    return i;
                }
            }
            return -1;
        };

        this.rewindTo = function(second) {
            self.currentTiming = second;
            // self.currentTiming = playerContent.currentTime;
            console.log('go to ' + second + '___' + self.currentTiming + ' second');

            playerContent.prop('currentTime', self.currentTiming);
        };

        this.togglePlaying = function() {
            self.isPlaying = !self.isPlaying;
            console.log('toggle playing, now ' + self.isPlaying + ', song: ' + self.songs[this.currentSongIndex].name);
            if(self.isPlaying) {
                playerContent.trigger('play');
            } else {
                playerContent.trigger('pause');
            }
            self.songs[this.currentSongIndex].togglePlayingIcon();
        };

        this.timelineMove = function songIntervls(timeControl) {
            console.log(self.timelineMoving +'self.timelineMoving;');
            if (self.timelineMoving == false && self.isPlaying) {
                return function () {
                    var idInterval = setInterval(function () {
                        if (!self.isPlaying) {
                            clearInterval(idInterval);
                            self.timelineMoving = false;
                        }
                        var currentTime = playerContent.prop('currentTime');
                        if (currentTime >= self.songs[self.currentSongIndex].duration) self.nextSong();
                        if (self.isPlaying) {
                            currentTime = playerContent.prop('currentTime');
                            var timelinePos = 100 * currentTime / self.songs[self.currentSongIndex].duration;
                            console.log(timelinePos);
                            timeControl.css('left', timelinePos+'%');
                            self.timelineMoving = true;
                        }
                    }, 1000);
                }();
            }
            return -1;
        };
    }

    var songs = [];
    $('.js-audioTrackCont').each(function(idx, item) {
        var $audioTrackCont = $(this);
        songs.push({
            path: $audioTrackCont.data('audio-src'),
            duration: $audioTrackCont.data('duration'),
            name: $audioTrackCont.data('audio-src'),
            togglePlayingIcon: function() {
                $audioTrackCont.find('.audio-track__btn').toggleClass('audio-track__btn--play');
                $audioTrackCont.find('.audio-track__btn').toggleClass('audio-track__btn--pause');
            }
        });
    });

    var player = new Player($('.js-audio'), songs),
        playBtn = $('.js-audioPlayBtn'),
        nextBtn = $('.js-audioNextBtn'),
        prevBtn = $('.js-audioPrevBtn'),
        playBtns = $('.js-audioTrackBtn'),
        timelineWidth = $('.js-audioTimeline').width();


    function togglePlay($playBtn) {
        var gi = $playBtn.find('.js-glyphicon');
        gi.toggleClass('glyphicon--play');
        gi.toggleClass('glyphicon--pause');
    }

    playBtn.on('click', function() {
        player.togglePlaying();
        togglePlay(playBtn);

        player.timelineMove($('.ui-slider-handle'));
    });
    nextBtn.on('click', function() {
        player.nextSong();
    });
    prevBtn.on('click', function() {
        player.previousSong();
    });
    playBtns.on('click', function() {
        player.togglePlaying();
        togglePlay(playBtn);

        var songToSet = $(this).parents('.js-audioTrackCont').data('audio-src');
        var sameSong = player.setSong(songToSet);

        player.timelineMove($('.ui-slider-handle'));

        if (!player.isPlaying && !sameSong) {
            player.togglePlaying();
            togglePlay(playBtn);
        }
    });

    var timeControlPosition = 0;
    var currentSongDuration = 0;
    var $timelineControl = $(".js-timelineControl");
    var rewindingPouse = false;
    $(function () {
        var slider = $timelineControl.slider({
            range: "min",
            value: 0,
            min: 0,
            max: 100,
            step: 1,
            rewindingPouse: false,
            // slide: function( event, ui ) {  ////timeline controll width equal to song width
            //     // currentSongDuration = player.songs[player.currentSongIndex].duration;
            //     // timeControlPosition = $('.ui-slider-range').width();
            //     currentSongDuration = songs[player.currentSongIndex].duration;
            //     player.timelineMove($('.ui-slider-handle'),$('.ui-slider-range'));
            // },
            start: function( event, ui ) {
                if (player.isPlaying) {
                    player.togglePlaying();
                    songs[player.currentSongIndex].togglePlayingIcon();
                    rewindingPouse = true;
                } else {
                    rewindingPouse = false;
                }
            },
            stop: function( event, ui ) {
                console.log(rewindingPouse+'rewindingPouse');
                if (rewindingPouse) {
                    player.togglePlaying();
                    songs[player.currentSongIndex].togglePlayingIcon();
                }
                currentSongDuration = songs[player.currentSongIndex].duration;
                timeControlPosition = $('.ui-slider-range').width();
                player.rewindTo(currentSongDuration*timeControlPosition/timelineWidth);

                player.timelineMove($('.ui-slider-handle'));
            }
        });
    });


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIC8qXG4gICAgICogJDEgc2NyaXB0IGZvciBzZWN0aW9uIHNjcm9sbGluZ1xuICAgICAqICovXG5cblxuICAgIGZ1bmN0aW9uIFBsYXllcihwbGF5ZXJDb250ZW50LCBzb25ncykge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdXJyZW50VGltaW5nID0gMDtcbiAgICAgICAgdGhpcy5jdXJyZW50U29uZ0luZGV4ID0gMDtcbiAgICAgICAgdGhpcy5zb25ncyA9IHNvbmdzO1xuICAgICAgICB0aGlzLnBsYXllckNvbnRlbnQgPSBwbGF5ZXJDb250ZW50O1xuICAgICAgICB0aGlzLnBsYXllckF1ZGlvU291cmNlID0gcGxheWVyQ29udGVudC5maW5kKCdzb3VyY2UnKTtcbiAgICAgICAgdGhpcy50aW1lbGluZU1vdmluZyA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuY2hhbmdlU29uZyA9IGZ1bmN0aW9uIChzdGVwKSB7XG4gICAgICAgICAgICBzZWxmLmlzUGxheWluZyAmJiBzZWxmLnNvbmdzW3RoaXMuY3VycmVudFNvbmdJbmRleF0udG9nZ2xlUGxheWluZ0ljb24oKTtcblxuICAgICAgICAgICAgc2VsZi5jdXJyZW50U29uZ0luZGV4ID0gKHNlbGYuY3VycmVudFNvbmdJbmRleCArIHN0ZXApICUgc2VsZi5zb25ncy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoc2VsZi5jdXJyZW50U29uZ0luZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudFNvbmdJbmRleCA9IHNlbGYuc29uZ3MubGVuZ3RoICsgc2VsZi5jdXJyZW50U29uZ0luZGV4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLmlzUGxheWluZyAmJiBzZWxmLnNvbmdzW3RoaXMuY3VycmVudFNvbmdJbmRleF0udG9nZ2xlUGxheWluZ0ljb24oKTtcblxuICAgICAgICAgICAgc2VsZi5wbGF5ZXJBdWRpb1NvdXJjZS5hdHRyKCdzcmMnLCBzZWxmLnNvbmdzW3NlbGYuY3VycmVudFNvbmdJbmRleF0ucGF0aCk7XG4gICAgICAgICAgICBzZWxmLnBsYXllckNvbnRlbnRbMF0ubG9hZCgpO1xuXG4gICAgICAgICAgICBpZihzZWxmLmlzUGxheWluZykge1xuICAgICAgICAgICAgICAgIHBsYXllckNvbnRlbnQudHJpZ2dlcigncGxheScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwbGF5ZXJDb250ZW50LnRyaWdnZXIoJ3BhdXNlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdub3cgcGxheWluZyAnICsgc2VsZi5zb25nc1tzZWxmLmN1cnJlbnRTb25nSW5kZXhdLm5hbWUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMubmV4dFNvbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuY2hhbmdlU29uZygxKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wcmV2aW91c1NvbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuY2hhbmdlU29uZygtMSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuc2V0U29uZyA9IGZ1bmN0aW9uKHNvbmdUb1NldCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gc2VsZi5nZXRTb25nSW5kZXhCeVBhdGgoc29uZ1RvU2V0KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuc29uZ3Nbc2VsZi5jdXJyZW50U29uZ0luZGV4XSwgc2VsZi5zb25nc1tpbmRleF0pO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9IHNlbGYuY3VycmVudFNvbmdJbmRleCkgeyAvL3BhdXNlIG9uIHNtYWxsIHBsYXkgYnRucyBpbnN0ZWFkIG9mIHN0b3BcbiAgICAgICAgICAgICAgICBzZWxmLmNoYW5nZVNvbmcoaW5kZXggLSBzZWxmLmN1cnJlbnRTb25nSW5kZXgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmdldFNvbmdJbmRleEJ5UGF0aCA9IGZ1bmN0aW9uKHNvbmdQYXRoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGYuc29uZ3MubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zb25nc1tpXS5wYXRoID09PSBzb25nUGF0aCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yZXdpbmRUbyA9IGZ1bmN0aW9uKHNlY29uZCkge1xuICAgICAgICAgICAgc2VsZi5jdXJyZW50VGltaW5nID0gc2Vjb25kO1xuICAgICAgICAgICAgLy8gc2VsZi5jdXJyZW50VGltaW5nID0gcGxheWVyQ29udGVudC5jdXJyZW50VGltZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnbyB0byAnICsgc2Vjb25kICsgJ19fXycgKyBzZWxmLmN1cnJlbnRUaW1pbmcgKyAnIHNlY29uZCcpO1xuXG4gICAgICAgICAgICBwbGF5ZXJDb250ZW50LnByb3AoJ2N1cnJlbnRUaW1lJywgc2VsZi5jdXJyZW50VGltaW5nKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnRvZ2dsZVBsYXlpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHNlbGYuaXNQbGF5aW5nID0gIXNlbGYuaXNQbGF5aW5nO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RvZ2dsZSBwbGF5aW5nLCBub3cgJyArIHNlbGYuaXNQbGF5aW5nICsgJywgc29uZzogJyArIHNlbGYuc29uZ3NbdGhpcy5jdXJyZW50U29uZ0luZGV4XS5uYW1lKTtcbiAgICAgICAgICAgIGlmKHNlbGYuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgcGxheWVyQ29udGVudC50cmlnZ2VyKCdwbGF5Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBsYXllckNvbnRlbnQudHJpZ2dlcigncGF1c2UnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlbGYuc29uZ3NbdGhpcy5jdXJyZW50U29uZ0luZGV4XS50b2dnbGVQbGF5aW5nSWNvbigpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudGltZWxpbmVNb3ZlID0gZnVuY3Rpb24gc29uZ0ludGVydmxzKHRpbWVDb250cm9sKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnRpbWVsaW5lTW92aW5nICsnc2VsZi50aW1lbGluZU1vdmluZzsnKTtcbiAgICAgICAgICAgIGlmIChzZWxmLnRpbWVsaW5lTW92aW5nID09IGZhbHNlICYmIHNlbGYuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuaXNQbGF5aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpZEludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRpbWVsaW5lTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRpbWUgPSBwbGF5ZXJDb250ZW50LnByb3AoJ2N1cnJlbnRUaW1lJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgPj0gc2VsZi5zb25nc1tzZWxmLmN1cnJlbnRTb25nSW5kZXhdLmR1cmF0aW9uKSBzZWxmLm5leHRTb25nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VGltZSA9IHBsYXllckNvbnRlbnQucHJvcCgnY3VycmVudFRpbWUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZWxpbmVQb3MgPSAxMDAgKiBjdXJyZW50VGltZSAvIHNlbGYuc29uZ3Nbc2VsZi5jdXJyZW50U29uZ0luZGV4XS5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aW1lbGluZVBvcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZUNvbnRyb2wuY3NzKCdsZWZ0JywgdGltZWxpbmVQb3MrJyUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRpbWVsaW5lTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICAgICAgfSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBzb25ncyA9IFtdO1xuICAgICQoJy5qcy1hdWRpb1RyYWNrQ29udCcpLmVhY2goZnVuY3Rpb24oaWR4LCBpdGVtKSB7XG4gICAgICAgIHZhciAkYXVkaW9UcmFja0NvbnQgPSAkKHRoaXMpO1xuICAgICAgICBzb25ncy5wdXNoKHtcbiAgICAgICAgICAgIHBhdGg6ICRhdWRpb1RyYWNrQ29udC5kYXRhKCdhdWRpby1zcmMnKSxcbiAgICAgICAgICAgIGR1cmF0aW9uOiAkYXVkaW9UcmFja0NvbnQuZGF0YSgnZHVyYXRpb24nKSxcbiAgICAgICAgICAgIG5hbWU6ICRhdWRpb1RyYWNrQ29udC5kYXRhKCdhdWRpby1zcmMnKSxcbiAgICAgICAgICAgIHRvZ2dsZVBsYXlpbmdJY29uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkYXVkaW9UcmFja0NvbnQuZmluZCgnLmF1ZGlvLXRyYWNrX19idG4nKS50b2dnbGVDbGFzcygnYXVkaW8tdHJhY2tfX2J0bi0tcGxheScpO1xuICAgICAgICAgICAgICAgICRhdWRpb1RyYWNrQ29udC5maW5kKCcuYXVkaW8tdHJhY2tfX2J0bicpLnRvZ2dsZUNsYXNzKCdhdWRpby10cmFja19fYnRuLS1wYXVzZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHZhciBwbGF5ZXIgPSBuZXcgUGxheWVyKCQoJy5qcy1hdWRpbycpLCBzb25ncyksXG4gICAgICAgIHBsYXlCdG4gPSAkKCcuanMtYXVkaW9QbGF5QnRuJyksXG4gICAgICAgIG5leHRCdG4gPSAkKCcuanMtYXVkaW9OZXh0QnRuJyksXG4gICAgICAgIHByZXZCdG4gPSAkKCcuanMtYXVkaW9QcmV2QnRuJyksXG4gICAgICAgIHBsYXlCdG5zID0gJCgnLmpzLWF1ZGlvVHJhY2tCdG4nKSxcbiAgICAgICAgdGltZWxpbmVXaWR0aCA9ICQoJy5qcy1hdWRpb1RpbWVsaW5lJykud2lkdGgoKTtcblxuXG4gICAgZnVuY3Rpb24gdG9nZ2xlUGxheSgkcGxheUJ0bikge1xuICAgICAgICB2YXIgZ2kgPSAkcGxheUJ0bi5maW5kKCcuanMtZ2x5cGhpY29uJyk7XG4gICAgICAgIGdpLnRvZ2dsZUNsYXNzKCdnbHlwaGljb24tLXBsYXknKTtcbiAgICAgICAgZ2kudG9nZ2xlQ2xhc3MoJ2dseXBoaWNvbi0tcGF1c2UnKTtcbiAgICB9XG5cbiAgICBwbGF5QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBwbGF5ZXIudG9nZ2xlUGxheWluZygpO1xuICAgICAgICB0b2dnbGVQbGF5KHBsYXlCdG4pO1xuXG4gICAgICAgIHBsYXllci50aW1lbGluZU1vdmUoJCgnLnVpLXNsaWRlci1oYW5kbGUnKSk7XG4gICAgfSk7XG4gICAgbmV4dEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcGxheWVyLm5leHRTb25nKCk7XG4gICAgfSk7XG4gICAgcHJldkJ0bi5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcGxheWVyLnByZXZpb3VzU29uZygpO1xuICAgIH0pO1xuICAgIHBsYXlCdG5zLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICBwbGF5ZXIudG9nZ2xlUGxheWluZygpO1xuICAgICAgICB0b2dnbGVQbGF5KHBsYXlCdG4pO1xuXG4gICAgICAgIHZhciBzb25nVG9TZXQgPSAkKHRoaXMpLnBhcmVudHMoJy5qcy1hdWRpb1RyYWNrQ29udCcpLmRhdGEoJ2F1ZGlvLXNyYycpO1xuICAgICAgICB2YXIgc2FtZVNvbmcgPSBwbGF5ZXIuc2V0U29uZyhzb25nVG9TZXQpO1xuXG4gICAgICAgIHBsYXllci50aW1lbGluZU1vdmUoJCgnLnVpLXNsaWRlci1oYW5kbGUnKSk7XG5cbiAgICAgICAgaWYgKCFwbGF5ZXIuaXNQbGF5aW5nICYmICFzYW1lU29uZykge1xuICAgICAgICAgICAgcGxheWVyLnRvZ2dsZVBsYXlpbmcoKTtcbiAgICAgICAgICAgIHRvZ2dsZVBsYXkocGxheUJ0bik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHZhciB0aW1lQ29udHJvbFBvc2l0aW9uID0gMDtcbiAgICB2YXIgY3VycmVudFNvbmdEdXJhdGlvbiA9IDA7XG4gICAgdmFyICR0aW1lbGluZUNvbnRyb2wgPSAkKFwiLmpzLXRpbWVsaW5lQ29udHJvbFwiKTtcbiAgICB2YXIgcmV3aW5kaW5nUG91c2UgPSBmYWxzZTtcbiAgICAkKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNsaWRlciA9ICR0aW1lbGluZUNvbnRyb2wuc2xpZGVyKHtcbiAgICAgICAgICAgIHJhbmdlOiBcIm1pblwiLFxuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICBtYXg6IDEwMCxcbiAgICAgICAgICAgIHN0ZXA6IDEsXG4gICAgICAgICAgICByZXdpbmRpbmdQb3VzZTogZmFsc2UsXG4gICAgICAgICAgICAvLyBzbGlkZTogZnVuY3Rpb24oIGV2ZW50LCB1aSApIHsgIC8vLy90aW1lbGluZSBjb250cm9sbCB3aWR0aCBlcXVhbCB0byBzb25nIHdpZHRoXG4gICAgICAgICAgICAvLyAgICAgLy8gY3VycmVudFNvbmdEdXJhdGlvbiA9IHBsYXllci5zb25nc1twbGF5ZXIuY3VycmVudFNvbmdJbmRleF0uZHVyYXRpb247XG4gICAgICAgICAgICAvLyAgICAgLy8gdGltZUNvbnRyb2xQb3NpdGlvbiA9ICQoJy51aS1zbGlkZXItcmFuZ2UnKS53aWR0aCgpO1xuICAgICAgICAgICAgLy8gICAgIGN1cnJlbnRTb25nRHVyYXRpb24gPSBzb25nc1twbGF5ZXIuY3VycmVudFNvbmdJbmRleF0uZHVyYXRpb247XG4gICAgICAgICAgICAvLyAgICAgcGxheWVyLnRpbWVsaW5lTW92ZSgkKCcudWktc2xpZGVyLWhhbmRsZScpLCQoJy51aS1zbGlkZXItcmFuZ2UnKSk7XG4gICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBsYXllci5pc1BsYXlpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgcGxheWVyLnRvZ2dsZVBsYXlpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgc29uZ3NbcGxheWVyLmN1cnJlbnRTb25nSW5kZXhdLnRvZ2dsZVBsYXlpbmdJY29uKCk7XG4gICAgICAgICAgICAgICAgICAgIHJld2luZGluZ1BvdXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXdpbmRpbmdQb3VzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiggZXZlbnQsIHVpICkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJld2luZGluZ1BvdXNlKydyZXdpbmRpbmdQb3VzZScpO1xuICAgICAgICAgICAgICAgIGlmIChyZXdpbmRpbmdQb3VzZSkge1xuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIudG9nZ2xlUGxheWluZygpO1xuICAgICAgICAgICAgICAgICAgICBzb25nc1twbGF5ZXIuY3VycmVudFNvbmdJbmRleF0udG9nZ2xlUGxheWluZ0ljb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VycmVudFNvbmdEdXJhdGlvbiA9IHNvbmdzW3BsYXllci5jdXJyZW50U29uZ0luZGV4XS5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICB0aW1lQ29udHJvbFBvc2l0aW9uID0gJCgnLnVpLXNsaWRlci1yYW5nZScpLndpZHRoKCk7XG4gICAgICAgICAgICAgICAgcGxheWVyLnJld2luZFRvKGN1cnJlbnRTb25nRHVyYXRpb24qdGltZUNvbnRyb2xQb3NpdGlvbi90aW1lbGluZVdpZHRoKTtcblxuICAgICAgICAgICAgICAgIHBsYXllci50aW1lbGluZU1vdmUoJCgnLnVpLXNsaWRlci1oYW5kbGUnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbn0pOyJdLCJmaWxlIjoiY29tbW9uLmpzIn0=
