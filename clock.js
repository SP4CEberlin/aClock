class AlarmClock {
    constructor() {
        this.alarmMin = 50;
        this.alarmStd = 8;
        this.radioUrl = "https://st03.sslstream.dlf.de/dlf/03/128/mp3/stream.mp3?aggregator=web";
        this.opacity = 0.5;
        this.onOff = true;
        this.audio = new Audio();
        this.isPlaying = false;
        this.updateTimeInterval = 1000; // Interval in milliseconds (1 second)
        this.playButton = document.getElementById("play");
        this.pauseButton = document.getElementById("pause");
        this.settingsDiv = document.getElementById("settings");
        this.aOnButton = document.getElementById("aOn");
        this.mainArea = document.getElementById("main");
        this.aMin = document.getElementById("aMin");
        this.aStd = document.getElementById("aStd");
        this.init();
    }

    init() {
        // Add event listeners and initialize the clock
        this.updateTime();
        this.loadCookieData();
        this.startUpdateInterval();
        // hide unused Button
        this.pauseButton.style.display = "none";
    }

    startUpdateInterval() {
        this.updateIntervalId = setInterval(() => {
            this.updateTime();
        }, this.updateTimeInterval);
    }

    updateTime() {
        var now = new Date();

        // Get the hours, minutes, and seconds
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();

        // Display the time in the "clock" element
        document.getElementById("clock").textContent = this.formatTime(hours) + ":" + this.formatTime(minutes);

        if (hours === Number(this.alarmStd) && minutes === Number(this.alarmMin) && seconds === 0 && this.onOff === true) {
            this.playAudio();
            this.isPlaying = true;
        }
    }

    loadCookieData() {
        var savedaTime = this.getCookie("aTime");
        var savedRadioUrl = this.getCookie("savedurl");

        if (savedRadioUrl === "") {
            savedRadioUrl = "https://st03.sslstream.dlf.de/dlf/03/128/mp3/stream.mp3?aggregator=web";
        }
        if (savedaTime === "") {
            savedaTime = "8:50"
        }

        //TODO: manage settings via form and cookies

        this.alarmMin = Number(savedaTime.split(":")[1]);
        this.alarmStd = Number(savedaTime.split(":")[0]);
        this.radioUrl = savedRadioUrl;
        this.updateAlarmTime();
    }

    playAudio() {
        this.audio.src = this.radioUrl;
        // TODO: this.audio.play(); returns a promise. Can we use it to check if it's playing?
        this.audio.play();
        this.isPlaying = true;
        this.playButton.style.display = "none";
        this.pauseButton.style.display = "inline-block";
    }

    pauseAudio() {
        this.audio.pause();
        this.isPlaying = false;
        this.playButton.style.display = "inline-block";
        this.pauseButton.style.display = "none";
    }


    setCookie(name, value) {
        var date = new Date();
        // Set the expiration date to a date very far in the future
        date.setTime(date.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)); // 10 years in milliseconds
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + escape(value) + ";path=/";
    }

    getCookie(name) {
        var cookies = document.cookie.split("; ");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].split("=");
            if (cookie[0] === name) {
                return unescape(cookie[1]);
            }
        }
        return "";
    }

    updateAlarmTime() { // display the current time
        this.aMin.textContent = this.formatTime(this.alarmMin);
        this.aStd.textContent = this.alarmStd;
    }

    upAlarm() {
        this.alarmMin = this.alarmMin + 10;
        if (this.alarmMin > 59) {
            this.alarmMin = 0;
            this.alarmStd = this.alarmStd + 1;
            if (this.alarmStd > 23) {
                this.alarmStd = 0;
            }
        }
        this.pauseAudio();
        this.updateAlarmTime();
    }

    changeBrightness() {
        // Increase the opacity by 0.30
        this.opacity += 0.30;

        // Reset opacity to 0.15 if it exceeds 0.9
        if (this.opacity > 0.9) {
            this.opacity = 0.15;
        }

        // Set the opacity of the "fader" element
        document.getElementById("brightnessFader").style.opacity = this.opacity;
    }

    onOffFnc() {
        if (this.onOff === true) {
            this.onOff = false;
            this.aOnButton.style.setProperty("text-decoration", "none");
            this.pauseAudio();
        } else {
            this.onOff = true;
            this.aOnButton.style.setProperty("text-decoration", "line-through");
        }
    }

    closeSettings() {
        this.settingsDiv.style.display = "none";
    }

    // helpers:
    formatTime(timeValue) {
        // Add a leading zero if the time value is less than 10
        return timeValue < 10 ? "0" + timeValue : timeValue;
    }
}

// Create an instance of the AlarmClock class
const alarmClock = new AlarmClock();
document.getElementById("timeDisplay").addEventListener("click", function () {
    alarmClock.changeBrightness();
});
document.getElementById("alarmTime").addEventListener("click", function () {
    alarmClock.upAlarm();
});
document.getElementById("play").addEventListener("click", function () {
    alarmClock.playAudio();
});
document.getElementById("pause").addEventListener("click", function () {
    alarmClock.pauseAudio();
});

document.getElementById("alarmOnOff").addEventListener("click", function () {
    alarmClock.onOffFnc();
});

document.getElementById("close").addEventListener("click", function () {
    alarmClock.closeSettings();
});