// Initializing the game board container.
const tilesContainer = document.getElementById("tilesContainer");
const tiles = document.getElementById("tiles");

// Initializing the game state and variables
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;
let gameTimer;
let secondsElapsed = 0;
let droppush;
let dropdown = document.getElementById("pairCount");
let dropdownNumber = droppush;
let numberOfImages = dropdownNumber;
let pushimages = pickSettetNumberOfPictures(dropdownNumber);
let gameStarted = false;

const allImages = [
  "Beach.jpg",
  "BlackDessert.jpg",
  "Dessert.jpg",
  "ElCapitan.jpg",
  "GrandCanyon.jpg",
  "HollyWood.jpg",
  "Hurghada.jpg",
  "Kolloseum.jpg",
  "LasVegasParis.jpg",
  "LasVegasSign.jpg",
  "LasVegasVenice.jpg",
  "MachuPicho.jpg",
  "Marrokko.jpg",
  "NewYork.jpg",
  "Paris.jpg",
  "RedWood.jpg",
  "RouteNO1.jpg",
  "SanFrancisco.jpg",
  "Santorini.jpg",
  "Venedig.jpg",
  "WhiteDessert.jpg",
  "Vienna.jpg",
  "SunDownWD.jpg",
  "Pyramiden.jpg",
  "Sphinx.jpg",
  "LasVegasNewYork.jpg",
  "Alkatraz.jpg",
  "SanDiego.jpg",
  "SanFran.jpg",
  "Seattle.jpg",
  "Brüssel.jpg",
  "Dubai.jpg",
  "Stonehenge.jpg",
  "VancIsland.jpg",
  "Freiheitsstatue.jpg",
  "Kairo.jpg",
];
//Copy of AllImages to pick from that
let tempImages = [...allImages];

//EVENTLISTENER///////

document.addEventListener("DOMContentLoaded", () => {
  let droppush = document.getElementById("value");
  dropdown.addEventListener("change", function (event) {
    droppush = event.target.value;
    // console.log(droppush); // Logs selected value to console
    dropdownNumber = droppush;
    numberOfImages = dropdownNumber;
    pushimages = pickSettetNumberOfPictures(dropdownNumber);
    setGame();
  });
});

// Adding an event listener to the reset button.
// document.getElementById('resetButton').addEventListener('click', setGame)

// Adding an event listener to the reset button.
document.getElementById("resetButton").addEventListener("click", function () {
  hideWinScreen();
  setGame();
  resetTimer();
  startTimer();
  clearFoundCardsContainer();
  revealCards();
});

//backgroundmusic
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");

const audio = new Audio("backmusic.mp3");
audio.volume = 1;
let isPlaying = false;

//mute or play Button for backgroundmusic
playButton.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  } else {
    audio.play();
    isPlaying = true;
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  }
});

//looped backgroundmusic
audio.addEventListener("ended", () => {
  isPlaying = false;
  // playIcon.style.display = 'block';
  // pauseIcon.style.display = 'none';
  audio.play();
});

//FUNCTIONS//////////////////////

function pickSettetNumberOfPictures(numberOfImages) {
  let selectedImages = [];
  for (let i = 0; i < numberOfImages; i++) {
    const randomIndex = Math.floor(Math.random() * tempImages.length);
    const randomImage = tempImages[randomIndex]; //takes randomImage from copy of AllImages
    selectedImages.push(randomImage);
    tempImages.splice(randomIndex, 1); // Dies verhindert die Wiederholung des gleichen Bildes.
  }
  return selectedImages;
}

