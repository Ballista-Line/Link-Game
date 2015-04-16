// ModuleScript.js Tue.Apr.14.2015 Jaiden King
// This script houses many of the features that makes this game feel
// like a visual novel.

function setTextSpeed(speed) {
   if(speed < 0){ speed = 0; }
   else if(speed > 149) { speed = 149; }
   state.history[0].variables["textSpeed"] = speed;
}

function getTextSpeed() {
   return state.history[0].variables["textSpeed"];
}

function setAutoInterval(time) {
   if(time < 0){ time = 0; }
   else if(time > 5000) { time = 5000; }
   state.history[0].variables["autoInterval"] = time;
}

function getAutoInterval() {
   return state.history[0].variables["autoInterval"];
}

function getPassageTitle() {
   return state.history[0].passage.title;
}

function getNextPassage() {
   return state.history[0].variables["nextPassage"];
}

function setNextPassage(name) {
   state.history[0].variables["nextPassage"] = name;
}

function isAuto() {
   return state.history[0].variables["autoAdvance"];
}

function setAuto(val) {
   state.history[0].variables["autoAdvance"] = val;
}

function toggleAuto() {
   setAuto(!isAuto());
}

// Prints a single letter at a time onto the screen, "recursively". If
// the text is set to "auto advance" then it will automatically advance
// to the next dialogue, under standard conditions.
// place: I'm not sure, but it might be the html element into which we
//        are printing.
// str: The string to print
// i: The current letter to print.
function type(place, str, i) {
   text = str.slice(i-1, i);
   if (i == str.length+1) {
               // alert("SDF");
      if(isAuto()){
         var s=getPassageTitle();
         setTimeout(function(){
            if(getPassageTitle()==s){
               state.display(getNextPassage(),place)
            }
         },getAutoInterval());
      }
      return;
   }
   new Wikifier(place, text);
   //type(place,str,i+1);
   setTimeout(function(){type(place,str,i+1);},getTextSpeed());
}

macros['type'] = {
   handler: function(place, macroName, params, parser) {
      type(place,
         state.history[0].variables[params[0]],//this is a hack. Idk why 
                                               //the value isn't being
                                               //passed.
         1);
   },
   init: function() {
      // Sets the default text speed
      setTextSpeed(50);
      setAutoInterval(3000);
      setAuto(false);
   },
};

// Sets the $background_URL variable.
macros['setbackground'] = {
   handler: function(place, macroName, params, parser) {
      // state.history[0].variables["background_URL"] = params[0];
      $(".background").attr("src","http://www.ballistaline.com/link-game/images/"+params[0]);
   },
   init: function() {
      $("body").append("<img class='background' />");
   }
}

// Sets the name of the current speaker.
macros['setspeaker'] = {
   handler: function(place, macroName, params, parser) {
      state.history[0].variables["speaker"] = params[0];
   }
}

// Sets the slider/guage to represent the current text speed. Used on
// the settings page.
function updateTextSpeedSlider(place) {
   $(place).children("#text_meter_outer")
      .children("#text_meter_inner").width(Math.max(300-getTextSpeed()*2,0));
}
function updateAutoDelaySlider(place) {
   $(place).children("#auto_meter_outer")
      .children("#auto_meter_inner").width(Math.max(getAutoInterval()/5000*300,0));
}

macros['adjust_text_speed'] = {
   handler: function(place, macroName, params, parser) {
      $(place).children("#text_up").click(function(){
         setTextSpeed(getTextSpeed()-5);
         updateTextSpeedSlider(place);
      })
      $(place).children("#text_down").click(function(){
         setTextSpeed(getTextSpeed()+5);
         updateTextSpeedSlider(place);
      })
      updateTextSpeedSlider(place);
   }
}

macros['adjust_auto_speed'] = {
   handler: function(place, macroName, params, parser) {
      $(place).children("#auto_up").click(function(){
         setAutoInterval(getAutoInterval()+250);
         updateAutoDelaySlider(place);
      })
      $(place).children("#auto_down").click(function(){
         setAutoInterval(getAutoInterval()-250);
         updateAutoDelaySlider(place);
      })
      updateAutoDelaySlider(place);
   }
}

// Sets the next passage
macros['setnext'] = {
   handler: function(place, macroName, params, parser) {
      setNextPassage(state.history[0].variables[params[0]]);// again the hack
   }
}

macros['toggleauto'] = {
   handler: function(place, macroName, params, parser) {
      toggleAuto();
   }
}