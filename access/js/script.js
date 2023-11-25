
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const slider = $('#slider');
const playlist = document.querySelector(".playlist");
const cd = document.querySelector(".cd");
const heading = $('header h2');
const cdThumbnail = $('.cd__thumb');
const audio = $('#audio');
const player = $('.player');
const playButton = $('.btn-toggle-play');
const pauseIcon = $('.fa-pause');
const playIcon = $('.fa-play');
const nextButton = $('.btn-next');
const prevButton = $('.btn-prev');
const repeatButton = $('.btn-repeat')
const shuffleButton = $('.btn-shuffle');
var firstStart = 0;
const cdThumbnailAnimate = cdThumbnail.animate([
    {
        transform: 'rotate(360deg)'
    }
], {
    duration: 10000, //10s
    iterations: Infinity
})
cdThumbnailAnimate.pause();
const playingCheck = function () {
    if (player.classList.contains("playing")) {
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
    }
    else {
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
    }
}

const PLAYER_STORAGE_KEY = 'damian_player';

const songs = [
    {
        name: "GODS",
        author: "NewJeans",
        thumbnail: "../access/image/image1.jpg",
        audio: "../access/audio/song1.mp3"
    },
    {
        name: "Lệ Lưu Ly",
        author: "Vũ Phụng Tiên",
        thumbnail: "../access/image/image2.jpg",
        audio: "../access/audio/song2.mp3"
    },
    {
        name: "Legends Never Die",
        author: "Against The Current",
        thumbnail: "../access/image/image3.jpg",
        audio: "../access/audio/song3.mp3"
    },
    {
        name: "Solo",
        author: "Myles Smith",
        thumbnail: "../access/image/image4.jpg",
        audio: "../access/audio/song4.mp3"
    },
    {
        name: "Circles",
        author: "Post Malone",
        thumbnail: "../access/image/image5.jpg",
        audio: "../access/audio/song5.mp3"
    },
    {
        name: "WOW",
        author: "TeamSlut && DukiTran",
        thumbnail: "../access/image/image6.jpg",
        audio: "../access/audio/song6.mp3"
    },
    {
        name: "Wake Up In The Sky",
        author: "Bruno Mars",
        thumbnail: "../access/image/image7.jpg",
        audio: "../access/audio/song7.mp3"
    },
    {
        name: "Die For You",
        author: "The Weekend",
        thumbnail: "../access/image/image8.jpg",
        audio: "../access/audio/song8.mp3"
    },
    {
        name: "Save Your Tears",
        author: "The Weekend",
        thumbnail: "../access/image/image9.jpg",
        audio: "../access/audio/song9.mp3"
    },
    {
        name: "Blinding Lights",
        author: "The Weekend",
        thumbnail: "../access/image/image10.jpg",
        audio: "../access/audio/song10.mp3"
    },
    
]
const app = {

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    firstStart: 0,
    firstRepeat: 0,
    firstShuffle: 0,
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,

    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    loadConfig: function () {

        app.isRandom = this.config.isRandom
        app.isRepeat = this.config.isRepeat
        
        if (this.config.continueIndex > 0) {
            app.currentIndex = this.config.continueIndex
        }
        else {
            app.currentIndex = 0;
        }

        if(this.config.isRepeat != null){
            repeatButton.classList.toggle("active", this.config.isRepeat);
        }
        if(this.config.isRandom != null){
            shuffleButton.classList.toggle("active", this.config.isRandom);
        }
        

    },

    render: function () {
        const songsList = songs.map(function (song, index) {
            return `
            <div songIndex="${index}" class="song ${index == app.currentIndex ? 'active_song' : ''}">
            <div class="thumbnail" style="background-image: url('${song.thumbnail}')"></div>
            <div class="content">
                <div class="name">${song.name}</div>
                <div class="author">${song.author}</div>
            </div>
            <div class="option">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
        </div>
            `
        })

        playlist.innerHTML = songsList.join("");
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return songs[this.currentIndex];
            }
        })
    },

    loadCurrentSong: function () {
        heading.innerHTML = this.currentSong.name;
        cdThumbnail.style.backgroundImage = `url('${this.currentSong.thumbnail}')`;
        audio.src = this.currentSong.audio;
        audio.currentTime = 0;
        slider.value = 0;
        if (this.currentIndex >= 0 && firstStart >0) 
        {
            audio.play();
            this.setConfig('continueIndex', this.currentIndex)
            cdThumbnailAnimate.play();
            player.classList.add("playing");
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");
        }
    },



    handleEvents: function () {
        const _this = this; //lay cai this == app
        //xu li quay dia cd

        //xu li cd
        const cdwidth = cd.offsetWidth;
        document.onscroll = function () {
            const zoom = (document.documentElement.scrollTop);
            const newcdWidth = cdwidth - zoom / 3.5;
            if (newcdWidth > 0) {
                cd.style.width = newcdWidth + "px";
                cd.style.opacity = newcdWidth / cdwidth;
            }
            else {
                cd.style.width = 0 + "px";
            }
        }

        //xu li click play

        playButton.addEventListener("click", function () {
            playingCheck();
            firstStart = 1;      
            _this.setConfig('continueIndex', _this.currentIndex)     
            player.classList.toggle("playing");
            if (player.classList.contains("playing")) {
                
                audio.play();
                cdThumbnailAnimate.play();
            }
            else {
                audio.pause();
                cdThumbnailAnimate.pause();
            }

        })

        //khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const percent = Math.floor(audio.currentTime / audio.duration * 100);
                slider.value = percent;
            }
        }

        //xu li slider khi tua bai hat
        slider.addEventListener("change", function (e) {
            const timey = e.target.value;
            audio.currentTime = timey / 100 * audio.duration;

        })

        const scrollToActiveSong = function () {
            setTimeout(function () {
                const activeSong = $('.active_song')
                activeSong.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',

                });
            }, 300)

        }

        const nextSong = function () {
            _this.currentIndex++;
            if (_this.currentIndex >= songs.length) {
                _this.currentIndex = 0;
                _this.currentSong = 0;
            }
            else {
                _this.currentSong = _this.currentIndex;
            }
            _this.render();
            _this.loadCurrentSong();
            _this.scrollToActiveSong();
        }
        const prevSong = function () {
            _this.currentIndex--;
            if (_this.currentIndex < 0) {
                _this.currentIndex = songs.length - 1;
                _this.currentSong = songs.length - 1;
            }
            else {
                _this.currentSong = _this.currentIndex;
            }
            _this.render();
            _this.loadCurrentSong();
            _this.scrollToActiveSong();
        }
        //xu li click nut next
        nextButton.addEventListener("click", function () {
            if (_this.isRandom) {
                playRandom();
            }
            nextSong();
        })
        prevButton.addEventListener("click", function () {
            if (_this.isRandom) {
                playRandom();
            }
            prevSong();
        })

        //xu li khi bai hat ket thuc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            }
            else {
                nextButton.click();
            }

        }

        //xu li nut repeat
        repeatButton.addEventListener("click", function () {
            this.firstRepeat = 1;
            _this.setConfig('isRepeat', !_this.isRepeat);
            _this.isRepeat = !_this.isRepeat     
            repeatButton.classList.toggle("active");
        
        })

        const playRandom = function () {
            let newIndex = _this.currentIndex;
            while (_this.currentIndex === newIndex) {
                newIndex = Math.floor(Math.random() * songs.length);
            }
            _this.currentIndex = newIndex
            console.log(_this.currentIndex)
            _this.loadCurrentSong();
        }

        shuffleButton.addEventListener("click", function () {
            this.firstShuffle = 1;
            _this.setConfig('isRandom', !_this.isRandom);
            _this.isRandom = !_this.isRandom;
            shuffleButton.classList.toggle("active");
        })


        playlist.addEventListener("click", function (e) {
            //closet tra ve no hoac cha cua no
            //xu li khi click vao song
            const songTarget = e.target.closest('.song:not(.active_song)')
            const songOption = e.target.closest('.option');
            if (songOption || songTarget) {
                if (songTarget) {
                    // console.log(songTarget.getAttribute('songIndex'));
                    app.currentIndex = songTarget.getAttribute('songIndex');
                    console.log(app.currentIndex);
                    // _this.setConfig('continueIndex', this.currentIndex)
                    app.render();
                    _this.loadCurrentSong();

                }
                else {
                    console.log('abc')
                }
            }
        })

    },



    start: function () {
        //tai cau hinh tu config vao object app
        this.loadConfig();
        //Dinh nghia thuoc tinh cho object
        this.defineProperties();
        this.handleEvents();

        //tai thong tin bai hat dau tien vao UI khi chay ung dung
        this.loadCurrentSong();

        //render danh sach bai hat
        this.render();

    }

}

app.start();

