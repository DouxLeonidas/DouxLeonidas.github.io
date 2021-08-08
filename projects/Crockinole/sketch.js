let principalStatus;
let remainRed = 5;
let remainBlue = 5;
let redScore = 0;
let blueScore = 0;
let positionsRed = [];
let positionsBlue = [];
let nailsLocations = [];
let nailsWidth = 10;
let diskWidth = 18;
let magnitude = 40;
let angle = 0;
let turn;
let pointing = false;
let shooting = false;
let moving = false;
let arrowVisible = true;
let increment = 0;
let distance = 0;
let consecutiveMin = 0;

let timeInCenter = 0;
let colorInCenter;

let magnitudesRed = [];
let anglesRed = [];
let movingRed = [];
let incrementRed = [];
let distanceRed = [];
let consecutiveMinRed = [];

let magnitudesBlue = [];
let anglesBlue = [];
let movingBlue = [];
let incrementBlue = [];
let distanceBlue = [];
let consecutiveMinBlue = [];

function setup() {
  createCanvas(500, 450);
	principalStatus = 'Init';
	turn = 'Red';
}

function draw() {
	if(principalStatus == 'Init') {
		background(233);
		translate(250,220);
		stroke('#885010');

		//Wall
		fill('#784015');
		ellipse(0, 0, 430);

		//Circles
		fill('#988020');
		ellipse(0, 0, 370); //Edge
		ellipse(0, 0, 330); //0
		ellipse(0, 0, 220); //5
		ellipse(0, 0, 110); //10

		//Target hole 20
		fill('#784015');
		ellipse(0, 0, 20);
		push();
		if(timeInCenter>0) {
			timeInCenter--;
			if(colorInCenter == 'Red') {
				fill('#C83015');
				stroke('#B81015');
				if(timeInCenter == 0) {
					redScore++;
				}
			} else if(colorInCenter == 'Blue') {
				fill('#3015C8');
				stroke('#1015B8');
				if(timeInCenter == 0) {
					blueScore++;
				}
			}
			ellipse(0,0,diskWidth);
		}
		pop();

		//Lines
		let out = sqrt(pow(165,2)/2);
		let inb = sqrt(pow(110,2)/2);
		line(inb,inb,out,out);
		line(-inb, inb, -out,out);
		line(inb, -inb, out,-out);
		line(-inb, -inb, -out,-out);

		//Nails
		push();
		rotate(QUARTER_PI/2);
		for(var i=0, o=0; i<8; i++, o+=2) {
			rotate(QUARTER_PI);
			ellipse(55,0,nailsWidth);
			nailsLocations[o] = 55*cos((i*QUARTER_PI) + QUARTER_PI/2);
			nailsLocations[o+1] = 55*sin((i*QUARTER_PI + QUARTER_PI/2));
		}
		pop();

		//Score Red
		stroke('#B81015');
		fill('#784015');
		rect(220,-60,20,120);
		let actualRedScore = redScore;
		for(var n=0; n<12; n++) {
			if(actualRedScore>0) {
				fill('#C83015');
				actualRedScore--;
			} else {
				fill('#784015');
			}
			rect(220,50 - n*10,20,10);
		}

		//Score Blue
		stroke('#1015B8');
		fill('#784015');
		rect(-240,-60,20,120);
		let actualBlueScore = blueScore;
		for(var m=0; m<12; m++) {
			if(actualBlueScore>0) {
				fill('#3015C8');
				actualBlueScore--;
			} else {
				fill('#784015');
			}
			rect(-240,50 - m*10,20,10);
		}

		//Remains
		fill('#C83015');
		stroke('#B81015');
		ellipse(180, 190, 18);
		text('x '+remainRed,194,194);
		fill('#3015C8');
		stroke('#1015B8');
		ellipse(-220, -190, 18);
		text('x '+remainBlue,-205,-187);

		if(turn == 'Red') {
			if(remainRed > 0) {
				//Adding Red Disk
				positionsRed[positionsRed.length] = 0;
				positionsRed[positionsRed.length] = 165;
				remainRed--;
			}
			turn = 'WaitingBlue';
		} else if(turn == 'Blue') {
			if(remainBlue > 0) {
				//Addind Blue Disk
				positionsBlue[positionsBlue.length] = 0;
				positionsBlue[positionsBlue.length] = -165;
				remainBlue--;
			}
			turn = 'WaitingRed';
		} else if(turn == 'WaitingBlue') {
			if(pointing) {
				if((mouseX-250)>=-sqrt(pow(165,2)/2)&&(mouseX-250)<=sqrt(pow(165,2)/2)) {
					positionsRed[positionsRed.length-2]=mouseX-250;
					positionsRed[positionsRed.length-1]=sqrt(pow(165,2)-pow(mouseX-250,2));
				}
			}
		} else if(turn == 'WaitingRed') {
			if(pointing) {
				if((mouseX-250)>=-sqrt(pow(165,2)/2)&&(mouseX-250)<=sqrt(pow(165,2)/2)) {
					positionsBlue[positionsBlue.length-2]=mouseX-250;
					positionsBlue[positionsBlue.length-1]=-sqrt(pow(165,2)-pow(mouseX-250,2));
				}
			}


		}

		//Arrow
		if(arrowVisible && !moving) {
			push();
			if(shooting && magnitude>40){
				stroke('#10FF32');
				fill('#10FF32');
			} else {
				stroke('#F0FF32');
				fill('#F0FF32');
			}
			strokeWeight(4);
			let lastDisk;
			let val;
			if(turn == 'WaitingBlue') {
				lastDisk = createVector(positionsRed[positionsRed.length-2], positionsRed[positionsRed.length-1])
				val = HALF_PI;
			} else if(turn =='WaitingRed') {
				lastDisk = createVector(positionsBlue[positionsBlue.length-2], positionsBlue[positionsBlue.length-1])
				val = -HALF_PI;
			}
			if(shooting) {
				angle = atan2(mouseY-220-lastDisk.y,mouseX-250-lastDisk.x) + val;
				magnitude = dist(mouseX-250,mouseY-220,lastDisk.x,lastDisk.y);
			}
			translate(lastDisk.x,lastDisk.y);
			rotate(angle-val);
			line(0,0,max(magnitude,40),0);
			strokeWeight(1);
			triangle(max(magnitude,40)+5,0,max(magnitude,40)-5,5,max(magnitude,40)-5,-5);
			pop();
		}

		//Red disks
		fill('#C83015');
		stroke('#B81015');
		for(let pr=0; pr<positionsRed.length; pr+=2) {
			ellipse(positionsRed[pr], positionsRed[pr+1], diskWidth);
		}

		//Blue disks
		fill('#3015C8');
		stroke('#1015B8');
		for(let pb=0; pb<positionsBlue.length; pb+=2) {
			ellipse(positionsBlue[pb], positionsBlue[pb+1], diskWidth);
		}

		if(moving) {
			applyPhysics();
		}

		if(turn != 'WaitingBlue' && turn != 'WaitingRed' && (remainBlue + remainRed) == 0) {
			endGame();
		}
	}
}

