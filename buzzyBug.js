//make sure to include a reference to this file in the index.html

//crap, i'm probably doing this completely wrong! 
//i'd been thinking about having boxes emerging from the top and bottom, with blank areas in between, and then checking against both of those boxes each time for collisions
//i can invert that pattern. Just generate one box in the middle of the screen that is the safe area
//the default styling for everything else on teh screen is going to be the enemy styling, while the box itself will have ally styling
//then all we have to do is check the top and bottom positions of that box against the user's position

//create an object that has box number as it's key, and then top/bottom positions as a tuple as it's value
//we can lookup box number by taking the user's x position and dividing it by boxWidth; 
//this is a super easy collision checker. 

var boardHeight = screen.height - 180;
var boardWidth = screen.width - 200;
var battlefield = d3.select('body').append('svg:svg')
                    .attr('class', battlefield)
                    .attr('width', boardWidth)
                    .attr('height', boardHeight);

/*
  boxPositions will be filled with tuples
  the index will give us the x positions (since they're in order and we know how wide each box is)
  the first value of the tuple will give us the y position
  the second value of the tuple will give us the height of the box
*/

//create a row of boxes that represents the safe zone
var boxPositions = [];
var boxWidth = 20;
var boxHeight = 450;

for(var i = 0; i <= Math.ceil(boardWidth/boxWidth); i++) {
  var heightStart = 200;
  if(i%2 === 0 ) {
    heightStart = 250;
  }
  boxPositions.push([heightStart, boxHeight, i]);
}

battlefield
    .selectAll()
    .data(boxPositions)
    .enter()
    .append('svg:image')
    .attr('class','safePlaces')
    .attr('xlink:href', 'images/4.png')
    .attr('height', function(d) {return d[1];})
    .attr('width', boxWidth)
    .attr('x', function(d) { return d[2]*boxWidth; })
    .attr('y', function(d) { return d[0]; });



//create a user, controllable by dragging
var addPlayer = function() {
  var radius = 25;
  var startingPosition = [{x: boardWidth/2, y: boardHeight/2, r:radius}];
  battlefield.playerRadius = radius;

  var drag = d3.behavior.drag()
   .on('dragstart', function() { circle.style('fill', 'red'); })
   .on('drag', function() { circle.attr('cx', d3.event.x)
                                  .attr('cy', d3.event.y); })
   .on('dragend', function() { circle.style('fill', 'black'); });

 var circle = battlefield.selectAll('.player')
   .data(startingPosition)
   .enter()
   .append('svg:circle')
   .attr('class', 'player')
   .attr('cx', function(d) { return d.x; })
   .attr('cy', function(d) { return d.y; })
   .attr('r', function(d) { return d.r; })
   .call(drag)
   .style('fill', 'black');
}
addPlayer();

//check for collisions of the user and the boxes
var playerPosition = {};

var playerCoordinates = function() {
  d3.selectAll(".player").each( function(d, i){
    playerPosition.x = d3.select(this).attr("cx");
    playerPosition.y = d3.select(this).attr("cy");
  });
};


var collisionInterval = setInterval(function() {
  playerCoordinates();
  var boxNumber = Math.floor(playerPosition.x/boxWidth);
  var safeAreas = boxPositions[boxNumber];
  if(playerPosition.y > safeAreas[0] && playerPosition.y < safeAreas[0] + safeAreas[1]) {
    console.log('the player is safe');
  } else {
    // debugger;
    console.log('out of bounds!');
  }
}, 500);

//move the boxes on a fixed interval
var counter = 0;
var moveTimeout = setInterval(function() {
  boxPositions = [];
  counter++;
  for(var i = 0; i <= Math.ceil(boardWidth/boxWidth); i++) {
    var heightStart = 250;
    if((i + counter) %2 === 0 ) {
      heightStart = 200;
    }
    boxPositions.push([heightStart, boxHeight, i]);
    
  }
    console.log(boxPositions[3]);

  battlefield
      .selectAll('.safePlaces')
      .data(boxPositions)
      .attr('class', 'safePlaces')
      .attr('xlink:href', 'images/4.png')
      .attr('height', function(d) {return d[1];})
      .attr('width', 1*counter)
      .attr('x', function(d) { return d[2]*boxWidth; })
      .attr('y', function(d) { return d[0]; })
      .transition();


},1000);

//make the boxes different heights
  //make the box heights make sense transitioning from one to the other
  //make the game progressively more difficult
  //

//let the user use the space bar to control the bug
  //implement gravity

//extra credit:
  //MAKE IT MOBILE!!
    //wrap it in ionic

  //fix the size of the board to something that'll work on all screens

  //server?

  //store high scores in a database?

  //overall leaderboard

  //multiple players?? seems like a bad ux



//style everything
  //boxes are random arrays of 1's and 0's
  //make the user into a bug
  //background of the page?
  //background of the battlefield?
  //user score
  //user image: 8 bit version of a bug
