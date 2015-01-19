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

//create a row of boxes on the top and bottom


//create a user, controllable by dragging

//check for collisions of the user and the boxes

//move the boxes on a fixed interval

//make the boxes different heights
  //make the box heights make sense transitioning from one to the other
  //make the game progressively more difficult
  //

//let the user use the space bar to control the bug
  //implement gravity

//extra credit:
  //MAKE IT MOBILE!!
    //wrap it in ionic

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