//set game without site reload
function setGame() {
  // set Gamestatus to NULL
  hideWinScreen();
  gameStarted = true;
  revealedCount = 0;
  document.getElementById("scoreboard").innerHTML = revealedCount;
  activeTile = null;
  awaitingEndOfMove = false;
  tempImages = [...allImages];

  // removes gamingcards from grid
  while (tiles.firstChild) {
    tiles.removeChild(tiles.firstChild);
  }

  // Defining a list of image names for the memory game.
  function getData() {
    return pushimages; //string
  }
  const images = getData();
  const imagesPicklist = [...images, ...images]; // Duplicating the list of images to create pairs.

  const tileCount = imagesPicklist.length; // Total number of tiles, based on the number of images.

  // Creating the game board by creating cards/tiles
  for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * imagesPicklist.length); // Selecting a name randomly from the array.
    const image = imagesPicklist[randomIndex]; // Assigning the picked image to the `image` variable.
    const tile = buildTile(image);

    imagesPicklist.splice(randomIndex, 1); // Removing the used image from the picklist.
    tiles.appendChild(tile); // Adding the tile to the game board.
  }

  function checkMatch(tile1, tile2) {
    // Get the image attribute of each tile
    const image1 = tile1.getAttribute("data-image");
    const image2 = tile2.getAttribute("data-image");

    // Check if the images of the two tiles match
    if (image1 === image2) {
      // Add the "matchedboarder" class to indicate a match
      tile1.classList.add("matchedboarder");
      tile2.classList.add("matchedboarder");

      // Play a sound effect for a successful match
      var flipSound = new Audio("MatchSound.mp3");
      flipSound.volume = 0.5;
      flipSound.play();

      // Set a timeout to remove the "matched" and "flipIn" classes, hide the tiles, update the game state
      // and add the matched image to the found container
      setTimeout(() => {
        tile1.classList.remove("matched");
        tile2.classList.remove("matched");
        tile1.classList.add("foundhide");
        tile2.classList.add("foundhide");
        tile1.classList.remove("flipIn");
        tile2.classList.remove("flipIn");
        activeTile = null;
        awaitingEndOfMove = false;
        revealedCount += 2;
        addCardToFoundContainer(image2);

        // Check if all tiles have been matched and display a victory message
        if (revealedCount === tileCount) {
          // Play a sound effect for winning the game
          var victorySound = new Audio("VictorySound.mp3");
          victorySound.volume = 0.5;
          victorySound.play();
          // alert("You win! Refresh to start again.");
          showWinScreen();
        }

        // Update the scoreboard with the current number of matched pairs
        document.getElementById("scoreboard").innerHTML = revealedCount / 2;
      }, 2500);

      return true; // Return true to indicate a successful match
    }

    return false; // Return false if the images don't match
  }

  function handleClick(element) {
    if (!gameStarted) return;
    const revealed = element.getAttribute("data-revealed");

    if (awaitingEndOfMove || revealed === "true" || element === activeTile) {
      return;
    }

    element.classList.remove("covered");
    element.setAttribute("data-revealed", "true");
    element.classList.add("flipIn"); // Füge die Flip-Animation hinzu

    // Audio zum Abspielen des Flip-Sounds erstellen
    var flipSound = new Audio("flipSound.mp3");
    flipSound.volume;
    flipSound.play();

    if (!activeTile) {
      activeTile = element;
      return;
    }

    if (checkMatch(element, activeTile)) {
      return;
    }

    awaitingEndOfMove = true;

    let tile1 = element;
    let tile2 = activeTile;

    setTimeout(() => {
      tile1.classList.add("covered");
      tile1.setAttribute("data-revealed", "false");
      tile1.classList.remove("flipIn"); // Entferne die Flip-Animation
      tile1.classList.add("flipOut"); // Füge die Flip-Animation hinzu
      setTimeout(() => {
        tile1.classList.remove("flipOut"); // Entferne die Flip-Animation
      }, 200);

      tile2.classList.add("covered");
      tile2.setAttribute("data-revealed", "false");
      tile2.classList.remove("flipIn"); // Entferne die Flip-Animation
      tile2.classList.add("flipOut"); // Füge die Flip-Animation hinzu
      setTimeout(() => {
        tile2.classList.remove("flipOut"); // Entferne die Flip-Animation
      }, 200);

      awaitingEndOfMove = false;
      activeTile = null;
    }, 1500);
  }

  function buildTile(image) {
    // Create a new <div> element for the tile
    const element = document.createElement("div");
    // Add classes to the element
    element.classList.add("tile", "covered");
    element.setAttribute("data-image", image);
    element.setAttribute("data-revealed", "false");
    element.style.backgroundImage = `url(${image})`;
    element.addEventListener("click", () => handleClick(element));
    return element;
  }
}

// Function to start the reveal animation for all cards.
function revealCards() {
  const tiles = document.querySelectorAll(".tile");

  // Soundeffekt für das Austeilen der Karten
  let audio = new Audio("FlipSound.mp3");

  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.style.opacity = 1;

      // Abspielen des Soundeffekts
      audio
        .play()
        .then(() => {
          // Audio geladen und abgespielt
        })
        .catch((error) => {
          // Fehler beim Laden oder Abspielen des Audios
          console.error(error);
        });
    }, index * 100);
  });
}

// Timer function to display the elapsed time.
function startTimer() {
  gameTimer = setInterval(() => {
    secondsElapsed++;
    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    document.getElementById("timer").innerHTML = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

//Reset the timer to zero.
function resetTimer() {
  clearInterval(gameTimer);
  secondsElapsed = 0;
  document.getElementById("timer").innerHTML = "00:00";
}

//Move cards to a separate deck after a match.
function addCardToFoundContainer(image) {
  const foundCardsContainer = document.getElementById("foundCardsContainer");

  const element = document.createElement("div");
  element.classList.add("tile");
  element.style.backgroundImage = `url(${image})`;
  element.style.opacity = 1;

  // Verwende prepend, um das Element am Anfang des foundCardsContainer einzufügen
  foundCardsContainer.prepend(element);
}

//Move cards back out when restarting the game.
function clearFoundCardsContainer() {
  const foundCardsContainer = document.getElementById("foundCardsContainer");

  // Entferne alle Kinder von foundCardsContainer
  while (foundCardsContainer.firstChild) {
    foundCardsContainer.removeChild(foundCardsContainer.firstChild);
  }
}

// Access the win screen and the play again button
const winScreen = document.getElementById("winScreen");
const playAgainButton = document.getElementById("playAgainButton");

// Show win screen with the appropriate message
function showWinScreen() {
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const winMessage = `You found all ${
    revealedCount / 2
  } pairs in ${minutes} minutes and ${seconds} seconds.`;

  document.getElementById("winMessage").innerText = winMessage;
  winScreen.classList.remove("win-screen-hidden");
}

// Hide win screen
function hideWinScreen() {
  winScreen.classList.add("win-screen-hidden");
}
