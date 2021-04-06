
var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var eventList =document.querySelector('#eventList');

var eventLocator = function(userEntry) {
    // can only operate by keyword at the moment, we may have to change this to add more parameters the user can search with
    var apiUrl = "https://app.ticketmaster.com/discovery/v2/events?keyword=" + userEntry + "&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh&locale=*";

    fetch(apiUrl).then(function(eventResponse){
            return eventResponse.json();

        })
        .then(function(eventResponse)
        {
            displayEvents(eventResponse);

            console.log(eventResponse);
            var lat = eventResponse._embedded.events[0]._embedded.venues[0].location.latitude;
            var lon = eventResponse._embedded.events[0]._embedded.venues[0].location.longitude;
            console.log(lat);
            console.log(lon);

            return 'https://www.google.com/maps/embed/v1/view?key=AIzaSyA3_evQJhPJ4tmHpozf_Q1eqxhjLmTdTiE&center='+ lat +','+ lon + '&zoom=18&maptype=satellite';
        })

        .then(function(mapResponse){
            return mapResponse.json();
        })

        .then(function(mapResponse){

           //maybe you can add the function for google maps here
        })
    

    }




var formSubmitHandler = function(ev) 
{
    ev.preventDefault();
    var userEntry = ev.target.elements['userEntry'].value
    var userInput = userEntry.trim();
   
    if(userInput)
    { eventLocator(userInput);}


}
userForm.addEventListener('submit', formSubmitHandler);






var displayEvents = function(eventData) 
{


   //display just one event, in the future this could be a random event

    var display = document.createElement('span');
    eventList.appendChild(display);
    var eventName =  eventData._embedded.events[0].name + '<br>';
    
    var eventImage = eventData._embedded.events[0].images[0].url;//images is zero because this is the designated icon image
    var eventDate = eventData._embedded.events[0].dates.start.localDate + '<br>';
    var venue = eventData._embedded.events[0]._embedded.venues[0].name +'<br><br>';
    display.innerHTML = '<br>' + eventName + '<br> <img src='+ eventImage +' width="200px" height="200px"><br>' + eventDate + venue;
    eventList.appendChild(display);
//}
}