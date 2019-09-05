////////////////////////////////////////////////////////////////////////////////
// Authored by Septian Razi
// Code resused from ANU COMP1720 Major Assignment Submission 2017
////////////////////////////////////////////////////////////////////////////////

// arrays used to store the image splices
var image1Splice = [];
var image2Splice = [];
var image3Splice = [];
var image4Splice = [];
var image5Splice = [];
var image6Splice = [];
var image7Splice = [];
var image8Splice = [];
var image9Splice = [];
var image10Splice = [];
var imageSplicesList = []; // two dimentional array used to store all image splices array above

var currentImageSplice = []; // array used to store the current image splices
var imageList = []; // Array used to store all the images

var spliceAmount = 40; //WARNING INcreasing can severely decrease performance - increase this to increase glitch thinness
var thinness;
var flickerPeriod = 2500; // increase this to increase the gap between intermittent flickeress
var glitchStage = 1; // glitch stage indicates the level of glitchiness a user is in

var currentImageStep = 0; // index marker for what image the user is currently on
var lastImageStep = 2;
var flicker = false;
var turnOnOpacity = 255;
var framesInTurnOn = 0;
var glitchForever = false;
var heavyGlitch = false;
var glitchLength = 50; // boolean to determine how far the horizantel splices move to simulate glitching
var glitchAmount = []
var switchCount = 0;
var randomSwitchCounter = [];
var inDeGlitch = false; // boolean to determin if in deglitching transition
var xVal = 0; // value to determine glitch level (increased with user Input)
var inChangeImage = false; // boolean to determine if in change image transition
var glitchImageNow = 0;

var shutdownTransitionNow;
var shutdownY = 1;
var inShutdownTransition = false;
var shutdownX = 1;
var inTurnOnTransition = false;
var stareBlank = true;
inChangeImage
//sounds
var backGroundSound;
var glitch1;
var glitch2;

var lastPressed;

function preload() {

  if (windowWidth <= 1930) {
    var image1 = loadImage("assets/dark_logo_desktop.png");
    var image2 = loadImage("assets/white_logo_desktop.png")
    var image3 = loadImage("assets/3.AsianCooking_1920.jpg");
    var image4 = loadImage("assets/4.AussieBBQ_1920.jpg");
    var image5 = loadImage("assets/5.Litter_1920.jpg");
    var image6 = loadImage("assets/6.Recycling_1920.jpg");
    var image7 = loadImage("assets/7.Batik_1920.jpg");
    var image8 = loadImage("assets/8.Formal_1920.jpg");
    var image9 = loadImage("assets/9.Pray_1920.jpg");
    var image10 = loadImage("assets/10.Alcohol_1920.jpg");
  } else {
    var image1 = loadImage("assets/dark_logo_desktop.png");
    var image2 = loadImage("assets/white_logo_desktop.png")
    var image3 = loadImage("assets/3.AsianCooking.jpg");
    var image4 = loadImage("assets/4.AussieBBQ.jpg");
    var image5 = loadImage("assets/5.Litter.jpg");
    var image6 = loadImage("assets/6.Recycling.jpg");
    var image7 = loadImage("assets/7.Batik.jpg");
    var image8 = loadImage("assets/8.Formal.jpg");
    var image9 = loadImage("assets/9.Pray.jpg");
    var image10 = loadImage("assets/10.Alcohol.jpg");
  }

  backGroundSound = loadSound("assets/backgroundGlitch.wav");
  glitch1 = loadSound("assets/glitch1.wav");
  glitch2 = loadSound("assets/glitch2.wav");

  imageList = [image1,image2,image3,image4,image5,image6,image7,image8,image9,image10];
}


function setup() {

  createCanvas(windowWidth, windowHeight);
  background(0);


  thinness = height/spliceAmount;

  console.log("entering critical loop (most computers might stall here)")

  for ( i = 0; i < spliceAmount; i++) {
    image1Splice.push(imageList[0].get(0,0+thinness*i,width,thinness+thinness*i));
    image2Splice.push(imageList[1].get(0,0+thinness*i,width,thinness+thinness*i));
    image3Splice.push(imageList[2].get(0,0+thinness*i,width,thinness+thinness*i));
    image4Splice.push(imageList[3].get(0,0+thinness*i,width,thinness+thinness*i));
    image5Splice.push(imageList[4].get(0,0+thinness*i,width,thinness+thinness*i));
    image6Splice.push(imageList[5].get(0,0+thinness*i,width,thinness+thinness*i));
    image7Splice.push(imageList[6].get(0,0+thinness*i,width,thinness+thinness*i));
    image8Splice.push(imageList[7].get(0,0+thinness*i,width,thinness+thinness*i));
    image9Splice.push(imageList[8].get(0,0+thinness*i,width,thinness+thinness*i));
    image10Splice.push(imageList[9].get(0,0+thinness*i,width,thinness+thinness*i));

  }

    console.log ("finished loop, now pushing")

  imageSplicesList.push(image1Splice);
  imageSplicesList.push(image2Splice);
  imageSplicesList.push(image3Splice);
  imageSplicesList.push(image4Splice);
  imageSplicesList.push(image5Splice);
  imageSplicesList.push(image6Splice);
  imageSplicesList.push(image7Splice);
  imageSplicesList.push(image8Splice);
  imageSplicesList.push(image9Splice);
  imageSplicesList.push(image10Splice);

  currentImageSplice = imageSplicesList[currentImageStep].slice();//imageSplicesList[0];
  currentImage = imageList[currentImageStep];
  lastImageStep = imageList.length-1;

  for ( i = 0; i < currentImageSplice.length; i++){
    randomSwitchCounter[i] = i;
  }
  console.log("finsihed setup");
}