function mousePressed() {
	if(principalStatus == 'Init') {
		let lastDisk;
		if(turn == 'WaitingBlue') {
			lastDisk = createVector(positionsRed[positionsRed.length-2], positionsRed[positionsRed.length-1])
		} else if(turn == 'WaitingRed') {
			lastDisk = createVector(positionsBlue[positionsBlue.length-2], positionsBlue[positionsBlue.length-1])
		}

		let distanceToDisk = dist(mouseX-250,mouseY-220,lastDisk.x,lastDisk.y);

		//Cheking if dragg the disk
		if(distanceToDisk < 10) {
			pointing = true;
		} else {
			pointing = false;
		}

		//Cheking if dragg the arrow
		if(distanceToDisk > 10 && distanceToDisk < magnitude) {
			shooting = true;
		} else {
			shooting = false;
		}
	}
}

function mouseReleased() {
	if(principalStatus == 'Init') {
		if(pointing == true) {
			pointing = false;
		}
		if(shooting == true) {
			shooting = false;
			if(magnitude>40 && !moving) {
				moving = true;
				increment = 6;
				distance = (magnitude-40) * random(2,2.3);
			}
		}
	}
}

function applyPhysics() {
	//Sliding
	let lastDisk;
	if(turn == 'WaitingBlue') {
		lastDisk = createVector(positionsRed[positionsRed.length-2], positionsRed[positionsRed.length-1]);
		checkCollisions(lastDisk, -HALF_PI);
		positionsRed[positionsRed.length-2]+=increment*cos(angle-HALF_PI);
		positionsRed[positionsRed.length-1]+=increment*sin(angle-HALF_PI);
	} else if(turn == 'WaitingRed') {
		lastDisk = createVector(positionsBlue[positionsBlue.length-2], positionsBlue[positionsBlue.length-1]);
		checkCollisions(lastDisk, HALF_PI);
		positionsBlue[positionsBlue.length-2]+=increment*cos(angle+HALF_PI);
		positionsBlue[positionsBlue.length-1]+=increment*sin(angle+HALF_PI);
	}
	
	//Movement
	if(distance > 0) {
		distance -= increment;
		increment*=0.98;
		increment = max(increment, 1);
		if(increment<=1) {
			consecutiveMin++;
			if(consecutiveMin >= 1) {
				stopLastDisk();
			}
		}
	} else {
		stopLastDisk();
	}
	
	if(!moving) {
		if(turn == 'WaitingBlue') {
			turn = 'Blue';
		} else if(turn == 'WaitingRed') {
			turn = 'Red';
		}
	}
	
}

