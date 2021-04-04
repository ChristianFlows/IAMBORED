
var userForm = document.querySelector('#userForm');
var userEntry = document.querySelector('#userEntry');
var submitButton = document.querySelector('#submit-button');
var userSearchTerm = document.querySelector('#userSearchTerm');
var eventList =document.querySelector('#eventList');

//OPEN THE CONSOLE!!!! YOU WILL SEE THE OBJECT I AM PULLING FROM AFTER YOU TYPE IN A KEYWORD AND CLICK THE SEARCH BUTTON

var displayEvents = function(eventData) 
{

    //there must be a better way to display the first five events someone could attend 
    //i want to pull up the first 3 events? if the event has multiple dates, how can i just display the event with its mult dates underneath?
    //could we perhaps do a for-loop?

    //What we need 
    //1. display the same event only once and display it's different dates 
    //2. images need to look better
    //3. merged with css and html 
    //4. venue location needs to be pulled to google maps 
    //5. special notices when undefined still appear 

    for(var i = 0; i < 5; i++){//doing just first five events maybe we can randonmize it instead? 
    var display = document.createElement('span');
    eventList.appendChild(display);
    var eventName =  eventData._embedded.events[i].name + '<br>';
    var eventImage = eventData._embedded.events[i].images[0].url;//images is zero because this is the designated icon image
    var eventDate = eventData._embedded.events[i].dates.start.localDate + '<br>';
    var venue = eventData._embedded.events[i]._embedded.venues[0].name +'<br><br>';
    var notice = eventData._embedded.events[i].pleaseNote + '<br>';
    display.innerHTML = '<br>' + eventName + '<br> <img src='+ eventImage +' width="200px" height="200px"><br>' + eventDate + venue + notice;
    eventList.appendChild(display);
    }
}





var eventLocator = function(userEntry) {
    // can only operate by keyword at the moment, you could change the parameter to city or zipcode see ticketmaster docs 
    var apiUrl = "https://app.ticketmaster.com/discovery/v2/events?keyword=" + userEntry + "&apikey=Ao7jWEWwZIMXSxV8bGEoSfgA3ot0V3sh&locale=*";

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log('API RESPONSE ---> ', data)
            displayEvents(data)
            //console.log(data);
        })
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


