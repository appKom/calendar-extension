// NOTE: Vurder å bruke chrome.storage.sync i stedet for chrome.storage.local

async function addCalendarAndStoreCalendarId(token, API_KEY) {
    console.log("token: " + token)
    console.log("API_KEY: " + API_KEY)
    addNewSecondaryCalendar(token, API_KEY).then((data) => {
        console.log(data)
    calendarId = data.id
      console.log("Fra autorisering, id: " + calendarId)
      chrome.storage.local.set({ online_calendar_id: calendarId })
        // localStorage.setItem("online_calendar_id", calendarId)
    })
}

// Returnerer id-en til opprettet kalender.
async function addNewSecondaryCalendar(token, API_KEY) {
  // Returnerer id-en til opprettet kalender basert på token.
  console.log("Adding new secondary calendar")
  var init = {
    method: "POST",
    async: true,
    headers: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: "{'summary': 'Extension-test'}",
  }

  response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars?alt=json&key=" + API_KEY,
    init
  )
  data = await response.json()
  return data
}

function check_if_calendar_exists(data, calendar_id) {
  /* Itererer over listen over kalendre for å se om extensionkalenderen finnes*/

  for (var i = 0; i < data.items.length; i++) {
    console.log(data.items[i].id)
    if (data.items[i].id == calendar_id) {
      return true
    }
  }
  return false
}

// Lager en ny kalender for brukeren, og lagrer id-en til kalenderen i chrome.storage.local
async function doAuth() {
  /* Autentiserer bruker mot Google Calendar-API og får
  tilbake credentials (token) som lagres i storage.local for å */

  chrome.storage.local.get(["online_calendar_id"], (result) => {
    // Henter ID-en til kalender
    const online_calendar_id = result.online_calendar_id

    /* getAuthToken åpner interaktivt vindu hvor man logger inn med
    Google-bruker. */
    chrome.identity.getAuthToken({ interactive: true }, function (token) {
      
      // Lagrer API_KEY og token for senere bruk.
      let API_KEY = "AIzaSyCL3vj18BOFVjgfPjHUEMxYfcxqwKZOpss"
      chrome.storage.local.set({ API_KEY: API_KEY })
      chrome.storage.local.set({ token: token })

      // Statiske headers som brukes for GET-request 
      var init = {
        method: "GET",
        async: true,
        headers: {
          Authorization: "Bearer " + token,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        contentType: "json",
      }

      // Fetcher liste over alle kalendere i Google for bruker
      fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        init
      )
        .then((response) => response.json()) // Gjør response til json
        .then(function (data) {
          console.log(data)

          online_calendar_exists = false
          if (online_calendar_id) {
            if (check_if_calendar_exists(data, online_calendar_id)) {
              console.log("Calendar already exists")
              online_calendar_exists = true
            } else {
              console.log("Calendar does not exist")
            }
          } else {
            console.log("No calendarID in chrome.storage")
          }

          if (!online_calendar_exists) {
            // CREATE NEW CALENDAR
            addCalendarAndStoreCalendarId(token, API_KEY)
          }
        })
    })
  })
}


chrome.runtime.onMessage.addListener(
  /* Handler alle incoming messages fra andre filer som
  må handles her grunnet API-restriksjoner */
  function (request, sender, sendResponse) {

  if (request.request === "oauth") {
    /* Kjøres når den får melding fra popup.js om å
    autentisere. */
    doAuth()
    return true
  }

  if (request.request === "credentials") {
    /* Kjøres når content-scriptet (addEvent.js) brukes 
    for å poste events. */
    chrome.storage.local.get(["token"], (result) => {
      const token = result.token
      chrome.storage.local.get(["API_KEY"], (result) => {
        const API_KEY = result.API_KEY

        // Sender API-key og token 
        sendResponse({
          API_KEY: API_KEY,
          token: token,
        })
      })
    })
    return true
  }
})
