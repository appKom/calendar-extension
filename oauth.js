// function onGAPILoad() {
//   gapi.client.init({
//     // Don't pass client nor scope as these will init auth2, which we don't want
//     apiKey: API_KEY,
//     discoveryDocs: DISCOVERY_DOCS,
//   }).then(function () {
//     console.log('gapi initialized')
//   }, function(error) {
//     console.log('error', error)
//   });
// }

window.onload = function() {
    document.getElementById("gammel-knapp").addEventListener('click', function() {

        online_calendar_id = "c_rsnpvik3adgtmjmphiv9jba8sk@group.calendar.google.com" //! TEMPORARY
        online_calendar_exists = false;

        chrome.identity.getAuthToken({interactive: true}, function(token) { // GET
            console.log(token);

            var init = {
                'method' : 'GET',
                'async'  : true,
                'headers': {
                    'Authorization' : 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                'contentType': 'json'
            };

            fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', init)
            .then((response) => response.json()) // Transform the data into json
            .then(function(data) {
                console.log(data);                

                if (check_if_calendar_exists(data, online_calendar_id)) {
                    console.log("Calendar already exists")
                } else {
                    console.log("Calendar does not exist")
                }

                online_calendar_exists = check_if_calendar_exists(data, online_calendar_id)
            })
        });

        if (!online_calendar_exists) { // CREATE NEW CALENDAR
            chrome.identity.getAuthToken({interactive: true}, function(token) { // POST
                var init = { 
                    'method' : 'POST',
                    'async'  : true,
                    'headers': {
                    'Authorization' : 'Bearer ' + token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    // 'contentType': 'json',
                    'body': "{'summary': 'Extension-test'}"
                };
                
                fetch('https://www.googleapis.com/calendar/v3/calendars?alt=json&key=AIzaSyCL3vj18BOFVjgfPjHUEMxYfcxqwKZOpss', init)
                .then(function(data) {console.log(data)}) // Transform the data into json
            });
        }
    });
};

function check_if_calendar_exists(data, calendar_id) {
    for (var i = 0; i < data.items.length; i++) {
        console.log(data.items[i].id)
        if (data.items[i].id == calendar_id) {
            return true;
        }
    }
    return false; 
}