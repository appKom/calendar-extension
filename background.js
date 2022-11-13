// NOTE: Vurder å bruke chrome.storage.sync
// i stedet for chrome.storage.local

async function addCalendarAndStoreCalendarId(token) {
  console.log("token: " + token)
  data = await addNewSecondaryCalendar(token)
  calendarId = data.id
  console.log("Fra autorisering, id: " + calendarId)
  chrome.storage.local.set({ online_calendar_id: calendarId })
  // localStorage.setItem("online_calendar_id", calendarId)
}

async function addNewSecondaryCalendar(token) {
  // Returnerer id-en til opprettet kalender.
  console.log("Adding new secondary calendar")
  var init = {
    'method': 'POST',
    'async': true,
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

function check_if_calendar_exists(data, calendar_id) {
  for (var i = 0; i < data.items.length; i++) {
    console.log(data.items[i].id)
    if (data.items[i].id == calendar_id) {
      return true;
    }
  }
  return false;
};

async function doAuth() {
  chrome.storage.local.get(["online_calendar_id"], (result) => {
    const online_calendar_id = result.online_calendar_id
    console.log("online_calendar_id i doAuth: " + online_calendar_id)

    chrome.identity.getAuthToken({ interactive: true }, function (token) { // GET
      API_KEY = "AIzaSyCL3vj18BOFVjgfPjHUEMxYfcxqwKZOpss"
      chrome.storage.local.set({ API_KEY: API_KEY })
      chrome.storage.local.set({ token: token })

      console.log("token: " + token);

      var init = {
        'method': 'GET',
        'async': true,
        'headers': {
          'Authorization': 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        'contentType': 'json'
      };

      fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', init)
        .then((response) => response.json()) // Transform the data into json
        .then(function (data) {
          console.log(data);

          online_calendar_exists = false
          if (online_calendar_id) {
            if (check_if_calendar_exists(data, online_calendar_id)) {
              console.log("Calendar already exists")
              online_calendar_exists = true
            } else {
              console.log("Calendar does not exist")
            }
          } else { console.log("No calendarID in chrome.storage") }

          if (!online_calendar_exists) { // CREATE NEW CALENDAR
            addCalendarAndStoreCalendarId(token)

          }
        })
    })
  })
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension")

    if (request.request === "oauth") {
      doAuth()
      return true
    }

    if (request.request === "credentials") {
      chrome.storage.local.get(["token"], (result) => {
        const token = result.token
        chrome.storage.local.get(["API_KEY"], (result) => { 
          const API_KEY = result.API_KEY
          // token = localStorage.getItem("user-token")
          // API_KEY = localStorage.getItem("API_KEY")
          
          sendResponse({
            API_KEY: API_KEY,
            token: token
          })
        })
        
        
      })
      return true
    }
  }
);