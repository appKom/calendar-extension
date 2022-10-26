async function setCalendarIdToCookie(token) {
  console.log(token)
  data = await addNewSecondaryCalendar(token)
  calendarId = data.id
  console.log("Fra autorisering, id: " + calendarId)
  document.cookie = "calendarId=" + calendarId + "; expires=Thu, 18 Dec 2999 12:00:00 UTC; path=/";
}

async function addNewSecondaryCalendar(token) {
  // Returnerer id-en til opprettet kalender.
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

  response = await fetch('https://www.googleapis.com/calendar/v3/calendars?alt=json&key=AIzaSyCL3vj18BOFVjgfPjHUEMxYfcxqwKZOpss', init)
  data = await response.json()
  return data
}

function getCalendarIdFromCookie() {
  //! NB: Denne funksjonen tar utgangspunkt i at vi ikke har lagret noe annet i cookie
  // TODO: Gjør mer dynamisk
  let cookie = decodeURIComponent(document.cookie)
  console.log(cookie)
  id = cookie.split("=")[1]
  return id

}

window.onload = function() {
    document.getElementById("gammel-knapp").addEventListener('click', function() {

        online_calendar_id = "c_rsnpvik3adgtmjmphiv9jba8sk@group.calendar.google.com" //! TEMPORARY
        online_calendar_exists = false;

        if (getCalendarIdFromCookie() !== undefined) {
          online_calendar_id = getCalendarIdFromCookie()
          online_calendar_exists = true
        }
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

            if (!online_calendar_exists) { // CREATE NEW CALENDAR
              setCalendarIdToCookie(token)  // Lager også en ny kalender, bør renames.
            }
        });

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