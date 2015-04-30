// ModuleScript.js Tue.Apr.14.2015 Jaiden King
// This script houses many of the features that makes this game feel
// like a visual novel.
// 
// ALL EDITS SHOULD BE MADE TO THE SOURCE FILE, NOT THE TWINE PASSAGE

var rivalName = "Alastor";
var allyName = "Ian"
var audio = new Audio("");
var volume = 0.6;
var points = {"rival":0,"ally":0,"counselor":0};
var flags = {"f1":0,"f2":0,"f3":0,"f4":0};
var effectivePassage = "";
var currChar = ""; // the current character according to 'addcharacter'
var allEvents = [[]];
var availableEvents = [[]];
var IMGURL = "http://www.ballistaline.com/link-game/images/"

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

//http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

//http://stackoverflow.com/questions/143847/best-way-to-find-an-item-in-a-javascript-array
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
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
   return string.replace(new RegExp("%n",'g'),getPlayerName())
                .replace(new RegExp("%e",'g'),getPlayerElement())
                .replace(new RegExp("%ae",'g'),getOppositeElement(getPlayerElement()))
                .replace(new RegExp("%r",'g'),rivalName)
                .replace(new RegExp("%a",'g'),allyName);
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
   $(".background").attr("src",IMGURL+src);
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
// macros['setnext'] = {
//    handler: function(place, macroName, params, parser) {
//       setNextPassage(state.history[0].variables[params[0]]);// again the hack
//    }
// }

macros['toggleauto'] = {
   handler: function(place, macroName, params, parser) {
      toggleAuto();
   }
}

//This is called at the beginning to set the player's name
macros['setname'] = {
   handler:  function(place, macroName, params, parser) {
      setPlayerName(prompt("What is your name?","Julia"));
   }
}

macros['loadTitlescreen'] = {
   handler:  function(place, macroName, params, parser) {
      if(checkCookie("saveSlotauto")) {
         var saveData = getCookieObject("saveSlotauto");
         setVar("canContinue","true")
      }else{
         setVar("canContinue","false");
      }
      setVar("Day",1);
      setVar("Time",0);
   }
}

function loadGame(slot,place){
      var game = getCookieObject(slot);

      setPlayerName(game.name);
      
      setVar("Day",game.day);
      setVar("Time",game.gameTime);

      resetpoints();

      addpoints("rival",game.points.rival);
      addpoints("ally",game.points.ally);
      addpoints("counselor",game.points.counselor)

      availableEvents = game.events;
      
      state.display("EventSelection",place);
      
}

macros['loadgame'] = {
   handler: function(place, macroName, params, parser) {
      setTimeout(function(){loadGame("saveSlot"+params[0],place);},1);
   }
}

macros['savegame'] = {
   handler: function(place, macroName, params, parser) {
      // effectivePassage = getPassageTitle();
      // alert(effectivePassage);
      saveGame("saveSlotauto");
   }
}

function addCharacter(name){
   $("#characters").html("<img class='portrait' src='"+IMGURL+name+"' alt='"+name+"' />");
}

// Characters aren't being saved yet!
macros['addcharacter'] = {
   handler: function(place, macroName, params, parser) {
      currChar = params[0];
      addCharacter(params[0]);
   }
}

macros['playsound'] = {
   handler: function(place, macroName, params, parser) {
      audio.pause();
      audio = new Audio("http://www.ballistaline.com/link-game/sound/"+params[0]);
      audio.loop = true;
      audio.volume = volume;
      audio.play();
   }
}

//resets points AND flags
function resetpoints() {
   points.rival = 0;
   setVar("rprival",0);
   points.ally = 0;
   setVar("rpally",0);
   points.counselor = 0;
   setVar("rpcounselor",0);
   flags = {"f1":0,"f2":0,"f3":0,"f4":0};
   setVar("f1",0);
   setVar("f2",0);
   setVar("f3",0);
   setVar("f4",0);
}

macros['setflag'] = {
   handler: function(place, macroName, params, parser) {
      flags[params[0]] = parseInt(params[1]);
   }
}

macros['newgame'] = {
   handler: function(place, macroName, params, parser) {
      resetpoints();
   }
}

function addpoints(name,amount){
   points[name] += parseInt(amount);
   setVar("rp"+name,points[name]);
}

macros['addpoints'] = {
   handler: function(place, macroName, params, parser) {
      addpoints(params[0],params[1]);
   }
}

function saveGame(slot) {
   var date = new Date();
   var game = {
      "name": getPlayerName(),
      "points": points,
      "time": date.toString(),
      "day": getVar("Day"),
      "gameTime": getVar("Time"),
      "events": availableEvents
   }
   if(checkCookie(slot)&&slot!="saveSlotauto"){
      if(!confirm("Overwrite existing data in "+slot+"?")){
         return;
      }
   }
   setCookie(slot,JSON.stringify(game),100);
}

macros['previewslot'] = {
   handler: function(place, macroName, params, parser) {
      var text = "Empty";
      try{
         text = getCookieObject("saveSlot"+params[0]).time;
      }catch(e){}
      new Wikifier(place, text);
   }
}

