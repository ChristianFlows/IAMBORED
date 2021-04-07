

var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var userSearchTerm = document.querySelector('#userSearchTerm');
var eventList =document.querySelector('#eventList');


function getIframe(lat, lon) {
	var url = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyA3_evQJhPJ4tmHpozf_Q1eqxhjLmTdTiE&center='+lat+','+lon+'&zoom=18&maptype=satellite';
	var result = document.getElementById("result");

    result.innerHTML = '<iframe id="event_iframe" title="iframe" width="300" height="200" src="'+url+'"></iframe>';
}
var eventLocator = function(userEntry) {
    // changed so that user can only enter a city

var eventLocator = function(userEntry) {
    // changed to so that user can only enter a city 
    //we can change this so the user enters a city and a state

    var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+ userEntry +'&size=100&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh';

    fetch(apiUrl).then(function(eventResponse){
            return eventResponse.json();

        })
        .then(function(eventResponse)
        {
            //this is to check if the user entered a city in the US 
            if(eventResponse.page.totalElements > 0)
            {
                displayEvents(eventResponse);
                
            }
            else if(eventResponse.page.totalElements === 0)
            {
                //this is the function that will display the error message if user enters something other than a city in the United States 
                errorFunc(eventResponse);
            }


            console.log(eventResponse);
            var lat = eventResponse._embedded.events[0]._embedded.venues[0].location.latitude;
            var lon = eventResponse._embedded.events[0]._embedded.venues[0].location.longitude;
            console.log('for google --->latitude:'+ lat + ' longitude:' + lon);

			getIframe(lat, lon);
            return 'https://www.google.com/maps/embed/v1/view?key=AIzaSyA3_evQJhPJ4tmHpozf_Q1eqxhjLmTdTiE&center='+ lat +','+ lon + '&zoom=18&maptype=satellite';
        })
     
    }



var formSubmitHandler = function(ev) 
{
    ev.preventDefault();
    
    var userEntry = ev.target.elements['userEntry'].value
    var userInput = userEntry.trim();

    //if they enter something other than a city, it needs to display a 404 message
    if(userInput)
    { eventLocator(userInput);}
    else{
        errorFunc(userInput);
    }

    clearForm();


}
userForm.addEventListener('submit', formSubmitHandler);

  
var displayEvents = function(eventData) 

{

    //removes search when right info is entered
    userForm.remove();
    eventInfo(eventData);
    //creating button option here
    createButtons();
    //if user likes the event this will run
    yesFunc();
    //if user does not like the event this will run
    noFunc(eventData);
}

function eventInfo(eventData)
{
     //api tm info start
     var random = Math.floor(Math.random()* eventData._embedded.events.length);
     //empty array to store the object 

    var eventObj = {
      eventImage: '<img src="'+ eventData._embedded.events[random].images[0].url + '"/><br>',
        eventName: eventData._embedded.events[random].name,
        eventLoc: '<br>Location: ' + eventData._embedded.events[random]._embedded.venues[0].name,
        eventAddress: ', '+ eventData._embedded.events[random]._embedded.venues[0].address.line1 + ' ' + eventData._embedded.events[random]._embedded.venues[0].city.name + ' ' + eventData._embedded.events[random]._embedded.venues[0].state.stateCode,
        eventDate: '<br>Date: '+ eventData._embedded.events[random].dates.start.localDate + '<br>',
        buyTickets: '<br>Buy tickets here: <a href="'+eventData._embedded.events[random].url+'">' + eventData._embedded.events[random].url + '</a>'
     //adding variable to display
     }
     var eventInfo = eventObj.eventImage + eventObj.eventName + eventObj.eventLoc+ eventObj.eventAddress + eventObj.eventDate;

     //api tm end 

     //adding to html element #eventList
    eventList.innerHTML = eventInfo;

    //store data in localStorage
    localStorage.setItem('event', JSON.stringify(eventObj));
}


function clearForm()
{
    var form = document.getElementById('userForm');
    form.reset();
}

function createButtons()
{
     //Yes button
     var yesBtn = document.createElement('button');
     var noBtn = document.createElement('button');
     yesBtn.textContent = 'I will go!';
     yesBtn.setAttribute('id', 'yes');
     yesBtn.setAttribute('class', 'inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500');
     //No Button
     noBtn.textContent = 'Not Interested!';
     noBtn.setAttribute('id', 'no');
     noBtn.setAttribute('class', 'inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500');
     //appending it to event id html element
     eventList.append(yesBtn);
     eventList.append(noBtn); 

}

//This is the function for if the the user likes the event 

function yesFunc()
{

      var yes = document.getElementById('yes');
      yes.addEventListener('click', function()
      {
          eventList.innerHTML = ' ';
          var eventObj = JSON.parse(localStorage.getItem('event'));
          console.log('Event called again:');
          console.log(eventObj);
          eventList.innerHTML = eventObj.eventImage + eventObj.eventName + eventObj.eventLoc + eventObj.eventAddress + eventObj.eventDate + eventObj.buyTickets;

          var map = document.getElementById('mapThing');
          map.innerHTML = '<br><br><span> Google Map Here </span>';
          eventList.append(map);
      })
}


//this is the function if the user does not like the event
function noFunc(eventData)
{
    var no = document.getElementById('no');
     no.addEventListener('click', function()
     {
         eventList.innerHTML = ' ';
         eventInfo(eventData);
         createButtons();
         yesFunc();
         noFunc(eventData);
     })
}


function errorFunc()
{
    //this is can be decorated with CSS tailwind with however you like
    //I just did this for now 
    eventList.setAttribute('class', 'errorBox');
    eventList.innerHTML = 'Please enter a city in the United States';
}

