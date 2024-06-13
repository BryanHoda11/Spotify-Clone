console.log("JavaScript...Here we go!")

let currentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    if (!pause) {
        currentSong.play()
        play.src = "logos/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20", " ")
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    // List of songs
    songs = await getSongs()
    playMusic(songs[0], true)

    document.querySelector("#play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "logos/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "logos/play.svg"
        }
    })

    // listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / 
   ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // Attach an event listner to previous
    document.querySelector("#previous").addEventListener("click", () => {
        console.log("previous clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Attach an event listner to next
    document.querySelector("#next").addEventListener("click", () => {
        console.log("next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice("-1")[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration) * percent / 100
    })

    // Add an event listner to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add event listner to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    })

    // Add event listener to volume
    document.querySelector(".range").addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100;
    })

}
main()
