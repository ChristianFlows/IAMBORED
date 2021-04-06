
var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var userSearchTerm = document.querySelector('#userSearchTerm');
var eventList =document.querySelector('#eventList');

//OPEN THE CONSOLE!!!! YOU WILL SEE THE OBJECT I AM PULLING FROM AFTER YOU TYPE IN A KEYWORD AND CLICK THE SEARCH BUTTON


var eventLocator = function(userEntry) {
    // can only operate by keyword at the moment, you could change the parameter to city or zipcode see ticketmaster docs 
    var apiUrl = "https://app.ticketmaster.com/discovery/v2/events?keyword=" + userEntry + "&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh&locale=*";

    fetch(apiUrl).then(function(eventResponse){
            return eventResponse.json();


        //eventResponse.json().then(function(data){
            //console.log('API RESPONSE ---> ', data)
            //displayEvents(data)
            //console.log(data);
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


}
userForm.addEventListener('submit', formSubmitHandler);






var displayEvents = function(eventData) 
{


   //doing just first five events maybe we can randonmize it instead? 
    var display = document.createElement('span');
    eventList.appendChild(display);
    var eventName =  eventData._embedded.events[0].name + '<br>';
    
    var eventImage = eventData._embedded.events[0].images[0].url;//images is zero because this is the designated icon image
    var eventDate = eventData._embedded.events[0].dates.start.localDate + '<br>';
    var venue = eventData._embedded.events[0]._embedded.venues[0].name +'<br><br>';
    var notice = eventData._embedded.events[0].pleaseNote + '<br>';
    display.innerHTML = '<br>' + eventName + '<br> <img src='+ eventImage +' width="200px" height="200px"><br>' + eventDate + venue;
    eventList.appendChild(display);
//}
}