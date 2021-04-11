
var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var userSearchTerm = document.querySelector('#userSearchTerm');
var eventList =document.querySelector('#eventList');
var result = document.getElementById("result");




var eventLocator = function(userCity, userState) {
    //cpagan-->user will be able to enter city and state only in the usa
    var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+ userCity +'&stateCode='+ userState +'&size=200&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh';

    fetch(apiUrl).then(function(eventResponse){
            return eventResponse.json();

        })
        .then(function(eventResponse)
        {
            //cpagan-->this is to check if the user entered a city in the US 
            if(eventResponse.page.totalElements > 0)
            {
                //cpagan-->random number picked for TM api array
                eventType.remove();
                randomEvent(eventResponse);
                console.log(eventResponse);

            }
            else if(eventResponse.page.totalElements === 0)
            {
                //cpagan--> modal will pop up if user enters wrong information
                noResults(eventResponse);
            }


        })
    
    
    }


//cpagan--> after user inputs in search it will run here
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
    else {
        noResults();
    }

    clearForm();


}
userForm.addEventListener('submit', formSubmitHandler);



var randomEvent = function(eventData)
{
    var random = Math.floor(Math.random()* eventData._embedded.events.length);
    //console.log('random #===>', random);
    displayEvents(eventData, random);
}

//cpagan==>clearing form after search is clicked 
function clearForm()
{
    var form = document.getElementById('userForm');
    form.reset();
}

//cpagan==> buttons for user choice 
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

//cpagan==> displaying event option on eventList
var displayEvents = function(eventData, random) 

{
    userForm.remove();

    //cpagan415==>object created for localStorage, please add addition info to this object if needed
   var eventObj = {
     eventImage: '<img src="'+ eventData._embedded.events[random].images[0].url + '"/><br>',
       eventName: eventData._embedded.events[random].name,
       eventLoc: '<br>Location: ' + eventData._embedded.events[random]._embedded.venues[0].name,
       eventAddress: ', '+ eventData._embedded.events[random]._embedded.venues[0].address.line1 + ' ' + eventData._embedded.events[random]._embedded.venues[0].city.name + ' ' + eventData._embedded.events[random]._embedded.venues[0].state.stateCode,
       eventDate: '<br>Date: '+ eventData._embedded.events[random].dates.start.localDate + '<br>',
       buyTickets: '<br><button class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"><a href="'+eventData._embedded.events[random].url+'" target="_blank" rel="noreferrer noopener">Buy Tickets Here!</a></button>',
       lon: eventData._embedded.events[random]._embedded.venues[0].location.longitude,
       lat: eventData._embedded.events[random]._embedded.venues[0].location.latitude,
       pleaseNote: eventData._embedded.events[random].pleaseNote,
       healthCheck: eventData._embedded.events[random].ticketing
    //healthCheck: eventData._embedded.events[random].ticketing.healthCheck.description
   
    }
    //adding variable to display
    var eventInfo = eventObj.eventImage + eventObj.eventName + eventObj.eventLoc+ eventObj.eventAddress + eventObj.eventDate;

    //api tm end 

   eventList.innerHTML = eventInfo;

   //cpagan==>setting and getting for localStorage
   localStorage.setItem('event', JSON.stringify(eventObj));
   var eventObj = JSON.parse(localStorage.getItem('event'));
 
    createButtons();
    //if user likes the event this will run
    yesFunc(eventObj);
    //if user does not like the event this will run
    noFunc(eventData);
}


//cpagan==> is the function for if the the user likes the event 

function yesFunc(eventObj)
{

      var yes = document.getElementById('yes');
      yes.addEventListener('click', function()
      {
          eventList.innerHTML = ' ';

          console.log('Local Storage:');
          console.log(eventObj);
          eventList.innerHTML = eventObj.eventImage + eventObj.eventName + eventObj.eventLoc + eventObj.eventAddress + eventObj.eventDate + eventObj.buyTickets + '<br><br><br>';
          var lat = eventObj.lat;
          var lon = eventObj.lon;
       
        getIframe(lat,lon);

        //cpagan==> added the following so it would post special notices by the venue
        additionalInfo(eventObj);

      })
}

//cpagan==> this function is if the user does not like the event

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

//INAWISE MAP ADDED ON I WILL GO BUTTON

function getIframe(lat, lon) {
    console.log(lat,lon);
	var url = 'https://www.google.com/maps/embed/v1/view?key=AIzaSyA3_evQJhPJ4tmHpozf_Q1eqxhjLmTdTiE&center='+lat+','+lon+'&zoom=18&maptype=satellite';
    result.innerHTML = '<iframe id="event_iframe" title="iframe" width="450" height="300" src="'+url+'"></iframe>';
	//updated for I WILL GO btn Map pop up -Landon
	result.setAttribute('class', 'rounded-lg bg-gray-50 p-4 outline-none');
}
}


    //cpagan==> this is for COVID messages, either cancellation of events, or health check messages
    //please make this look better with CSS if possible
function additionalInfo(eventObj)
{

    eventList.append('Special Notice: ');

    if(eventObj.pleaseNote){
    eventList.append(eventObj.pleaseNote);
   
    }
    else if (eventObj.healthCheck)
    {
      eventList.append(eventObj.healthCheck);
    }
    else{
        eventList.append('No Additional Notices');
    }

}



//cpagan--> error modal pops up if there are no results for their search
function noResults() {

    var modal = document.createElement('div');
    modal.setAttribute('class', 'modal');

    var modalContent = document.createElement('div');

    var modalP = document.createElement('p');
    modalP.setAttribute('id','modalP');
    modalP.textContent = 'No Results. Try Again';

    modal.appendChild(modalContent);
    modalContent.appendChild(modalP);
    document.body.appendChild(modal);

    document.onclick = function(){
        modal.remove();
    }

}
