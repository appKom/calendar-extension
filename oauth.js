async function setCalendarIdToCookie(token) {
  console.log(token)
  data = await addNewSecondaryCalendar(token)
  calendarId = data.id
  console.log("Fra autorisering, id: " + calendarId)
  document.cookie = "calendarId=" + calendarId + "; expires=Thu, 18 Dec 2999 12:00:00 UTC; path=/";
}


window.onload = function() { 
    document.getElementById("gammel-knapp").addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, (token) => {
        setCalendarIdToCookie(token)
    });

    document.getElementById("cookie-checker").addEventListener("click", () => {
      console.log(document.cookie);
    })
  });
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
  // .then((response) => response.json())
  // .then(function(data) {
  //   console.log(data)
  //   // return data
  //   promise = new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(data)
  //     }, 2000)
      
  //   }) /* Returnerer id-en til ny-opprettet kalender */
  //   console.log(promise.then((test) => {
  //     return test
  //   }))
  //   return promise
  // })
}