macros['readysavepage'] = {
   handler: function(place, macroName, params, parser) {
      $(place).children("table").children("tr").children("td").children("#s1").click(function(){
         saveGame("saveSlot1");
         state.display("Save",place);
      });
      $(place).children("table").children("tr").children("td").children("#s2").click(function(){
         saveGame("saveSlot2");
         state.display("Save",place);
      });
   }
}
macros['readyloadpage'] = {
   handler: function(place, macroName, params, parser) {
      $(place).children("table").children("tr").children("td").children("#auto").click(function(){
         loadGame("saveSlotauto",place);
      });
      $(place).children("table").children("tr").children("td").children("#s1").click(function(){
         loadGame("saveSlot1",place);
      });
      $(place).children("table").children("tr").children("td").children("#s2").click(function(){
         loadGame("saveSlot2",place);
      });
   }
}

macros['advancetime'] = {
   handler: function(place, macroName, params, parser) {
      if(confirm("Are you sure you want to sit idly?")){
         var t = parseInt(getVar("Time"))+1;
         setVar("Time",t);
         var d = parseInt(getVar("Day"))+1;
         if(t>3){ d++; }
         updateAvailableEvents(d,t);
      }
   }
}

function showCons(dest,place,vis){
   var x;
   for (x in dest.day) {
      if(vis){
         $("#dom"+dest.day[x]).attr("src",IMGURL+"greenBox.png");
      }else{
         $("#dom"+dest.day[x]).attr("src",IMGURL+"spacer.png");
      }
   }
   for (x in dest.close) {
      if(vis){
         $("#img"+dest.close[x].y+"_"+dest.close[x].x).attr("src",IMGURL+"closeevent.png");
      }else{
         $("#img"+dest.close[x].y+"_"+dest.close[x].x).attr("src",IMGURL+"spacer.png");
      }
   }
   for (x in dest.open) {
      if(vis){
         $("#img"+dest.open[x].y+"_"+dest.open[x].x).attr("src",IMGURL+"openevent.png");
      }else{
         $("#img"+dest.open[x].y+"_"+dest.open[x].x).attr("src",IMGURL+"spacer.png");
      }
   }
   for (x in dest.time) {
      var id = "#tod"+(parseInt(x)+1);
      if(vis){
         if(dest.time[x]){
            $(id).show();
         }
      }else{
         $(id).hide();
      }
   }
   if(vis){
      $("#eventDesc").html(dest.desc);
   }else{
      $("#eventDesc").html("");
   }
}

function goToEvent(dest){
   if(include(dest.day,parseInt(getVar("Day"))) && dest.time[parseInt(getVar("Time"))]){
      if(confirm("Are you sure you want to do this event?")){
         state.display(dest.pass);
      }
   }else{
      alert("This event is not currently available.");
   }
}

macros['readyeventselection'] = {
   handler: function(place, macroName, params, parser) {
      $("#characters").html("");
      var d = parseInt(getVar("Day"));
      for(var r=0; r<32; r++){
         for(var i=0; i<32; i++){
            var x = i*32;
            var y = r*32+16*(i%2);
            var name = "spacer.png";
            if(r==16&&i==16&&d>1){
               name = "clock.png";
               dest = "DoNothing";
            }
            var id = r+"_"+i;
            try{
               if(availableEvents[r][i]!=null){
                  var dest = availableEvents[r][i];
                  if(dest.completed){
                     name = dest.img.replace(".","_.");
                  }else if(include(dest.day,d)){
                     name = dest.img;
                  }else{
                     name = "ball.png";
                  }
                  var str = "<img class='eb' style='top:"+y+"px;left:"+x+"px;' src='"+IMGURL+name+"' /><img id='img"+id+"' class='eb' style='top:"+y+"px;left:"+x+"px;' src='"+IMGURL+"spacer.png' />";
                  if(parseInt(getVar("Time"))<4&&!(dest.locked||dest.completed)){
                     str = "<a href='#' id='"+id+"'>" + str + "</a>";
                  }else if(dest.locked){
                     str = str + "<img class='eb' style='top:"+y+"px;left:"+x+"px;' src='"+IMGURL+"X.png' />";
                  }   
                  // if(!dest.locked){
                  //    str = str + "<img id='img"+r+"_"+c+"' class='eb' style='top:"+y+"px;left:"+x+"px;' src='IMGURLspacer.png' />";  
                  // }
                  $(place).children("#eventSelection").append(str);
                  (function(e){
                     $(place).children("#eventSelection").children("#"+id).click(function(){
                        goToEvent(e);
                     }).hover(function(){
                        showCons(e,place,true);
                     },function(){
                        showCons(e,place,false);
                     });
                  })(dest);
               }else{
                  throw "no event";
               }
            }catch(e){
               var str = "<img class='eb' style='top:"+y+"px;left:"+x+"px;' src='"+IMGURL+name+"' /><img id='img"+id+"' class='eb' style='top:"+y+"px;left:"+x+"px;' src='"+IMGURL+"spacer.png' />";
               if(name=="clock.png"&&parseInt(getVar("Time"))<4){
                  str = "<a href='#' onclick='state.display(\"DoNothing\");'>" + str + "</a>";
               }
               $(place).children("#eventSelection").append(str);
            }
            
         }
      }
      setTimeout(function(){
         $(place).children("#eventSelection").scrollTop(270);
         $(place).children("#eventSelection").scrollLeft(170);
      },1);
   }
}

