// console.log("Starting")
let currentSongs = new Audio();
let songs;
let currFolder;


function secToMin(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00/00"
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // Format minutes and seconds to be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    // console.log(folder)
    currFolder = folder
    // let a = await fetch("http://127.0.0.1:5500/Spotify Clone/songs/");
    let a = await fetch(`/${folder}/`);
    let response = await a.text();  // Call .text() as a function
    console.log(response);
    let div = document.createElement("div"); // Create
    div.innerHTML = response; // Insert response into div
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href.split("/songs/")[1]);
            songs.push(element.href.split(`/${folder}/`)[1]);
            // songs.push(element.href);
        }
    }
    //add songs to the list (in playlist section)
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""; // Clear the list before adding new songs
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
            <li>
                              <img class="invert" src="img/music.svg" alt="">
                              <div class="info">
                                  
                                  <div>${song.replaceAll("%20", " ")} </div>
                                  <div>Kanha</div>
                              </div>
                              <div class="playnow">
                                  <span>Play Now</span>
                                  <img class="invert" src="img/play.svg" alt="">
                              </div>
          </li>`;
    }
    //Attach evennt listeners to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

            //this part is work for adding song name with spliting (under the playbar section)
            document.querySelector(".songinfo").innerHTML = e.querySelector(".info").firstElementChild.innerHTML.split('-')[0];
        })

    })
    // return songs;
}

//Playmusic Function
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/Spotify Clone/songs/" + track)
    // audio.play();
    // currentSongs.src = "/Spotify Clone/songs/" + track
    currentSongs.src = `/${currFolder}/` + track
    // currentSongs.play();
    if (!pause) {
        currentSongs.play();
        playbutton.src = "Img/pause.svg"
    }
    // playbutton.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAllAlbums() {
    let a = await fetch("/songs/");
    let response = await a.text();  // Call .text() as a function
    let div = document.createElement("div"); // Create
    div.innerHTML = response; // Insert response into div
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = (e.href.split("/").slice(-1)[0])
            let folders = (e.href.split("/").slice(-1)[0])
            
            //get the meta data of the floder 
            let a = await fetch(`/songs/${folders}/info.json`);
            //    let a = await fetch(`/songs/${currFolder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folders}" class="card">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50"
                                viewBox="0 0 512 512">
                                <path fill="#32BEA6"
                                    d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z">
                                </path>
                                <path fill="#FFF"
                                    d="M378.7,243.2L203.8,135.7c-4.8-2.9-11.1-3.1-16-0.3c-5,2.8-8.1,8.1-8.1,13.8v214c0,5.7,3.1,11,8,13.8c2.4,1.3,5,2,7.7,2c2.9,0,5.7-0.8,8.2-2.3l174.9-106.6c4.7-2.8,7.6-8,7.6-13.4C386.3,251.2,383.4,246,378.7,243.2z">
                                </path>
                            </svg>
                        </div>
                        <img src="/songs/${folders}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`

        }
    }

    //Load the playlists when ever the card is clicked
    //If a variable get collection of data then you can used Arraay.from
    //currentTarget --> if you are try to return that , those how are you clicked function used means (if you used click event listener on a card then it will return a card all properties)
    //Target --> it return the that perticular perpoties to which you are clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            // playMusic(songs[0])
        })
    })
}

async function main() {
    //get the list of all songs
    await getSongs("songs/ncs");

    //play the first song
    playMusic(songs[0], true)

    //Display All the albums on the page 
    displayAllAlbums()

    /*
    //play the first song
    // var audio = new Audio(songs[0]);
    // audio.play();
    */

    // when you click play button to play 1st music
    // document.getElementById('playbutton').addEventListener('click', function () {
    //     // Play the first song
    //     var audio = new Audio(songs[0]);
    //     audio.play()
    //     audio.addEventListener("loadeddata", () => {
    //         // console.log(audio.duration, audio.currentSrc,audio.currentTime,audio.current)
    //         let duration = audio.duration;
    //         console.log(duration);
    //         // The duration variable now holds the duration (in seconds) of the audio clip
    //     });
    // });



    //Attach evennt listeners to play ,next and previous
    playbutton.addEventListener("click", () => {
        if (currentSongs.paused) {
            currentSongs.play();
            playbutton.src = "img/pause.svg"
        }
        else {
            currentSongs.pause();
            playbutton.src = "img/play.svg"
        }
    })

    //Listen for time update event
    currentSongs.addEventListener("timeupdate", () => {
        // console.log(currentSongs.currentTime,currentSongs.duration )
        document.querySelector(".songtime").innerHTML = `${secToMin(currentSongs.currentTime)}/${secToMin(currentSongs.duration)}`
        //update the circle progress bar
        document.querySelector(".circle").style.left = (currentSongs.currentTime / currentSongs.duration) * 100 + "%"
    })

    //Add a event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e.target.getBoundingClientRect().width,e.offsetX)
        let percente = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percente + "%"
        currentSongs.currentTime = (percente / 100) * currentSongs.duration
    })

    //Add A event listener for humburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //Add a event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%"
    })

    //Add an event listener to previous and next song
    previous.addEventListener("click", () => {

        // let index = songs.indexOf(currentSongs.src.slice(-1)[0])
        // console.log(index)
        // let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        // currentSongs.src.split("/").slice(-1)[0]
        // console.log(index)
        // if ((index - 1) >= 0) {
        //     playMusic(songs[index - 1])

        currentSongs.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        console.log(index)
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
            //Adding Split song name in "Songinfo" section
            // let splitSong = currentSongs.src.split("/").slice(-1)[0];
            // console.log(splitSong);
            let mainSplitSong = splitSong.split('-')[0];
            // console.log(mainSplitSong);
            document.querySelector(".songinfo").innerHTML = mainSplitSong;
        }
    })
    next.addEventListener("click", () => {
        // console.log("Next song")
        // let index = songs.indexOf(currentSongs.src.slice(-1)[0])
        // console.log(index);
        let index = songs.indexOf(currentSongs.src.split("/").slice(-1)[0])
        currentSongs.src.split("/").slice(-1)[0]
        // console.log(index);
        if ((index + 1) <= songs.length - 1) {
            playMusic(songs[index + 1])

            //Adding Split song name in "Songinfo" section
            let splitSong = currentSongs.src.split("/").slice(-1)[0];
            // console.log(splitSong);
            let mainSplitSong = splitSong.split('-')[0];
            // console.log(mainSplitSong);
            document.querySelector(".songinfo").innerHTML = mainSplitSong;
        }

    })

    //Add a event to volume slider
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("Setting volume " + e.target.value + "/100");
        currentSongs.volume = parseInt(e.target.value) / 100
    })

    //Add event listeners to mute the volume 
    document.querySelector(".volume>img").addEventListener("click",e=>{
        // console.log(e.target)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentSongs.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value =0
        } else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentSongs.volume= .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })



}

main();

