//bugs: 
(function() {
  var boardHeight = screen.height - 380;
  var boardWidth = screen.width - 200;
  var battlefield = d3.select('body').append('svg:svg')
                      .attr('class', battlefield)
                      .attr('width', boardWidth)
                      .attr('height', boardHeight);

  var currentScore = 0;
  var highScore = 0;
  var collisionInterval;

  var gameIsRunning = false;
  var lastGameEnd = Date.now();
  //sets the board based on the screen size
  var gameStart = function() {
    //create a row of boxes that represents the safe zone
    var boxPositions = [];
    var boxWidth = 25;
    var boxHeight = boardHeight - 200;


    for(var i = 0; i <= Math.ceil(boardWidth/boxWidth); i++) {
      var heightStart = (boardHeight - boxHeight)/2 ;
      boxPositions.push([heightStart, boxHeight, i]);
    }

    //append initial images
    battlefield
        .selectAll()
        .data(boxPositions)
        .enter()
        .append('svg:image')
        .attr('class','safePlaces')
        .attr('xlink:href', 'images/8.png')
        .attr('height', function(d) {return d[1];})
        .attr('width', boxWidth)
        .attr('x', function(d) { return d[2]*boxWidth; })
        .attr('y', function(d) { return d[0]; });


    //create a user, controllable by dragging
    var addPlayer = function() {
      var playerRadius = 25;
      var startingPosition = [{x: boardWidth/3, y: boardHeight/2, r:playerRadius}];
      battlefield.playerRadius = playerRadius;

     var circle = battlefield.selectAll('.player')
       .data(startingPosition)
       .enter()
       .append('svg:image')
       .attr('class', 'player')
       .attr('xlink:href', 'images/bugRound1.png')
       .attr('height', 50)
       .attr('width', 50)
       .attr('x', function(d) { return d.x; })
       .attr('y', function(d) { return d.y; })
       // .attr('r', function(d) { return d.r; })
       .style('fill', 'orange');

    }
    addPlayer();

    //check for collisions of the user and the boxes
    var playerPosition = {};

    var playerCoordinates = function() {
      d3.selectAll(".player").each( function(d, i){
        playerPosition.y = d3.select(this).attr("y");
      });
    };

    //CHECK FOR COLLISIONS ON A FIXED INTERVAL
    d3.selectAll(".player").each( function(d, i){
      playerPosition.x = d3.select(this).attr("x");
    });
    var boxNumber = Math.round(playerPosition.x/boxWidth) +1;
    collisionInterval = setInterval(function() {
      playerCoordinates();
      var safeAreas = boxPositions[boxNumber];
      if(playerPosition.y + 25 > safeAreas[0] && (playerPosition.y*1 + 20 ) < (safeAreas[0] + safeAreas[1]) ) {
      } else {
        //stop all the intervals
        clearInterval(moveTimeout);
        clearInterval(collisionInterval);
        clearInterval(internalGravityInterval);
        if(currentScore > highScore) {
          highScore = currentScore;

          d3.select('#highScore').
          data([highScore]).
          text(function(d) {
            return d;
          });
        }
        currentScore = 0;
        gameIsRunning = false;
        lastGameEnd = Date.now();
      }
    }, 15);

    //move the boxes on a fixed interval
    var prevWasConstriction = false;
    var moveTimeout = setInterval(function() {

      //CREATE NEW POSITIONS FOR BOXES
      boxPositions.shift();
      if(prevWasConstriction) {
        //make it an easy one
        heightStart = (boardHeight - boxHeight)/2;
        height = boxHeight;
        prevWasConstriction = false;
      } else {
        //70% chance we'll make it a hard one
        if(Math.random() > .4) {
          height = boxHeight*.75;
          heightStart = Math.random() * (boardHeight - boxHeight/2 -50);
          prevWasConstriction = true;
        } else {
          heightStart = (boardHeight - boxHeight)/2;
          height = boxHeight;
        }
      }
      boxPositions.push([heightStart, boxHeight, boxPositions.length +1]);

      //UPDATE BOXES IN D3 AND DOM
      var boxes = battlefield
          .selectAll('.safePlaces')
          .data(boxPositions);
      boxes.attr('x', function(d) { 
        d[2]--;
        return d[2]*boxWidth;} 
        )
          .attr('class', 'safePlaces')
          .attr('xlink:href', 'images/8.png')
          .attr('height', function(d) { return d[1];})
          .attr('width', boxWidth)
          .attr('x', function(d) { return d[2]*boxWidth; })
          .attr('y', function(d) { return d[0]; })
      
      boxes.exit().remove();

      //UPDATE SCORE
      currentScore++;
      d3.select('#currentScore').
      data([currentScore]).
      text(function(d) {
        return d;
      });

    },75);

  // start gravityInterval within the game
  var internalGravityInterval = gravityInterval();
  gameIsRunning = true;

  }

  //****GRAVITY LOGIC****
  var gravity = 0;
  var currentY = boardHeight/2;
  var gravityIntervalTime = 25;
  var gravityInterval = function() {
    return setInterval(function() {
      gravity = gravity - 1.25;
      var newY = [{x: boardWidth/3, y: currentY - gravity, r:25}];
      d3.selectAll('.player')
        .data(newY)
        .transition()
        .duration(gravityIntervalTime)
        .attr('y', function(d) {return d.y;});
      currentY = currentY - gravity;
    }, gravityIntervalTime);
  }

  d3.select('#resetButton').on('click', function() {
    battlefield.selectAll('.player').data([]).exit().remove();
    gameStart();
    gravity = 0;
    currentY = boardHeight/2;
    
  });


  window.onkeydown = function(e) {
     var key = e.keyCode ? e.keyCode : e.which;
     if (key == 32) {
         e.preventDefault();
         if(gameIsRunning) {
           gravity = 12.5;
         } else if (Date.now() > lastGameEnd + 200) {
          battlefield.selectAll('.player').data([]).exit().remove();
          gameStart();
          gravity = 0;
          currentY = boardHeight/2;
          
         }

     }
  }

})  ();


/*
  3. style so that background is constant, and each pipe is translucent
  4. find a bug to style the icon with
  5. adjust the game mechanics a bit to make it easier
      more room between tough pipes
      likely more friction to make the user move more slowly
*/


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