function inGameDateStr() {
   var str = "";
   var d = parseInt(getVar("Day"));
   str += ordinal_suffix_of(d) + " ";
   switch(d%7){
      case 1: str+="(Sun)"; break;
      case 2: str+="(Mon)"; break;
      case 3: str+="(Tue)"; break;
      case 4: str+="(Wed)"; break;
      case 5: str+="(Thu)"; break;
      case 6: str+="(Fri)"; break;
      case 0: str+="(Sat)"; break;
   }
   return str;
}

macros['openevent'] = {
   handler: function(place, macroName, params, parser) {
      effectivePassage = getPassageTitle();
   }
}

macros['closeevent'] = {
   handler: function(place, macroName, params, parser) {
      for(var r=0;r<32;r++){        // these 32s shouldn't be hardcoded
         for(var c=0;c<32;c++){
            try{
               if(availableEvents[r][c].pass==effectivePassage){
                  availableEvents[r][c].completed = true;
                  var op;
                  for(op in availableEvents[r][c].open){
                     var coord = availableEvents[r][c].open[op];
                     openEvent(coord.x,coord.y);
                  }
                  for(op in availableEvents[r][c].close){
                     var coord = availableEvents[r][c].close[op];
                     availableEvents[coord.y][coord.x].locked = true;
                  }
               }
            }catch(e){}
         }   
      }
   }
}

macros['buildcalendar'] = {
   handler: function(place, macroName, params, parser) {
      var cal = $(place).children("#calendar");
      cal.children("#calInner").html(inGameDateStr());
      var d = parseInt(getVar("Day"));
      for(var row=0;row<6;row++){
         for(var col=0;col<7;col++){
            var id = row * 7 + col + 1;
            var $img = $('<img src="'+IMGURL+'spacer.png" style="width:12px;height:10px;position:fixed;top:'+(40+row*10)+'px;left:'+(313+col*12)+'px;" id="dom'+id+'"/>').appendTo(cal);
            if(id==d){
               var $img = $('<img src="'+IMGURL+'selectedDay.gif" style="width:12px;height:10px;position:fixed;top:'+(40+row*10)+'px;left:'+(313+col*12)+'px;" id="_dom'+id+'"/>').appendTo(cal);
            }
         }
      }
   }
}

macros['buildTOD'] = {
   handler: function(place, macroName, params, parser) {
      var t = parseInt(getVar("Time"));
      switch(t){
         case 0: $(place).children("#timeofday").css("background","url('"+IMGURL+"time_morning.png')"); break;
         case 1: $(place).children("#timeofday").css("background","url('"+IMGURL+"time_noon1.png')"); break;
         case 2: $(place).children("#timeofday").css("background","url('"+IMGURL+"time_noon2.png')"); break;
         case 3: $(place).children("#timeofday").css("background","url('"+IMGURL+"time_evening.png')"); break;
      }
   }
}



function newEvent(x,y,pass,desc,img,day,time,strong,close,open) {
   if(!allEvents[y]){ allEvents[y] = []; }
   allEvents[y][x] = {};
   allEvents[y][x]["pass"] = pass;
   allEvents[y][x]["img"] = img;
   allEvents[y][x]["day"] = day;
   allEvents[y][x]["time"] = time;
   allEvents[y][x]["strong"] = strong;
   allEvents[y][x]["locked"] = false;
   allEvents[y][x]["completed"] = false;
   allEvents[y][x]["visited"] = false;
   allEvents[y][x]["close"] = close;
   allEvents[y][x]["open"] = open;
   allEvents[y][x]["desc"] = desc;
   return allEvents[y][x];
}

function openEvent(x,y) {
   if(!availableEvents[y]){ availableEvents[y] = []; }
   availableEvents[y][x] = allEvents[y][x];
}

function buildAllEvents() {
   newEvent(14,16,"Other00","Prologue","other.png",[0,1],[true,true,true,true],false,[],[{x:19,y:16},{x:19,y:17}]);
   newEvent(19,16,"Nick00","I wonder what's going on at the PE field?","nick_ico.png",[2,3,4,5,6,7,8,9,10],[false,false,true,false],false,[{x:19,y:17}],[]);
   newEvent(19,17,"Nick01","I'll go wander around the seniors' lockers.","nick_ico.png",[2,3,4,5,6,7,8,9,10],[true,true,false,false],false,[{x:19,y:16}],[]);

   openEvent(14,16);
}

/* Build the out-of-passage html elements.
 */
function initialize() {
   $("body").append("<img class='background' />");
   $("body").append("<div id='textBox'></div>");
   $("body").append("<div id='speaker' class='stroke'></div>");
   $("body").append("<div id='characters'></div>");
   buildAllEvents();
}

initialize();
