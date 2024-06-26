/*
Marionette
By Juhyun Kim (jkim1471@gmail.com)
*/
function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  // changes speed
  var slider1 = document.getElementById('slider1');
  slider1.value = 1;
  var deg = 60;
  var direction = 1;

  function draw(){
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    var speed = slider1.value;
    var s1 = deg * Math.PI/180;  // angle controller for stick 1
    var s2 = -deg * Math.PI/180; // for stick 2

    // draw control sticks
    function DrawStick(color, width) {
      // draw stick
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = 15;
      context.moveTo(-width/2, 0);
      context.lineTo(width/2, 0);
      context.closePath();
      context.stroke(); 
    }

    function DrawMiddleString(color, length){
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = 8;
      context.moveTo(0, 0);
      context.lineTo(0, length);
      context.closePath();
      context.stroke(); 
    }
    
    function DrawPart(dx, theta, length, isLeft, isLeg){
      // draw string
      context.scale(isLeft, 1);
      context.translate(dx, 0);
      context.rotate(theta);
      context.beginPath();
      context.strokeStyle = 'black';
      context.lineWidth = 8;
      context.moveTo(0, 0);
      context.lineTo(0, length);
      context.closePath();
      context.stroke();
      context.save();

      // draw lower arm/leg
      context.translate(0, length);
      context.scale(-1, -1);
      context.rotate(theta - Math.PI/4);
      context.beginPath();
      context.fillStyle = 'blue';
      context.rect(0, 0, limbW, limbH);
      context.closePath();
      context.fill();
      
      // draw hand/foot
      context.beginPath();
      context.strokeStyle = 'blue';
      context.arc(limbW/2, -limbW/2, 15, 0, 2 * Math.PI);
      context.closePath();
      context.fill();
      

      // draw upper arm/leg
      context.translate(0,limbH);
      context.beginPath();
      context.moveTo(limbW/2,0);
      context.restore();
      context.restore(); // back to unrotated stick dimension
      context.lineTo(-bodyW/2 * isLeft, 200 + isLeg * bodyH);
      context.closePath();
      context.lineWidth = 20;
      context.strokeStyle = 'blue';
      context.stroke();
    }

    // draw head and body (only moves up and down)
    function DrawHeadBody(strLen){
      let rY = headSize;
      context.beginPath();
      context.fillStyle = 'green';
      context.ellipse(0, strLen + rY, 2 * rY / 3, rY, 0, 0, 2 * Math.PI);
      context.rect(-bodyW/2, strLen + 2 * rY, bodyW, bodyH);
      context.closePath();
      context.fill();
    }
    
    

    /*** PUTTING TOGETHER***/
    var stickWidth = 140;
    var limbW = 20;
    var limbH = 70;
    var bodyW = 100;
    var bodyH = 3 * bodyW / 2;
    var headSize = 50;

    context.translate(200,50);
    DrawMiddleString('black', 100); // draw middle line
    DrawHeadBody(100);
    context.save(); // unrotated stick
  
    // draw first stick
    context.rotate(s1);
    DrawStick('brown', stickWidth);
    // left arm
    DrawPart(-stickWidth/2, -s1, 300, 1, 0);
    context.save();
    // right arm
    context.rotate(s1);
    DrawPart(-stickWidth/2, s1, 300, -1, 0);
    context.save();

    // draw second stick
    context.rotate(s2);
    DrawStick('brown', stickWidth);
    // left leg
    DrawPart(-stickWidth/2, -s2, 450, 1, 1);
    context.save();
    // right leg
    context.rotate(s2);
    DrawPart(-stickWidth/2, s2, 450, -1, 1);
    context.restore(); // back to original canvas
    
    // controls speed and animation
    if(deg > 60) deg = 60;
    else if (deg < -60) deg = -60;
    if(Math.abs(deg) >= 60) direction *= -1;
    deg += direction * speed;
    console.log('deg = ', deg);
    window.requestAnimationFrame(draw);
  }

  window.requestAnimationFrame(draw);
}
window.onload = setup;