function draw() {

    // turn on transition scene
    if (inTurnOnTransition || frameCount < 500){
      backGroundSound.pause();
      glitch1.pause();
      glitch2.pause();
      currentImageStep = 0;
      currentImage = imageList[currentImageStep];
      currentImageSplice = imageSplicesList[currentImageStep].slice();
      image(imageList[currentImageStep],0,0)
      fill(0,turnOnOpacity);
      rect(0,0,width,height);
      turnOnOpacity-=2;
      framesInTurnOn++;;
      if (framesInTurnOn >= 1500){
        inTurnOnTransition = false;
        framesInTurnOn = 0;
        shutdownY = 1;
        shutdownX = 1;
        returnInitial();
      }

      if (stareBlank){
        turnOnOpacity += 2;
        if (framesInTurnOn >= 1000){
          stareBlank = false;
        }
      }

      // normal transition scene with images
    } else if (!inShutdownTransition){
      if (millis() % flickerPeriod >100 && millis() % flickerPeriod <randomGaussian(400,200)){
        flicker = true;
        if (!glitch2.isPlaying() && !backGroundSound.isPlaying()){
          glitch2.play();
        }
      } else{
        flicker = false;
        glitch2.pause();
      }

      image(currentImage,0,0);
      if (glitchImageNow + 5 > frameCount || glitchForever || frameCount % 2 == 1 && flicker ){
        glitch();
      }

      // keep on decreasing xVal so users must continue pressing keys to progress
      if (xVal > 1){
        xVal--;
      }

      if (!inChangeImage && !inDeGlitch){
        checkGlitchStage();
      }

      if (lastPressed + 100 < millis()){
        glitch1.pause();
      }


    // fill(255);
    // text(frameRate(),49,height-40)
}

// function called when we need to return all variables to its initial state
function returnInitial(){
   glitchForever = false;
   heavyGlitch = false;inChangeImage
   glitchLength = 50;
   glitchAmount = []
   switchCount = 0;
   flickerPeriod = 2500;
   inChangeImage = false;
   inDeGlitch = false;
   xVal = 0;

   for ( i = 0; i < currentImageSplice.length; i++){
     randomSwitchCounter[i] = i;
   }
}

// function to check glitch stage and progress to a heavier glitch stage
function checkGlitchStage(){
  if (xVal < 50){
    glitchStage = 1;
    backGroundSound.pause()
  } else if (xVal < 500){
    glitchStage = 2;
    backGroundSound.pause()
  } else if (xVal < 1000){
    glitchStage = 3;
  } else if (xVal < 1500){
    glitchStage = 4;
  } else if (xVal < 2000){
    glitchStage = 5;
  } else if (xVal >= 2500 && !inChangeImage &&!inDeGlitch){
}

// fucntion called when an image needs to glitch
function glitch(){
  var x = 0;
  var k;

// for every splice in the image, introduce some variation in it's x position to
// simulate glitchiness
  for (var i = 0; i < image1Splice.length; i++) {
    k = random([0,1,2,3,4]);

    if (glitchStage == 1) {
      if (!glitchForever){
        backGroundSound.pause()
      }
      glitchAmount = [k]
      glitchLength = 50;
      heavyGlitch = false;
      flickerPeriod = 2500;

    } else if (glitchStage == 2){
      if (!glitchForever){
        backGroundSound.pause()
      }
      glitchAmount = [(k-1)% 5,k]
      glitchLength = 70;1000
      heavyGlitch = false;
      flickerPeriod = 2000;

    } else if (glitchStage == 3){
      if (!glitchForever){
        backGroundSound.pause()
      }
      glitchAmount = [(k-1)% 5,k,(k+1)% 5];
      glitchLength = 90;
      flickerPeriod = 1500;
      heavyGlitch = false;

    } else if (glitchStage == 4) {
      glitchAmount = [(k-1)% 5,(k-2)% 5,(k+1)% 5,k,]
      glitchLength = 110;
      flickerPeriod = 1000;
      if (!backGroundSound.isPlaying()){
        backGroundSound.play()
      }
      heavyGlitch = false;

    } else {
      heavyGlitch = true;
      flickerPeriod = 500;
      glitchLength = 130;
      glitchForever = true;
      if (!backGroundSound.isPlaying()){
        backGroundSound.play()
      }
    }

    if (contains(i%5,glitchAmount) || heavyGlitch){
      x = randomGaussian(0,glitchLength);
      image(currentImageSplice[i],x,0+thinness*i);
    }
  }
}

// function to determine if an element is within an array, used in glitch()
function contains (k, array){
  for (var i = 0; i < array.length; i++) {
    if (array[i] == k){
      return true;
    }
  }
  return false;
}

// function called when a key is pressed
function keyTyped() {
  if (!inDeGlitch && !inChangeImage && !inShutdownTransition && !inTurnOnTransition) {
    xVal += 7;
    glitchImageNow = frameCount;
    if (key === '+' || key === '-'){
      xVal += 200;
      glitch();
    }
    if (!glitch1.isPlaying()){
      glitch1.play();
      lastPressed = millis();
    } else {
      if (random(5) <= 1){
        glitch1.stop();
      } else {
        glitch2.pause();
      }
    }
  }
}

////////////////////////////////////////////////////////////////////////////////
// Septian Razi
// u6086829
// IDENTITY
// COMP1720 Major Assignment 2017
////////////////////////////////////////////////////////////////////////////////