function checkCollisions(lastDisk, val) {
	for(let r=0; r < nailsLocations.length; r+=2) {
		if(lastDisk != null) {
			if(2*dist(lastDisk.x,lastDisk.y,nailsLocations[r],nailsLocations[r+1]) <= (nailsWidth+diskWidth)) {
				angle = atan2(nailsLocations[r+1]-lastDisk.y, nailsLocations[r]-lastDisk.x) + val;
				increment*=0.88;
			}
		}
	}
	
	noActualRed = (turn == 'WaitingBlue') ? 2 : 0;
	noActualBlue = (turn == 'WaitingRed') ? 2 : 0;
	
	for(let u=0; u < positionsRed.length-noActualRed; u+=2) {
		if(lastDisk != null) {
			if(dist(lastDisk.x,lastDisk.y,positionsRed[u],positionsRed[u+1]) <= diskWidth) {
				angle = atan2(positionsRed[u+1]-lastDisk.y, positionsRed[u]-lastDisk.x) + val;
			}
		}
	}
	
	for(let u=0; u < positionsBlue.length-noActualBlue; u+=2) {
		if(lastDisk != null) {
			if(dist(lastDisk.x,lastDisk.y,positionsBlue[u],positionsBlue[u+1]) <= diskWidth) {
				angle = atan2(positionsBlue[u+1]-lastDisk.y, positionsBlue[u]-lastDisk.x) + val;
			}
		}
	}
	
	if(lastDisk != null) {
			if(dist(lastDisk.x,lastDisk.y,0,0) <= 10) {
				if(distance<=60) {
					if(turn == 'WaitingRed') {
						stopLastDisk();
						positionsBlue.splice(positionsBlue.length-2,2);
						colorInCenter = 'Blue';
					} else if(turn == 'WaitingBlue') {
						stopLastDisk();
						positionsRed.splice(positionsRed.length-2,2);
						colorInCenter = 'Red';
					}
					timeInCenter = 30;
				}
			}
		}
}

function stopLastDisk() {
	distance = 0;
	increment = 0;
	magnitude = 40;
	angle = 0;
	consecutiveMin = 0;
	moving = false;
}

function endGame() {
	arrowVisible = false;
	principalStatus = 'Game Over';
}