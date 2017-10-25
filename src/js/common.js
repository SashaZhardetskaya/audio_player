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