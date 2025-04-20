function preload() {
	//Gifs
	idleL = loadImage("character/idleL.gif");
	idleR = loadImage("character/idleR.gif");
	walkingL = loadImage("character/walkingL.gif");
	walkingR = loadImage("character/walkingR.gif");
	goalEmpty = loadImage("object/goal empty.gif");
	goalFull = loadImage("object/goal full.gif");
	shinyCoin = loadImage("object/coin.gif");
	
	//Pngs
	upwardsL = loadImage("character/upwardsL.png");
	upwardsR = loadImage("character/upwards.png");
	downwardsL = loadImage("character/downwardsL.png");
	downwardsR = loadImage("character/downwards.png");
	plateauL = loadImage("character/plateauL.png");
	plateauR = loadImage("character/plateau.png");
	hatL = loadImage("character/hatL.png");
	hatR = loadImage("character/hat.png");
	
	//Music
	babaYou = loadSound("music/babaisyou.mp3");
	wallStop = loadSound("music/wallisstop.mp3");
	waterSink = loadSound("music/waterissink.mp3");
	boxKey = loadSound("music/boxhaskey.mp3");
	fruitGrass = loadSound("music/fruitongrass.mp3");
	lavaHot = loadSound("music/lavaishot.mp3");
	
	//Sound effects (pardon the names, I identify them on how they're used in the original game, it's easier for me that way)
	death = loadSound("sfx/death.ogg");
	flag = loadSound("sfx/flag.ogg");
	move = loadSound("sfx/move.ogg");
	sink = loadSound("sfx/sink.ogg");
	teleport = loadSound("sfx/teleport.ogg");
	unlock = loadSound("sfx/unlock.ogg");
  }
  
  function setup() {
	frameRate(60);
	createCanvas(800, 600);
	
	imageMode(CENTER);
	rectMode(CENTER);
	
	//"Global" variables (not to be confused with global scope variables)
	bgColour = color(255); //Background colour
	platColour = color(127); //Terrain colour
	level = 0;
	levelWon = [0, 0, 0, 0, 0]; //Stores which levels have been completed
	debugging = false; //Opens debug menu
	paused = false; //Opens pause menu
	pauseType = "Paused"; //Determines what pause menu is used
	timer = 0; //Speedrunning time
	reset = true; //Helps with resetting breakable platforms
	cycle = 0; //Helps with moving platforms
	
	//Settings variables
	musicVol = 10; //Controls music volume
	sfxVol = 10; //Controls sound effect volume
	pointerOpac = 50; //Controls pointer opacity
	
	//Robin variables
	robin = [400, 300]; //Storing coordinates in an array is prowdbably easier for me
	probin = [400, 300]; //Storing the coordinates of the previous frame for collision detection purposes
	robinSize = 250; //Controls Robin's size, so they can be big in menus and small in levels
	
	//Goal variables
	goal = [0, 0];
	coin = [0, 0]; //An object that appears in some levels, requiring to be collected before reaching the goal
	coined = false; //Checks if the coin is already collected
	
	//Speed variables
	speedX = 0;
	speedY = 0;
	timeModif = 1.0;
	slowdown = false; //Directly attached to timeModif
	
	//Jump and dash (and technically pointer) variables
	jump = true;
	airtime = 0;
	angle = 0;
	dash = true;
	dashing = false; //Controls whether Robin's in the middle of a dash or not
	dashDistX = 0; //X distance to travel in a dash
	dashDistY = 0; //Y distance to travel in a dash
	dt = 0.0; //"Distance travelled" overall
	pdt = 0.0; //Storing the previous dt value
	increment = 0.01;
	
	//I heard you like buttons
	levelSelectButton = createButton("Level Select");
	levelSelectButton.class("menu");
	levelSelectButton.position(510, 190);
	levelSelectButton.size(180, 100);
	levelSelectButton.mouseReleased(levelSetMinus1);
	
	settingsButton = createButton("Settings");
	settingsButton.class("menu");
	settingsButton.position(510, 310);
	settingsButton.size(180, 100);
	settingsButton.mouseReleased(levelSetMinus2);
	
	dataButton = createButton("Reset data");
	dataButton.class("menu");
	dataButton.position(640, 540);
	dataButton.size(150, 50);
	dataButton.mouseReleased(dataReset);
	
	backButton = createButton("Back");
	backButton.class("menu");
	backButton.position(525, 450);
	backButton.size(150, 50);
	backButton.mouseReleased(levelSet0);
	
	level1Button = createButton("1");
	level1Button.id("level1");
	level1Button.class("level");
	level1Button.position(490, 190);
	level1Button.mouseReleased(levelSet1);
	
	level2Button = createButton("2");
	level2Button.id("level2");
	level2Button.class("level");
	level2Button.position(610, 190);
	level2Button.mouseReleased(levelSet2);
	
	level3Button = createButton("3");
	level3Button.id("level3");
	level3Button.class("level");
	level3Button.position(430, 310);
	level3Button.mouseReleased(levelSet3);
	
	level4Button = createButton("4");
	level4Button.id("level4");
	level4Button.class("level");
	level4Button.position(550, 310);
	level4Button.mouseReleased(levelSet4);
	
	level5Button = createButton("5");
	level5Button.id("level5");
	level5Button.class("level");
	level5Button.position(670, 310);
	level5Button.mouseReleased(levelSet5);
	
	continueButton = createButton("Continue");
	continueButton.class("pause");
	continueButton.position(300, 200);
	continueButton.mouseReleased(unpause);
	
	nextButton = createButton("Next");
	nextButton.class("pause");
	nextButton.position(300, 200);
	nextButton.mouseReleased(levelNext);
	
	retryButton = createButton("Retry");
	retryButton.class("pause");
	retryButton.position(300, 300);
	retryButton.mouseReleased(levelRetry);
	
	menuButton = createButton("Level Select");
	menuButton.class("pause");
	menuButton.position(300, 400);
	menuButton.mouseReleased(levelSetMinus1);
	
	//And sliders, too!
	musicSlider = createSlider(0, 10, 10);
	musicSlider.class("settings");
	musicSlider.position(500, 220);
	musicSlider.size(200);
	
	sfxSlider = createSlider(0, 10, 10);
	sfxSlider.class("settings");
	sfxSlider.position(500, 270);
	sfxSlider.size(200);
	
	opacSlider = createSlider(0, 100, 50, 10);
	opacSlider.class("settings");
	opacSlider.position(500, 370);
	opacSlider.size(200);
	
	//And now music stuff
	babaYou.playMode("untilDone");
	wallStop.playMode("untilDone");
	waterSink.playMode("untilDone");
	boxKey.playMode("untilDone");
	fruitGrass.playMode("untilDone");
	lavaHot.playMode("untilDone");
	babaYou.setVolume(musicVol/40);
	wallStop.setVolume(musicVol/40);
	waterSink.setVolume(musicVol/40);
	boxKey.setVolume(musicVol/40);
	fruitGrass.setVolume(musicVol/40);
	lavaHot.setVolume(musicVol/25);
	death.setVolume(sfxVol/10);
	flag.setVolume(sfxVol/10);
	move.setVolume(sfxVol/4);
	sink.setVolume(sfxVol/10);
	teleport.setVolume(sfxVol/10);
	unlock.setVolume(sfxVol/10);
	
	//Terrain stuff
	middlePlatform = new Terrain(225, 400, 300, 20);
	
	plat11 = new Terrain(15, 130, 30, 260); //Border
	plat12 = new Terrain(400, 15, 800, 30);
	plat13 = new Terrain(785, 300, 30, 600);
	plat14 = new Terrain(680, 530, 240, 140); //Bottom ground
	plat15 = new Terrain(120, 530, 240, 140);
	plat16 = new Terrain(300, 250, 600, 40); //Middle platform
	plat17 = new Terrain(100, 220, 200, 20);
	plat18 = new Terrain(400, 350, 100, 200); //B A R
	spike11 = new Terrain(400, 222, 400, 16); //First death probably
	
	plat21 = new Terrain(120, 160, 120, 320); //left
	plat22 = new Terrain(110, 520, 100, 160);
	plat23 = new Terrain(680, 160, 120, 320); //Right
	plat24 = new Terrain(690, 520, 100, 160);
	plat25 = new Terrain(400, 40, 200, 80); //Center top
	plat26 = new Terrain(340, 50, 80, 100);
	plat27 = new Terrain(400, 335, 200, 110); //Center middle
	plat28 = new Terrain(340, 310, 80, 100);
	plat29 = new Terrain(315, 450, 30, 300); //Center bottom
	plat20 = new Terrain(485, 400, 30, 100);
	plat2a = new Terrain(370, 580, 140, 60);
	spike21 = new Terrain(440, 88, 120, 16);
	spike22 = new Terrain(440, 272, 120, 16);
	
	plat31 = new Terrain(100, 225, 200, 450); //Left
	plat32 = new Terrain(100, 585, 200, 30);
	plat33 = new Terrain(500, 135, 400, 30); //Top
	plat34 = new Terrain(315, 285, 30, 300); //Bar
	plat35 = new Terrain(350, 285, 100, 30); //Middle top
	plat36 = new Terrain(750, 285, 100, 30);
	plat37 = new Terrain(350, 435, 100, 30); //Middle
	plat38 = new Terrain(750, 435, 100, 30);
	plat39 = new Terrain(350, 585, 100, 30); //Bottom
	plat30 = new Terrain(750, 585, 100, 30);
	break31 = new Terrain(250, 580, 100, 20, true); //Hole
	break32 = new Terrain(250, 435, 100, 20, true);
	break33 = new Terrain(445, 435, 90, 20, true); //Middle top
	break34 = new Terrain(655, 285, 90, 20, true); //Middle
	spike31 = new Terrain(550, 285, 120, 30); //Middle top
	spike32 = new Terrain(550, 435, 120, 30); //Middle
	spike33 = new Terrain(550, 585, 120, 30); //Bottom
	
	plat41 = new Terrain(15, 300, 30, 600); //Border
	plat42 = new Terrain(400, 15, 800, 30);
	plat43 = new Terrain(785, 300, 30, 600);
	plat44 = new Terrain(115, 575, 230, 50); //Ground
	plat45 = new Terrain(685, 575, 230, 50);
	plat46 = new Terrain(205, 405, 50, 390); //Columns
	plat47 = new Terrain(400, 200, 50, 400);
	plat48 = new Terrain(595, 405, 50, 390);
	move41 = new Terrain(200, 250, 120, 30, 100, 250);
	move42 = new Terrain(200, 350, 120, 30, 300, 350);
	move43 = new Terrain(600, 250, 120, 30, 500, 250);
	move44 = new Terrain(600, 350, 120, 30, 700, 350);
	move45 = new Terrain(400, 575, 120, 30, 100, 575);
	spike41 = new Terrain(205, 208, 50, 16); //Caps
	spike42 = new Terrain(595, 208, 50, 16);
	
	plat51 = new Terrain(15, 300, 30, 600); //Border
	plat52 = new Terrain(400, 15, 800, 30);
	plat53 = new Terrain(785, 300, 30, 600);
	plat54 = new Terrain(400, 300, 80, 80); //Square
	plat55 = new Terrain(300, 160, 100, 20);
	plat56 = new Terrain(260, 300, 20, 300);
	plat57 = new Terrain(300, 440, 100, 20);
	plat58 = new Terrain(500, 160, 100, 20);
	plat59 = new Terrain(540, 300, 20, 300);
	plat50 = new Terrain(500, 440, 100, 20);
	plat5a = new Terrain(140, 585, 240, 30); //Ground
	plat5b = new Terrain(400, 570, 300, 60);
	plat5c = new Terrain(660, 585, 240, 30);
	move51 = new Terrain(140, 365, 220, 30, 140, 565); //Left
	spike51 = new Terrain(140, 562, 220, 16); //Ground
	spike52 = new Terrain(660, 562, 220, 16);
	spike53 = new Terrain(310, 170, 80, 10); //Square
	spike54 = new Terrain(275, 300, 10, 260);
	spike55 = new Terrain(310, 430, 80, 10);
	spike56 = new Terrain(490, 170, 80, 10);
	spike57 = new Terrain(525, 300, 10, 260);
	spike58 = new Terrain(490, 430, 80, 10);
	spike59 = new Terrain(65, 430, 70, 20); //Left column
	spike50 = new Terrain(215, 430, 70, 20);
	spike5a = new Terrain(100, 300, 140, 20);
	spike5b = new Terrain(180, 170, 140, 20);
	spike5c = new Terrain(585, 430, 70, 10); //Right column
	spike5d = new Terrain(735, 300, 70, 10);
	spike5e = new Terrain(585, 170, 70, 10);
	break51 = new Terrain(660, 430, 80, 20, true);
	break52 = new Terrain(660, 300, 80, 20, true);
	break53 = new Terrain(660, 170, 80, 20, true);
  }
  
  //A catch-all class for anything and everything touchable by Robin
  class Terrain {
	constructor(x, y, w, h, a, b) { //Sets terrain parameters
	  this.x = x;
	  this.y = y;
	  this.w = w;
	  this.h = h;
	  this.a = a; //Additional flex parameter
	  this.b = b; //Same thing here
	}
	platform() { //Basic
	  rect(this.x, this.y, this.w, this.h, 4) //Draws the platform
	  if (abs(this.x - robin[0]) < this.w/2 + 25 && abs(this.y - robin[1]) < this.h/2 + 25) { //Checks for any collision at all
		if (dashing && pdt > 0.05) {//Conditional prevents dash from immediately ending
		  jump = true;
		  dashing = false;
		}
		if (abs(this.y - robin[1]) < this.h/2 + 25 && abs(this.x - probin[0]) < this.w/2 + 25) { //Top-bottom collision
		  speedY = 0;
		  if (this.y < robin[1]) { //Pushes down
			robin[1] = this.y + this.h/2 + 25;
		  } else if (this.y > robin[1]) { //Pushes up
			robin[1] = this.y - this.h/2 - 25;
			jump = true;
			airtime = 0;
			if (!dashing) {
			  dash = true;
			}
		  }
		} else if (abs(this.x - robin[0]) < this.w/2 + 25 && abs(this.y - probin[1]) < this.h/2 + 25) { //Side detection
		  speedX *= -1; //Add a little bounce off the wall
		  if (this.x < robin[0]) { //Pushes right
			robin[0] = this.x + this.w/2 + 25;
		  } else if (this.x > robin[0]) { //Pushes left
			robin[0] = this.x - this.w/2 - 25;
		  }
		}
	  }
	}
	moving() { //Gotta have something that fills the moving requirement
	  rect(this.x-(this.a-this.x)*cos(cycle), this.y+(this.b-this.y)*cos(cycle), this.w, this.h, 4) //Draws the moving platform
	  if (abs(this.x-(this.a-this.x)*cos(cycle) - robin[0]) < this.w/2 + 25 && abs(this.y+(this.b-this.y)*cos(cycle) - robin[1]) < this.h/2 + 25) { //Checks for any collision at all
		if (dashing && pdt > 0.05) {//Conditional prevents dash from immediately ending
		  jump = true;
		  dashing = false;
		}
		if (abs(this.y+(this.b-this.y)*cos(cycle) - robin[1]) < this.h/2 + 25 && abs(this.x-(this.a-this.x)*cos(cycle) - probin[0]) < this.w/2 + 25) { //Top-bottom collision
		  speedY = 0;
		  if (this.y+(this.b-this.y)*cos(cycle) < robin[1]) { //Pushes down
			robin[1] = this.y + this.h/2 + 25;
		  } else if (this.y+(this.b-this.y)*cos(cycle) > robin[1]) { //Pushes up
			robin[1] = this.y+(this.b-this.y)*cos(cycle) - this.h/2 - 25;
			jump = true;
			airtime = 0;
			if (!dashing) {
			  dash = true;
			}
		  }
		} else if (abs(this.x-(this.a-this.x)*cos(cycle) - robin[0]) < this.w/2 + 25 && abs(this.y+(this.b-this.y)*cos(cycle) - probin[1]) < this.h/2 + 25) { //Side detection
		  speedX *= -1; //Add a little bounce off the wall
		  if (this.x-(this.a-this.x)*cos(cycle) < robin[0]) { //Pushes right
			robin[0] = this.x-(this.a-this.x)*cos(cycle) + this.w/2 + 25;
		  } else if (this.x-(this.a-this.x)*cos(cycle) > robin[0]) { //Pushes left
			robin[0] = this.x-(this.a-this.x)*cos(cycle) - this.w/2 - 25;
		  }
		}
	  }
	}
	breakable() { //A special platform that breaks if enough force is exerted on it
	  if(reset) { //Resets the breakable block when the level is reset
		this.a = true;
	  }
	  if(this.a) {
		rect(this.x, this.y, this.w, this.h) //Draws the breakable platform
		
		if (abs(this.x - robin[0]) < this.w/2 + 25 && abs(this.y - robin[1]) < this.h/2 + 25) { //Checks for any collision at all
		  if (dashing && pdt > 0.05) {//Conditional prevents dash from immediately ending
			jump = true;
			dashing = false;
		  }
		  if (abs(this.y - robin[1]) < this.h/2 + 25 && abs(this.x - probin[0]) < this.w/2 + 25) { //Top-bottom collision
			if (this.y < robin[1]) { //Pushes down
			  robin[1] = this.y + this.h/2 + 25;
			  speedY = 0;
			} else if (this.y > robin[1]) { //Pushes up
			  if (speedY < -10) { //Breaks with enough y speed
				sink.play();
				this.a = false;
				jump = true;
			  }
			  robin[1] = this.y - this.h/2 - 25;
			  speedY = 0;
			  jump = true;
			  airtime = 0;
			  if (!dashing) {
				dash = true;
			  }
			}
		  } else if (abs(this.x - robin[0]) < this.w/2 + 25 && abs(this.y - probin[1]) < this.h/2 + 25) { //Side detection
			speedX *= -1; //Add a little bounce off the wall
			if (this.x < robin[0]) { //Pushes right
			  robin[0] = this.x + this.w/2 + 25;
			} else if (this.x > robin[0]) { //Pushes left
			  robin[0] = this.x - this.w/2 - 25;
			}
		  }
		}
	  }
	}
	spike() { //Death awaits
	  rect(this.x, this.y, this.w, this.h) //Draws the spikes
	  if (abs(this.x - robin[0]) < this.w/2 + 25 && abs(this.y - robin[1]) < this.h/2 + 25) { //Checks for if you're dying tonight
		death.play(); //Woo, sound effect
		levelSet(); 
		levelReset();
	  }
	}
  }
  
  function draw() {
	//Background
	background(bgColour);
	
	//Initially hide all buttons and sliders, this saves a bunch of lines of code, even if runtime is slower
	levelSelectButton.hide();
	settingsButton.hide();
	dataButton.hide();
	backButton.hide();
	continueButton.hide();
	nextButton.hide();
	retryButton.hide();
	menuButton.hide();
	level1Button.hide();
	level2Button.hide();
	level3Button.hide();
	level4Button.hide();
	level5Button.hide();
	musicSlider.hide();
	sfxSlider.hide();
	opacSlider.hide();
	
	//Level controller
	push(); //Just for stylistic stuff
	if (level == 0) { //Main menu
	  paused = false;
	  levelSelectButton.show();
	  settingsButton.show();
	  dataButton.show();
	  babaYou.play();
	  wallStop.stop();
	  waterSink.stop();
	  boxKey.stop();
	  fruitGrass.stop();
	  lavaHot.stop();
	  mainMenu();
	} else if (level == -1) { //Level select
	  paused = false;
	  level1Button.show();
	  level2Button.show();
	  level3Button.show();
	  level4Button.show();
	  level5Button.show();
	  backButton.show();
	  babaYou.play();
	  wallStop.stop();
	  waterSink.stop();
	  boxKey.stop();
	  fruitGrass.stop();
	  lavaHot.stop();
	  levelSelect();
	} else if (level == -2) { //Settings
	  paused = false;
	  backButton.show();
	  musicSlider.show();
	  sfxSlider.show();
	  opacSlider.show();
	  settings();
	} else if (level == 1) { //Level 1
	  babaYou.stop();
	  wallStop.play();
	  waterSink.stop();
	  boxKey.stop();
	  fruitGrass.stop();
	  lavaHot.stop();
	  level1();
	} else if (level == 2) { //Level 2
	  babaYou.stop();
	  wallStop.stop();
	  waterSink.play();
	  boxKey.stop();
	  fruitGrass.stop();
	  lavaHot.stop();
	  level2();
	} else if (level == 3) { //Level 3
	  babaYou.stop();
	  wallStop.stop();
	  waterSink.stop();
	  boxKey.play();
	  fruitGrass.stop();
	  lavaHot.stop();
	  level3();
	} else if (level == 4) { //Level 4
	  babaYou.stop();
	  wallStop.stop();
	  waterSink.stop();
	  boxKey.stop();
	  fruitGrass.play();
	  lavaHot.stop();
	  level4();
	} else if (level == 5) { //Level 5
	  babaYou.stop();
	  wallStop.stop();
	  waterSink.stop();
	  boxKey.stop();
	  fruitGrass.stop();
	  lavaHot.play();
	  level5();
	}
	pop();
	reset = false; //Once the reset for breakable platforms is done, it turns off
	
	if (level > 0) { //If any level is playing, then full game functionality will show
	  robinSize = 50;
	  if (paused == false) { //Checks if the pause menu is open and only does calculation if it isn't
		if (focused) { //Tiny, sort-of QoL
		  movementCalculation();
		  pointerCalculation();
		  if (dashing) {
			dashMovement();
		  }
		}
		robinRender();
		goalRender();
		coinRender();
		timerRender();
		winCheck();
	  } else { //Pause menu IS open
		retryButton.show();
		menuButton.show();
		robinRender();
		goalRender();
		coinRender();
		timerRender();
		pauseMenu(); //The presence of other buttons is determined in here
	  }
	} else if (level == -2) { //Settings are a special case in the menu
	  robinSize = 50;
	  movementCalculation();
	  pointerCalculation();
	  if (dashing) {
		dashMovement();
	  }
	  robinRender();
	} else { //Covers the rest of the menus
	  robinSize = 250;
	  robin = [250, 300];
	  robinRender();
	}
	
	if (debugging) { //Keeps the debug menu open if toggled
	debugMenu();
	}
  }
  
  //Main menu
  function mainMenu() {
	bgColour = color(21, 40, 99); //Royal blue dark
	fill(247, 244, 234); //Alabaster white
	textAlign(CENTER, CENTER);
	textSize(32);
	text("Passerine's Arc", 600, 120);
  }
  
  //Level select menu
  function levelSelect() {
	bgColour = color(21, 40, 99); //Liberty
	fill(247, 244, 234); //Alabaster white
	textAlign(CENTER, CENTER);
	textSize(32);
	text("Passerine's Arc", 600, 120);
	
	//Checks for level completion
	if (levelWon[0] == 1) {
	  image(hatR, 560, 220, 100, 100);
	}
	if (levelWon[1] == 1) {
	  image(hatR, 680, 220, 100, 100);
	}
	if (levelWon[2] == 1) {
	  image(hatR, 500, 340, 100, 100);
	}
	if (levelWon[3] == 1) {
	  image(hatR, 620, 340, 100, 100);
	}
	if (levelWon[4] == 1) {
	  image(hatR, 740, 340, 100, 100);
	}
	
	if (levelWon[0] == 1 && levelWon[1] == 1 && levelWon[2] == 1 && levelWon[3] == 1 && levelWon[4] == 1) {
	  textAlign(LEFT, BOTTOM);
	  textSize(24);
	  text("Final time: \n" + floor(timer/60000) + ":" + floor((timer/6000)%6) + floor((timer/1000)%10) + "." + round(timer%1000), 15, 585);
	}
  }
  
  //Settings menu
  function settings() {
	bgColour = color(247, 244, 234); //Alabaster white
	fill(21, 40, 99); //Royal blue dark
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(32);
	text("Settings", 600, 120);
	textSize(24);
	text("Volume", 600, 180);
	text("Pointer", 600, 330);
	textAlign(LEFT, CENTER);
	textSize(16);
	text("Music", 500, 210);
	text("Sound Effects", 500, 260);
	text("Pointer opacity", 500, 360);
	
	textAlign(RIGHT, CENTER);
	textSize(16);
	text(musicVol, 700, 210);
	text(sfxVol, 700, 260);
	text(pointerOpac + "%", 700, 360);
	
	//Adjusts new values from moving the sliders
	musicVol = musicSlider.value();
	sfxVol = sfxSlider.value();
	pointerOpac = opacSlider.value();
	
	//Adjusts the volume of all sound files
	babaYou.setVolume(musicVol/40);
	wallStop.setVolume(musicVol/40);
	waterSink.setVolume(musicVol/40);
	boxKey.setVolume(musicVol/40);
	fruitGrass.setVolume(musicVol/40);
	lavaHot.setVolume(musicVol/25);
	death.setVolume(sfxVol/10);
	flag.setVolume(sfxVol/10);
	move.setVolume(sfxVol/4);
	sink.setVolume(sfxVol/10);
	teleport.setVolume(sfxVol/10);
	unlock.setVolume(sfxVol/10);
	
	middlePlatform.platform();
  }
  
  //Level 1
  function level1() {
	bgColour = color(205, 243, 172); //Tea green
	noStroke();
	fill(143, 230, 114); //Light green
	plat11.platform();
	plat12.platform();
	plat13.platform();
	plat14.platform();
	plat15.platform();
	plat16.platform();
	plat17.platform();
	plat18.platform();
	fill(112, 25, 141); //Inverse colour
	spike11.spike();
  }
  
  //Level 2
  function level2() {
	bgColour = color(179, 136, 235); //Lavender floral
	noStroke();
	fill(127, 82, 212); //Slate blue
	plat21.platform();
	plat22.platform();
	plat23.platform();
	plat24.platform();
	plat25.platform();
	plat26.platform();
	plat27.platform();
	plat28.platform();
	plat29.platform();
	plat20.platform();
	plat2a.platform();
	fill(76, 119, 20); //Inverse colour
	spike21.spike();
	spike22.spike();
  }
  
  //Level 3
  function level3() {
	bgColour = color(236, 155, 223); //Orchid crayola
	noStroke();
	fill(236, 80, 184); //Frostbite
	plat31.platform();
	plat32.platform();
	plat33.platform();
	plat34.platform();
	plat35.platform();
	plat36.platform();
	plat37.platform();
	plat38.platform();
	plat39.platform();
	plat30.platform();
	fill(19, 175, 71); //Inverse colour
	spike31.spike();
	spike32.spike();
	spike33.spike();
	fill(173, 247, 241); //Celeste
	stroke(135, 161, 220); //Litte boy blue
	break31.breakable();
	break32.breakable();
	break33.breakable();
	break34.breakable();
  }
  
  //Level 4
  function level4() {
	bgColour = color(153, 249, 212); //Magic mint
	fill(65, 237, 154); //Medium spring green
	noStroke();
	plat41.platform();
	plat42.platform();
	plat43.platform();
	plat44.platform();
	plat45.platform();
	plat46.platform();
	plat47.platform();
	plat48.platform();
	move41.moving();
	move42.moving();
	move43.moving();
	move44.moving();
	move45.moving();
	fill(190, 18, 101); //Inverse colour
	spike41.spike();
	spike42.spike();
  }
  
  //Level 5
  function level5() {
	bgColour = color(218, 65, 103); //Cerise
	fill(198, 20, 32); //Lava
	noStroke();
	plat51.platform();
	plat52.platform();
	plat53.platform();
	plat54.platform();
	plat55.platform();
	plat56.platform();
	plat57.platform();
	plat58.platform();
	plat59.platform();
	plat50.platform();
	plat5a.platform();
	plat5b.platform();
	plat5c.platform();
	move51.moving();
	fill(57, 235, 223); //Inverse colour
	spike51.spike();
	spike52.spike();
	spike53.spike();
	spike54.spike();
	spike55.spike();
	spike56.spike();
	spike57.spike();
	spike58.spike();
	spike59.spike();
	spike50.spike();
	spike5a.spike();
	spike5b.spike();
	spike5c.spike();
	spike5d.spike();
	spike5e.spike();
	fill(173, 247, 241); //Celeste
	stroke(135, 161, 220); //Little boy blue
	break51.breakable();
	break52.breakable();
	break53.breakable();
  }
  
  //Basic movement and other calculations
  function movementCalculation() {
	//Copying an array onto an array leaves an interesting result in execution order, so I'm copying the items into their indice separately
	probin[0] = robin[0];
	probin[1] = robin[1];
	
	//Keyboard stuff
	if (keyIsDown(87) && jump) { //w
	  speedY = 10/(deltaTime*3/50);
	  jump = false;
	}
	if (!dashing) {
	  if (keyIsDown(65)) { //a
		speedX -= 1.2;
	  }
	  if (keyIsDown(68)) { //d
		speedX += 1.2;
	  }
	}
	
	//Improviseed mouse release to dash
	if (!mouseIsPressed && slowdown && dash) {
	  teleport.play();
	  distX = 2*(dashDistX)/(deltaTime*3/50);
	  distY = dashDistY/(deltaTime*3/50);
	  x = robin[0];
	  y = robin[1];
	  dt = 0.0;
	  pdt = 0.0;
	  increment = sqrt(pow(cos(angle)/distX, 2)+pow(sin(angle)/distY, 2)*18); //It's a complex equation because it makes it so that the speed is constant and the time length of the dash differs
	  dash = false;
	  dashing = true;
	}
	
	//Time slow-down (Time modifier)
	if (mouseIsPressed && dash) {
	  timeModif = 0.1;
	  slowdown = true;
	} else {
	  timeModif = 1;
	  slowdown = false;
	}
	
	//Actually moving Robin
	robin[0] += speedX*timeModif*deltaTime*3/50;
	robin[1] -= speedY*timeModif*deltaTime*3/50;
	
	//Deceleration
	speedX *= 0.8 * timeModif;
	if (speedY > -10) {
	  speedY -= 0.5 * timeModif;
	}
	
	//Airtime check
	airtime++;
	if (airtime == 6) { //Takes away the jump
	  jump = false;
	}
	
	//Border and death check
	if (robin[0] < 0) {
	  robin[0] = 0;
	}
	if (robin[0] > 800) {
	  robin[0] = 800;
	}
	if (robin[1] < 0) {
	  robin[1] = 0;
	}
	if (robin[1] > 600) {
	  death.play();
	  levelReset();
	}
	
	cycle += 0.01*timeModif*deltaTime*3/50; //For moving platforms
  }
  
  //Pointers!
  function pointerCalculation() {
	//Determines the angle, with a full range of 2pi radians
	xDif = mouseX-robin[0];
	yDif = -(mouseY-robin[1]);
	angle = acos(xDif/(sqrt(sq(xDif)+sq(yDif)))); //Trig stuff
	if (yDif < 0) {
	  angle = -angle + TWO_PI; //Makes it a full 2pi radians of measurement
	}
	
	//Limiting the length of the dash
	if (pow(mouseX-robin[0], 2)+pow(mouseY-robin[1], 2) > 14400) { //Pythag to find distance, right side is squared to make computer's life easier
	  dashDistX = 120*cos(angle);
	  dashDistY = 120*sin(angle);
	} else {
	  dashDistX = mouseX-robin[0];
	  dashDistY = -(mouseY-robin[1]);
	}
	
	//The pointers that follows the mouse
	pointerColour = color(21, 40, 99, pointerOpac*2.55);
	push();
	if (slowdown) { //Arc pointer that appears when LMB is held down
	  noFill();
	  stroke(pointerColour);
	  beginShape();
	  vertex(robin[0], robin[1]);
	  quadraticVertex(robin[0]+(dashDistX), robin[1]-2*(dashDistY), robin[0]+2*(dashDistX), robin[1]); //Bezier curves and quadratics make for an extremely fascinating relation
	  endShape();
	  strokeWeight(5);
	  point(robin[0]+2*(dashDistX), robin[1]);
	} else { //Triangle pointer that appears otherwise
	  fill(pointerColour);
	  noStroke();
	  triangle(robin[0] + 30*cos(angle+PI/15), robin[1] + 8 - 30*sin(angle+PI/15), robin[0] + 30*cos(angle-PI/15), robin[1] + 8 - 30*sin(angle-PI/15), robin[0] + 36*cos(angle), robin[1] + 8 - 36*sin(angle));
	}
	pop();
  }
  
  //Dashing
  function dashMovement() {
	speedX = distX*(dt-pdt);
	speedY = -(((4*distY)/pow(distX, 2) * (distX*(dt)) * (distX*(dt) - distX)) - ((4*distY)/pow(distX, 2) * (distX*(pdt)) * (distX*(pdt) - distX))); //Quadratics suck (If you wanna know, it has to do with bezier curves)
	pdt = dt; //Stores the previous dt value
	dt += increment; //Progresses through the dash
	if (dt > 1) {
	  jump = true;
	  dashing = false;
	}
  }
  
  //Draws Robin
  function robinRender() {
	if (robin[0] < mouseX) { //Checks for right-facing animation
	  if (speedY <= 2 && speedY >= -2 && !jump) { //Stalling (Jumping animations takes precendence)
		image(plateauR, robin[0], robin[1], robinSize, robinSize);
	  } else if (speedY > 1) { //Jumping
		image(upwardsR, robin[0], robin[1], robinSize, robinSize);
	  } else if (speedY < -1) { //Falling
		image(downwardsR, robin[0], robin[1], robinSize, robinSize);
	  } else if (speedX > 1) { //Walking right
		image(walkingR, robin[0], robin[1], robinSize, robinSize);
	  } else { //Idle right
		image(idleR, robin[0], robin[1], robinSize, robinSize);
	  }
	  image(hatR, robin[0], robin[1]+robinSize/20, robinSize, robinSize); //Hat layer on top of everything else
	} else if (robin[0] > mouseX) { //Checks for leftward animation
	  if (speedY <= 1 && speedY >= -1 && !jump) { //Stalling
		image(plateauL, robin[0], robin[1], robinSize, robinSize);
	  }
		else if (speedY > 1) { //Jumping
		image(upwardsL, robin[0], robin[1], robinSize, robinSize);
	  } else if (speedY < -1) { //Falling
		image(downwardsL, robin[0], robin[1], robinSize, robinSize);
	  } else if (speedX < -1) { //Walking left
		image(walkingL, robin[0], robin[1], robinSize, robinSize);
	  } else { //Idle left
		image(idleL, robin[0], robin[1], robinSize, robinSize);
	  }
	  image(hatL, robin[0], robin[1]+robinSize/20, robinSize, robinSize);
	} else { //Just to keep something there
	  image(idleR, robin[0], robin[1], robinSize, robinSize);
	  image(hatR, robin[0], robin[1]+robinSize/20, robinSize, robinSize);
	}
  }
  
  //Draws the coin
  function coinRender() {
	if (coined) { //Only shows coin if not collected
	  image(shinyCoin, coin[0], coin[1], 64, 64);
	  if (abs(coin[0] - robin[0]) <= 40 && abs(coin[1] - robin[1]) <= 40) {
		unlock.play();
		coined = false;
	  }
	}
  }
  
  //Draws the goal
  function goalRender() {
	if (coined) { //Changes depending on if the coin has been collected or not
	image(goalEmpty, goal[0], goal[1], 64, 64);
	} else {
	image(goalFull, goal[0], goal[1], 64, 64);
	}
  }
  
  //Win check, essentially determining if the pause menu is regular or not
  function winCheck() {
	if (abs(goal[0] - robin[0]) <= 30 && abs(goal[1] - robin[1]) <= 30 && pauseType != "You won!" && !coined) { //Checks for touching the goal
	  if (!coined) { //Makes sure the coin has been collected
		flag.play();
		levelWon[level-1] = 1;
		paused = true;
		pauseType = "You won!";
	  }
	} else { //Normal pause
	  pauseType = "Paused";
	}
  }
  
  //Draws (and updates!) the timer
  function timerRender() {
	if (pauseType != "You won!") {
	  timer += deltaTime;
	}
	push();
	fill(247, 244, 234); //Alabaster white
	noStroke();
	rect(100, 20, 200, 40, 0, 0, 10, 0);
	fill(21, 40, 99); //Royal blue dark
	textAlign(LEFT, CENTER);
	textSize(24);
	text(floor(timer/60000) + ":" + floor((timer/10000)%6) + floor((timer/1000)%10) + "." + round(timer%1000), 10, 20);
	pop();
  }
  //Pause menu (and technically the win menu as well)
  function pauseMenu() {
	if (pauseType == "Paused") {
	  continueButton.show();
	  nextButton.hide();
	} else if (pauseType == "You won!") {
	  continueButton.hide();
	  nextButton.show();
	}
	fill(21, 40, 99, 80);
	rect(400, 300, 800, 600); //Overall background dimmer
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(32);
	text(pauseType, 400, 150); //Displays text for the type of pause menu
  }
  
  //Debug menu
  function debugMenu() {
	fill(255);
	stroke(0);
	textAlign(LEFT, TOP);
	textSize(10);
	text("robin: " + robin, 10, 10);
	text("probin: " + probin, 10, 25);
	text("sX: " + speedX, 10, 40);
	text("sY: " + speedY, 10, 55);
	text("dX: " + dashDistX, 10, 70);
	text("dY: " + dashDistY, 10, 85);
	text("lev: " + level, 10, 100);
	text("won: " + levelWon, 10, 115);
	text("dt: " + dt, 10, 130);
	text("jump: " + jump, 10, 145);
	text("dash: " + dash, 10, 160);
	text("coin: " + coined, 10, 175);
  }
  
  //Pause menu (ESC) + Debug menu (p) + Quick reset (r)
  function keyPressed() {
	if (level > 0 && pauseType == "Paused") { //Only works in levels and when not having won or lost
	  if (keyCode == ESCAPE) {
		if (paused == true) {paused = false;}
		else {paused = true;}
	  }
	}
	if (keyIsDown(80)) { //p
	  if (debugging == true) {debugging = false;}
	  else {debugging = true;}
	}
	if (keyIsDown(82)) { //r
	  levelRetry();
	}
	return false; //Prevent default behaviour
  }
  
  //A bunch of miscellaneous functions just for button.mouseReleased() stuff
  
  function levelSet0() {move.play(); level = 0;}
  
  function levelSetMinus1() {
	move.play();
	level = -1;
	speedX = 0;
	speedY = 0;
  }
  
  function levelSetMinus2() {
	move.play();
	levelSet();
	level = -2;
	robin = [225, 250];
  }
  
  function levelSet1() {
	move.play();
	levelSet();
	level = 1;
	robin = [120, 125];
	goal = [120, 370];
	coined = false;
  }
  
  function levelSet2() {
	move.play();
	levelSet();
	level = 2;
	robin = [110, 380];
	goal = [110, 380];
	coin = [400, 470];
	coined = true;
  }
  
  function levelSet3() {
	move.play();
	levelSet();
	level = 3;
	robin = [100, 500];
	goal = [550, 60];
	coin = [250, 285];
	coined = true;
  }
  
  function levelSet4() {
	move.play();
	levelSet();
	level = 4;
	robin = [100, 480];
	goal = [700, 480];
	coin = [400, 480];
	coined = true;
  }
  
  function levelSet5() {
	move.play();
	levelSet();
	level = 5;
	robin = [400, 500];
	goal = [400, 500];
	coin = [400, 100];
	coined = true;
  }
  
  function levelNext() {
	level++;
	levelSet();
	levelReset();
  }
  
  function levelSet() {
	paused = false;
	pauseType = "Paused";
	speedX = 0;
	speedY = 0;
	jump = false;
	dash = false;
	dashing = false;
	reset = true;
	cycle = 0;
  }
  
  function levelReset() {
	if (level == 1) {levelSet1();}
	else if (level == 2) {levelSet2();}
	else if (level == 3) {levelSet3();}
	else if (level == 4) {levelSet4();}
	else if (level == 5) {levelSet5();}
	else if (level == -2) {levelSetMinus2();}
  }
  
  function levelRetry() { //levelReset() is used a little more universally, so levelRetry() is called when the player explcitly restarts by dying with a button
	if (pauseType != "You won!") {
	  death.play();
	}
	levelReset();
  }
  
  function dataReset() {
	move.play();
	levelWon = [0, 0, 0, 0, 0];
	timer = 0;
  }
  
  function unpause() { //Unpause feature specifically for the unpause button
	move.play();
	paused = false;
  }