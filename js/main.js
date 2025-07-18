console.log("main.js loaded");

const songs = [
    {name: "I Really Want to Stay at Your House by Rosa Walton, Hallie Coggins", file: ""},
    {name: "Sunflower - Spider-Man into the Spider-Verse by Post Malone, Swae Lee, Nicky Jam, Prince Royce, G.O.K.B", file: ""},
    {name: "Goodbye by toe", file: ""},
    {name: "Young Girl A by Siinamota", file: ""}
];

let currentIndex = 0;

const audio = new Audio();
audio.src = songs[currentIndex].file;
audio.volume = 0.5;
audio.loop = false;

document.getElementById("current-song").textContent = songs[currentIndex].name;
audio.play();