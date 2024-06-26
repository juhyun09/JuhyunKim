/**
 *  Author: Juhyun Kim (jkim1471@gmail.com)
 * 
 * This creates 3d cubic illustration by just using the 2d coordinate system.
 * The coordinates of vertcies were calculated by using the parametric equation of an ellipse.
 * This allows to rotate the cube in x and y direction by using 2 sliders.
 */

function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  var slider2 = document.getElementById('slider2');
  slider2.value = 0;
  var two_colors = ["orange", "green"];            // colors for the sides
  var track_b = 0;                                 // tracks the value of variable b in draw function
  
  function draw(){
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    // use the sliders to get various parameters
    var t = slider1.value * Math.PI / 180; // turn into radians
    var a = 150;                           // radius of ellipse in x direction
    var b = slider2.value;                 // radius of ellipse in y direction
    // change in b allows to change the perspective in y direction
    
    if(b == 0) b = 0.001;                  // prevent y being equal to 0

    var x, y;
    var coords = []; // store the coordinates used in top and bottom portion

    function DrawSquare(color, height){  
      context.beginPath();
      context.fillStyle = color;
      x = a * Math.cos(t);
      y = b * Math.sin(t) + height;
      // round the coordinate to 3 decimal point 
      // prevent incorrect sorting when calculation error occurs
      x = Math.round(x * 1000) / 1000;
      y = Math.round(y * 1000) / 1000;
      coords.push([x, y]);
      context.moveTo(x, y);
      // create edges
      for(let i = 1; i < 4; i++){
        x = a * Math.cos(t + i*Math.PI/2);
        y = b * Math.sin(t + i*Math.PI/2) + height;
        x = Math.round(x * 1000) / 1000;
        y = Math.round(y * 1000) / 1000;
        coords.push([x, y]);
        context.lineTo(x, y);
      }
      context.closePath();
      context.fill();
    }

    function DrawSides(){
      /* 
        citation: https://stackoverflow.com/questions/16096872/how-to-sort-2-dimensional-array-by-column-value
        sortFuntion sorts the coordinates by the y values so that
        I can create the sides by connecting the lines in a specific order.
      */
      coords.sort(sortFunction);

      function sortFunction(m, n) {
        if (m[1] === n[1]) {
            return (m[0] < n[0]) ? 1 : -1; // with same y coord, sort by x
        }
        else {
          if(b > 0)
            return (m[1] < n[1]) ? 1 : -1;
          else
            return (m[1] > n[1]) ? 1 : -1;
        }
      }
      
      // the issue with the nested if statement is that 
      // when t stays the same on 90n degere,
      // the color switches continuously when only b changes
      // by tracking the change in b, it prevents the color switching
      if(track_b == b)
      //var two_colors = ["orange", "green"];
      // switches the order of colors so it looks like the sides are turing continuously
        if(t*180/Math.PI % 90 == 0) 
          two_colors = [two_colors[1], two_colors[0]];
      track_b = b;
      
      // build 2 sides
      for(let i = 0; i < 2; i++){
        context.beginPath();
        context.fillStyle = two_colors[i];
        context.moveTo(coords[i+1][0], coords[i+1][1]);
        context.lineTo(coords[3][0], coords[3][1]);
        context.lineTo(coords[7][0], coords[7][1]);
        context.lineTo(coords[i+5][0], coords[i+5][1]);
        context.closePath();
        context.fill();
        
      }

      /*
      Checks how the coordinates the sorted
      for(let i = 0; i < coords.length; i++){
        context.beginPath();
        context.fillStyle = "black";
        context.font = "20px serif";
        context.fillText(i, coords[i][0], coords[i][1]);
        context.closePath();
      }*/
    }

    context.save();
    context.translate(200,200);
    console.log("t = ", t * 180 / Math.PI);
    DrawSquare("red", -75);
    DrawSquare("purple", 75);
    DrawSides();
    context.restore();
  }

  slider1.addEventListener("input",draw);
  slider2.addEventListener("input",draw);
  draw();
}
window.onload = setup;