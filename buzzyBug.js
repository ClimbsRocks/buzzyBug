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


  //sets the board based on the screen size
  var gameStart = function() {
    console.log('started a new game');
    //create a row of boxes that represents the safe zone
    var boxPositions = [];
    var boxWidth = 25;
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
        .attr('xlink:href', 'images/8.png')
        .attr('height', function(d) {return d[1];})
        .attr('width', boxWidth)
        .attr('x', function(d) { return d[2]*boxWidth; })
        .attr('y', function(d) { return d[0]; });



    //create a user, controllable by dragging
    var addPlayer = function() {
      var playerRadius = 25;
      var startingPosition = [{x: boardWidth/2, y: boardHeight/2, r:playerRadius}];
      var startingPosition2 = [{x: boardWidth/2, y: boardHeight/2, r:playerRadius}];
      battlefield.playerRadius = playerRadius;

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
       .style('fill', 'orange');


      // var circle2 = battlefield.selectAll('.forcePlayer')
      //   .data(startingPosition)
      //   .enter()
      //   .append('svg:circle')
      //   .attr('class', 'forcePlayer')
      //   .attr('cx', function(d) { return d.x; })
      //   .attr('cy', function(d) { return d.y; })
      //   .attr('r', function(d) { return d.r; })
      //   .call(drag)
      //   .style('fill', 'green');

      // //attempt to use d3 force
      // var nodes = [],
      //     foci = [{ x:boardWidth/2, y: boardHeight }];


      // var force = d3.layout.force()
      //     .nodes(nodes)
      //     .links([])
      //     .linkStrength(0.1)
      //     .friction(0.5)
      //     .gravity(0)
      //     .size([50, 50])
      //     .on("tick", tick);

      // var node = battlefield.selectAll(".forcePlayer");

      // //alpha is the 'temperature' of the transition
      // //alpha is what slows it down, and eventually stops it
      // function tick(e) {
      //   var k = .1 * e.alpha;

      //   // Push nodes toward their designated focus.
      //   nodes.forEach(function(o, i) {
      //     o.y += (foci[o.id].y - o.y) * k;
      //   });

      //   node
      //       .attr("cy", function(d) { return d.y; });
      // }

      // nodes.push({id:0});
      // force.start();

      // node = node.data(nodes);

      // node.enter().append("circle")
      //     .attr("class", "node")
      //     .attr("cx", function(d) { return d.x; })
      //     .attr("cy", function(d) { return d.y; })
      //     .attr("r", 8)
      //     .style("fill", function(d) { return fill(d.id); })
      //     .style("stroke", function(d) { return d3.rgb(fill(d.id)).darker(2); })
      //     .call(force.drag);


      //non-force
      // var circleBounce = battlefield.selectAll('.player')
      //   .data(startingPosition2)
      //   .enter()
      //   .append('svg:circle')
      //   .attr('class', 'circleBounce')
      //   .attr('cx', function(d) { return d.x; })
      //   .attr('cy', function(d) { var currentY = d.y; return d.y; })
      //   .attr('r', function(d) { return d.r; })
      //   .style('fill', 'orange');

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

    //CHECK FOR COLLISIONS ON A FIXED INTERVAL
    collisionInterval = setInterval(function() {
      playerCoordinates();
      var boxNumber = Math.floor(playerPosition.x/boxWidth);
      var safeAreas = boxPositions[boxNumber];
      if(playerPosition.y > safeAreas[0] && playerPosition.y < safeAreas[0] + safeAreas[1]) {
        console.log('the player is safe');
      } else {
        console.log('out of bounds!');
        //stop all the intervals
        clearInterval(moveTimeout);
        clearInterval(collisionInterval);
        clearInterval(internalGravityInterval);
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

      //CREATE NEW POSITIONS FOR BOXES
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

  //start gravityInterval within the game
  var internalGravityInterval = gravityInterval();

  }

  //all logic for gravity
  var gravity = 0;
  var currentY = boardHeight/2;
  var gravityIntervalTime = 50;
  var gravityInterval = function() {
    return setInterval(function() {
      gravity--;
      var newY = [{x: boardWidth/2, y: currentY - gravity, r:25}];
      console.log('gravity', gravity);
      d3.selectAll('.player')
        .data(newY)
        .transition()
        .duration(gravityIntervalTime)
        .attr('cy', function(d) {return d.y;});
      console.log('player', d3.selectAll('.player'));
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
         console.log('heard the spacebar!');
         e.preventDefault();
         gravity = 20;
     } else {
         console.log('heard the other thing!');
     }
  }
  //Helper Functions:

})  ();




//gravity logic: 
// 1. probably still make it a d3 element for transitions
// 2. have a verticalSpeed variable. increase its negative velocity each 'tick'
// 3. when spacebar is pressed, set its verticalSpeed to +10 or something.
//     the increasing negative velocity of step 2 takes care of the rest



/*
  1. implement gravity
  2. reverse gravity temporarily on spacebar
  3. style so that background is constant, and each pipe is translucent
  4. find a bug to style the icon with
  5. adjust the game mechanics a bit to make it easier
      more room between tough pipes
      likely more friction to make the user move more slowly
*/


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
