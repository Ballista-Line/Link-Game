// ModuleScript.js Tue.Apr.14.2015 Jaiden King
// This script houses many of the features that makes this game feel
// like a visual novel.
// 
// ALL EDITS SHOULD BE MADE TO THE SOURCE FILE, NOT THE TWINE PASSAGE

var rivalName = "Alastor"

// The following 3 functions are from w3schools.com
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// Modified from the w3schools version
function checkCookie(cname) {
    return (getCookie(cname) != "");
}

function deleteCookie(cname){
   setCookie(cname, "", -10);
}

function getCookieObject(cname){
   return JSON.parse(getCookie(cname));
}

function setCookieObject(cname, obj, exdays) {
   setCookie(cname, JSON.stringify(obj), exdays);
}

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

function getPlayerName() {
   return state.history[0].variables["PlayerName"];
}

function setPlayerName(name) {
   state.history[0].variables["PlayerName"] = name;
}

function getSpeaker() {
   return state.history[0].variables["Speaker"];
}

function setSpeaker(name) {
   state.history[0].variables["Speaker"] = filter(name);
   $("#speaker").html(getSpeaker());
}

function setVar(name, value) {
   state.history[0].variables[name] = value;
}

function getVar(name) {
   return state.history[0].variables[name];
}

function getPlayerElement() {
   return state.history[0].variables["trainingElement"];
}

function getOppositeElement(e) {
   switch(e){
      case "Fire": return "Water";
      case "Water": return "Fire";
      case "Earth": return "Air";
      case "Air": return "Earth";
      case "Light": return "Darkness";
      case "Darkness": return "Light";
   }
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

// Filters out flags from a string and replaces them with appropriate values
function filter(string) {
   return string.replace("%n",getPlayerName())
                .replace("%e",getPlayerElement())
                .replace("%ae",getOppositeElement(getPlayerElement()))
                .replace("%r",rivalName);
}

// This is the name of the passage when typing begins.
var s;
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
      s=getPassageTitle();
      type(place,
         filter(state.history[0].variables[params[0]]),//this is a hack. Idk why 
                                               //the value isn't being
                                               //passed.
         1);
   },
   init: function() {
      // Sets the default text speed
      setTextSpeed(30);
      setAutoInterval(3000);
      setAuto(false);
   },
};

function setBackgroundSrc(src) {
   $(".background").attr("src","http://www.ballistaline.com/link-game/images/"+src);
}

// Sets the $background_URL variable.
macros['setbackground'] = {
   handler: function(place, macroName, params, parser) {
      // state.history[0].variables["background_URL"] = params[0];
      setVar("background",params[0]);
      setBackgroundSrc(params[0]);
   }
}

// Sets the name of the current speaker.
macros['setspeaker'] = {
   handler: function(place, macroName, params, parser) {
      setSpeaker(filter(params[0]));
   }
}

function showDialogue(state) {
   if(state){ $("#textBox").show(); setVar("showdialogue",true); }
   else{      $("#textBox").hide(); setVar("showdialogue",false); }
}

macros['showdialogue'] = {
   handler: function(place, macroName, params, parser) {
      if(params[0]=="true"){ showDialogue(true); }
      else{                  showDialogue(false); }
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

//This is called at the beginning to set the player's name
macros['setname'] = {
   handler:  function(place, macroName, params, parser) {
      setPlayerName(prompt("What is your name?","Leeroy"));
   }
}

macros['loadTitlescreen'] = {
   handler:  function(place, macroName, params, parser) {
      if(checkCookie("saveSlot1")) {
         var saveData = getCookieObject("saveSlot1");
         setVar("canContinue","true")
      }else{
         setVar("canContinue","false");
      }
   }
}

macros['loadgame'] = {
   handler: function(place, macroName, params, parser) {
      setTimeout(function(){
         var game = getCookieObject("saveSlot1");
         
         setSpeaker(game.speaker);

         setBackgroundSrc(game.background);
         setVar("background",game.background);
         
         showDialogue(game.showdialogue);
         
         setPlayerName(game.name);
         
         setVar("trainingElement",game.element);
         
         state.display(game.passage,place);
      },1);
   }
}

macros['savegame'] = {
   handler: function(place, macroName, params, parser) {
      saveGame("saveSlot1");
   }
}

// Characters aren't being saved yet!
macros['addcharacter'] = {
   handler: function(place, macroName, params, parser) {
      $("#characters").html("<img class='portrait' src='http://www.ballistaline.com/link-game/images/"+params[0]+"' alt='"+params[0]+"' />");
   }
}

function saveGame(slot) {
   var game = {
      "speaker": getSpeaker(),
      "background": getVar("background"),
      "passage": getPassageTitle(),
      "name": getPlayerName(),
      "element": getPlayerElement(),
      "showdialogue": getVar("showdialogue")
   }
   setCookie(slot,JSON.stringify(game),100);
}

/* Build the out-of-passage html elements. If you have a saved game, also
 * enables the continue button.
 */
function initialize() {
   $("body").append("<img class='background' />");
   $("body").append("<div id='textBox'></div>");
   $("body").append("<div id='speaker' class='stroke'></div>");
   $("body").append("<div id='characters'></div>")
}

initialize();
