/* Denne filen blir insertet når man går til en online-side.
Brukes så for å posteEvent()*/

async function postEvent(event) {
    /* Funksjon postEvent()

    Resultat:
    Legger til event til autentisert brukers kalender.

    Beskrivelse:
    Ytre funksjon som fetcher riktige credentials (fra background.js) og deretter
    caller PostEventInner med disse og eventet.*/

    // Brukes for å sende request til background.js
    const extension_id = "elijkjhoojegfcnehlpgbkacplephicj"

    // Sender requests til background.js etter credentials.
    chrome.runtime.sendMessage(
      extension_id,
      { request: "credentials" },
      async function (response) {
        // Response er et objekt med verdiene API_KEY og token
        await postEventInner(response, event)
      }
    )
}


async function postEventInner(credentials) {
    /* Indre funksjon som blir callet fra postEvent() og gjør
        selve POST-requesten til kalender-API-et.*/

  const API_KEY = credentials.API_KEY
  const token = credentials.token

  let eventData = await getEventData()

  chrome.storage.local.get(["online_calendar_id"], (result) => {
    const online_calendar_id = result.online_calendar_id

    /* Statisk HTTP-header som brukes for å poste event */
    var init = {
      method: "POST",
      async: true,
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    }

    // Poster event til kalender-API
    fetch(
      "https://www.googleapis.com/calendar/v3/calendars/" +
      online_calendar_id + "/events?key=" + API_KEY,
      init
    )
    .then((response) => response.json())
    .then((data) => {
      console.log("Test inni fetch")
      console.log(data) // Respons fra event
    })
  })
}

// Returnerer et objekt med eventData som skal plasseres i body i postEvent
async function getEventData() {
  eventID = window.location.href.split("/")[4]
  let response = await fetch('https://old.online.ntnu.no/api/v1/events/' + eventID + '/')
  let data = await response.json()

  let eventFull = data.max_capacity == data.number_of_seats_taken

  return {
    summary: "Online | " + data.title,
    description: eventFull ? "OBS: Da du meldte deg på arrangementet, ble du lagt til i ventelista. \n---\n \n": "" + data.description,
    location: data.location,
    colorId: "9", // Blueberry: #3f51b5 | All colors: https://lukeboyle.com/blog/posts/google-calendar-api-color-id
    start: {
      dateTime: data.event_start,
      timeZone: "Europe/Oslo"
    },
    end: {
      dateTime: data.event_end,
      timeZone: "Europe/Oslo"
    }
  }
}


document.addEventListener("click", (e) => {
  /* Hører etter alle klikk og sjekker om det er riktig
  knapp ved å sjekke objektets innerText */
  if (e.target.innerText == "Meld meg på"
    || e.target.innerText == "Meld meg på venteliste") {
    postEvent();
  }})