API_KEY = "AIzaSyCL3vj18BOFVjgfPjHUEMxYfcxqwKZOpss"


async function setCalendarIdToCookie(token) {
  console.log("token: " + token)
  data = await addNewSecondaryCalendar(token)
  calendarId = data.id
  console.log("Fra autorisering, id: " + calendarId)
  localStorage.setItem("online_calendar_id", calendarId)
}

async function addNewSecondaryCalendar(token) {
  // Returnerer id-en til opprettet kalender.
  console.log("Adding new secondary calendar")
  var init = { 
    'method' : 'POST',
    'async'  : true,
    'headers': {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    // 'contentType': 'json',
    'body': "{'summary': 'Extension-test'}"
  };

  response = await fetch('https://www.googleapis.com/calendar/v3/calendars?alt=json&key=' + API_KEY, init)
  data = await response.json()
  return data
}

// function getCalendarIdFromCookie() {
//   //! NB: Denne funksjonen tar utgangspunkt i at vi ikke har lagret noe annet i cookie
//   // TODO: Gjør mer dynamisk
//   let cookie = decodeURIComponent(document.cookie)
//   console.log("cookie: " + cookie)
//   id = cookie.split("=")[1]
//   return id

// }

window.onload = function() {
    document.getElementById("gammel-knapp").addEventListener('click', function() {

        online_calendar_id = localStorage.getItem("online_calendar_id")
        
        chrome.identity.getAuthToken({interactive: true}, function(token) { // GET
            console.log("token: " + token);

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
                
                online_calendar_exists = false
                if (online_calendar_id) {
                  if (check_if_calendar_exists(data, online_calendar_id)) {
                      console.log("Calendar already exists")
                      online_calendar_exists = true
                  } else {
                      console.log("Calendar does not exist")
                  }
                } else {console.log("No calendarID in localStorage")}

                if (!online_calendar_exists) { // CREATE NEW CALENDAR
                  addCalendarAndStoreCalendarId(token)
            
                }
        
              });
    
              localStorage.setItem("user-token", token)
      });
  })
}

function check_if_calendar_exists(data, calendar_id) {
    for (var i = 0; i < data.items.length; i++) {
        console.log(data.items[i].id)
        if (data.items[i].id == calendar_id) {
            return true;
        }
    }
    return false; 
};