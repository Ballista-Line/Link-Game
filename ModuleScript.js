// ModuleScript.js Tue.Apr.14.2015 Jaiden King
// This script houses many of the features that makes this game feel
// like a visual novel.

function setTextSpeed(speed) {
   if(speed < 0){ speed = 0; }
   else if(speed > 299) { speed = 299; }
   state.history[0].variables["textSpeed"] = speed;
}

function getTextSpeed() {
   return state.history[0].variables["textSpeed"];
}

// Prints a single letter at a time onto the screen, "recursively".
// place: I'm not sure, but it might be the html element into which we
//        are printing.
// str: The string to print
// i: The current letter to print.
function type(place, str, i) {
   text = str.slice(i-1, i);
   if (i == str.length+2) return;
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
      setTextSpeed(100);
   },
};

// Sets the $background_URL variable.
macros['setbackground'] = {
   handler: function(place, macroName, params, parser) {
      state.history[0].variables["background_URL"] = params[0];
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
      .children("#text_meter_inner").width(Math.max(300-getTextSpeed(),0));
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