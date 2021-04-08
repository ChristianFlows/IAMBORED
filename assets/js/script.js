
var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var userSearchTerm = document.querySelector('#userSearchTerm');
var eventList =document.querySelector('#eventList');




var eventLocator = function(userCity, userState) {
    //cpagan-->user will be able to enter city and state only in the usa
    var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+ userCity +'&stateCode='+ userState +'&size=100&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh';

    fetch(apiUrl).then(function(eventResponse){
            return eventResponse.json();

        })
        .then(function(eventResponse)
        {
            //cpagan-->this is to check if the user entered a city in the US 
            if(eventResponse.page.totalElements > 0)
            {
                //cpagan-->random number picked for TM api array
                //randomEvent(eventResponse);
                console.log(eventResponse);

            }
            else if(eventResponse.page.totalElements === 0)
            {
                //cpagan--> modal will pop up if user enters wrong information
                console.log('no results');
            }

        })
    
    
    }



var formSubmitHandler = function(ev) 
{
    ev.preventDefault();
    //cpagan->this is for the autofill functions used with google maps
    var userEntry = ev.target.elements['userEntry'].value;
    var userEntry = userEntry.split(',');
    var userCity = userEntry[0];
    var userState = userEntry[1];
    
    if(userCity, userState){
    eventLocator(userCity, userState);
    }

    /*clearForm();*/


}
userForm.addEventListener('submit', formSubmitHandler);


var randomEvent = function(eventData)
{
    var random = Math.floor(Math.random()* eventData._embedded.events.length);
    displayEvents(eventData, random);
}


var displayEvents = function(eventData, random) 

{

    //removes search when right info is entered
    userForm.remove();

   var eventObj = {
     eventImage: '<img src="'+ eventData._embedded.events[random].images[0].url + '"/><br>',
       eventName: eventData._embedded.events[random].name,
       eventLoc: '<br>Location: ' + eventData._embedded.events[random]._embedded.venues[0].name,
       eventAddress: ', '+ eventData._embedded.events[random]._embedded.venues[0].address.line1 + ' ' + eventData._embedded.events[random]._embedded.venues[0].city.name + ' ' + eventData._embedded.events[random]._embedded.venues[0].state.stateCode,
       eventDate: '<br>Date: '+ eventData._embedded.events[random].dates.start.localDate + '<br>',
       buyTickets: '<br><button><a href="'+eventData._embedded.events[random].url+'">Buy Tickets Here! Click Me!</a></button>',
       lon: eventData._embedded.events[random]._embedded.venues[0].location.longitude,
       lat: eventData._embedded.events[random]._embedded.venues[0].location.latitude
    //adding variable to display
    }
    var eventInfo = eventObj.eventImage + eventObj.eventName + eventObj.eventLoc+ eventObj.eventAddress + eventObj.eventDate;

    //api tm end 

    //adding to html element #eventList
   eventList.innerHTML = eventInfo;

   //store data in localStorage
   localStorage.setItem('event', JSON.stringify(eventObj));
    //
    //creating button option here
    createButtons();
    //if user likes the event this will run
    yesFunc();
    //if user does not like the event this will run
    noFunc(eventData);
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
	eventList.setAttribute('class', 'border border-gray-200 rounded-full p-4 outline-none');

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
          var lat = eventObj.lat;
          var lon = eventObj.lon;
       
        getIframe(lat,lon);

      })
}

//INAWISE MAP ADDED ON I WILL GO BUTTON

function getIframe(lat, lon) {
    console.log(lat,lon);
	var url = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyA3_evQJhPJ4tmHpozf_Q1eqxhjLmTdTiE&center='+lat+','+lon+'&zoom=18&maptype=satellite';
	var result = document.getElementById("result");
    result.innerHTML = '<iframe id="event_iframe" title="iframe" width="450" height="300" src="'+url+'"></iframe>';
	result.setAttribute('class', 'border border-gray-200 rounded-full p-4 outline-none');
}

//this function is if the user does not like the event

function noFunc(eventData)
{
    var no = document.getElementById('no');
     no.addEventListener('click', function()
     {
         eventList.innerHTML = ' ';
         randomEvent(eventData);

         noFunc(eventData);
     })
}


