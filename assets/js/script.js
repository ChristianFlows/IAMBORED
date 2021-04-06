
var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var eventList =document.querySelector('#eventList');


var eventLocator = function(userEntry) {
    // changed to so that user can only enter a city 
    var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?city='+ userEntry +'&size=10&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh';

    fetch(apiUrl).then(function(eventResponse){
            return eventResponse.json();

        })
        .then(function(eventResponse)
        {
            displayEvents(eventResponse);

            console.log(eventResponse);
            var lat = eventResponse._embedded.events[0]._embedded.venues[0].location.latitude;
            var lon = eventResponse._embedded.events[0]._embedded.venues[0].location.longitude;
            console.log('for google --->latitude:'+ lat + ' longitude:' + lon);

            return 'https://www.google.com/maps/embed/v1/view?key=AIzaSyA3_evQJhPJ4tmHpozf_Q1eqxhjLmTdTiE&center='+ lat +','+ lon + '&zoom=18&maptype=satellite';
        })

        .then(function(mapResponse){
            return mapResponse.json();
        })

        .then(function(mapResponse){

            //need something here to see it on the webpage
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






var displayEvents = function(eventData) 
{
    var display = document.createElement('span');
    
    var random = Math.floor(Math.random()* eventData._embedded.events.length);
    var eventImage = eventData._embedded.events[random].images[0].url;

    var eventInfo = '<img src="'+ eventImage+'"/><br>'+ eventData._embedded.events[random].name + '<br>Location: ' + eventData._embedded.events[random]._embedded.venues[0].name+', '+ eventData._embedded.events[random]._embedded.venues[0].address.line1+ ' ' 
    + eventData._embedded.events[random]._embedded.venues[0].city.name + ' ' + eventData._embedded.events[random]._embedded.venues[0].state.stateCode
      + '<br>Date: '+ eventData._embedded.events[random].dates.start.localDate;
    display.innerHTML = eventInfo;
    eventList.innerHTML = eventInfo;
 

}

function clearForm()
{
    var form = document.getElementById('userForm');
    form.reset();
}