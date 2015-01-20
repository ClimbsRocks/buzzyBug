//bugs: 


//sets the board based on the screen size
var boardHeight = screen.height - 180;
var boardWidth = screen.width - 200;
var battlefield = d3.select('body').append('svg:svg')
                    .attr('class', battlefield)
                    .attr('width', boardWidth)
                    .attr('height', boardHeight);

var currentScore = 0;
var highScore = 0;

var gameStart = function() {
  //create a row of boxes that represents the safe zone
  var boxPositions = [];
  var boxWidth = 20;
  var boxHeight = 450;


  for(var i = 0; i <= Math.ceil(boardWidth/boxWidth); i++) {
    var heightStart = 200;
    boxPositions.push([heightStart, boxHeight, i]);
  }

  //append initial images
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
    console.log('startingPosition: ', startingPosition);
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
      console.log('out of bounds!');
      clearInterval(moveTimeout);
      if(currentScore > highScore) {
        highScore = currentScore;
        currentScore = 0;

        d3.select('#highScore').
        data([highScore]).
        text(function(d) {
          return d;
        });
      }
    }
  }, 50);

  //move the boxes on a fixed interval
  var prevWasConstriction = false;
  var moveTimeout = setInterval(function() {
    boxPositions.shift();
    if(prevWasConstriction) {
      //make it an easy one
      heightStart = 200;
      height = boxHeight;
      prevWasConstriction = false;
    } else {
      //70% chance we'll make it a hard one
      if(Math.random() > .3) {
        height = 100;
        heightStart = 50 + Math.random() * (boardHeight - 200);
        prevWasConstriction = true;
      } else {
        heightStart = 200;
        height = boxHeight;
      }
    }
    boxPositions.push([heightStart, boxHeight, boxPositions.length +1]);

    var boxes = battlefield
        .selectAll('.safePlaces')
        .data(boxPositions);
    boxes.attr('x', function(d) { 
      d[2]--;
      return d[2]*boxWidth;} 
      )
        .attr('class', 'safePlaces')
        .attr('xlink:href', 'images/4.png')
        .attr('height', function(d) { return d[1];})
        .attr('width', boxWidth)
        .attr('x', function(d) { return d[2]*boxWidth; })
        .attr('y', function(d) { return d[0]; })
    
    boxes.exit().remove();

    currentScore++;
    d3.select('#currentScore').
    data([currentScore]).
    text(function(d) {
      return d;
    });

  },50);
  
};

gameStart();

d3.select('#resetButton').on('click', function() {
  gameStart();
});
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
