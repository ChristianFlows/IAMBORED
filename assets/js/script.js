
var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var userSearchTerm = document.querySelector('#userSearchTerm');
var eventList =document.querySelector('#eventList');




var eventLocator = function(userEntry) {
    // changed to so that user can only enter a city 

    var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+ userEntry +'&size=100&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh';

    fetch(apiUrl).then(function(eventResponse){
            return eventResponse.json();

        })
        .then(function(eventResponse)
        {
            //this is to check if the user entered a city in the US 
            if(eventResponse.page.totalElements > 0)
            {
    
                randomEvent(eventResponse);
                console.log(eventResponse);

            }
            else if(eventResponse.page.totalElements === 0)
            {
                //this is the function that will display the error message if user enters something other than a city in the United States 
                errorFunc(eventResponse);
            }

        })
    
    
    }



var formSubmitHandler = function(ev) 
{
    ev.preventDefault();
    
    var userEntry = ev.target.elements['userEntry'].value
    var userInput = userEntry.trim();

    
	if(userInput)
    { eventLocator(userInput);}
    else{
        alert('Please input a city!!');
    }

    clearForm();


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
          var lat = JSON.parse(eventObj.lat);
          var lon = JSON.parse(eventObj.lon);

      })
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


function errorFunc()
{
    //this is can be decorated with CSS tailwind with however you like
    //I just did this for now 
    eventList.setAttribute('class', 'errorBox');
    eventList.innerHTML = 'Please enter a city in the United States';
}