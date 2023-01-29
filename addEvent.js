// Ved å legge til lenken: https://online.ntnu.no/events/*  under "content_scripts" i manifest.json, kan vi bestemme spesefike scripts og css-filer
// som skal kjøres ved følgende url. * betyr at filene vi legger til vil kjøres på alt som oppfyller alt frem til stjernen og uansett hva som kommer etter.

// Her legger vi til en eventlistener på siden vi befinner oss på.

async function postEvent() {
  /* Sender request til extensionen (popup-en) og
    ber om API-key og user-token tilbake.
    Caller så postEvent med riktige credentials */

  const extension_id = "elijkjhoojegfcnehlpgbkacplephicj"

  chrome.runtime.sendMessage(
    extension_id,
    { request: "credentials" },
    async function (response) {
      console.log("API_KEY i getCredentials: " + response.API_KEY)
      console.log("token i getCredentials: " + response.token)
      await postEventInner(response)
    }
  )
}

// Poster event til brukers online-kalender
async function postEventInner(credentials) {
  const API_KEY = credentials.API_KEY
  const token = credentials.token

  let eventData = await getEventData()

  chrome.storage.local.get(["online_calendar_id"], (result) => {
    const online_calendar_id = result.online_calendar_id

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

    console.log("EventData: " + eventData)

    fetch(
        "https://www.googleapis.com/calendar/v3/calendars/" +
        online_calendar_id + "/events?key=" + API_KEY,
        init
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Test inni fetch")
        console.log(data)
      })
  })
}

// Returnerer et objekt med eventData som skal plasseres i body i postEvent
async function getEventData() {
  eventID = window.location.href.split("/")[4]
  let response = await fetch('https://old.online.ntnu.no/api/v1/events/' + eventID + '/')
  let data = await response.json()
  return {
    "summary": "Online | " + data.title,
    "description": data.description,
    "location": data.location,
    "colorId": "9", // Blueberry: #3f51b5 | All colors: https://lukeboyle.com/blog/posts/google-calendar-api-color-id
    "start": {
      "dateTime": data.event_start,
      "timeZone": "Europe/Oslo"
    },
    "end": {
      "dateTime": data.event_end,
      "timeZone": "Europe/Oslo"
    }
  }
}

//? Eventlistener for påmeldingsknappen på online siden.
document.addEventListener("click", (e) => {
  postEvent()
  if (e.target.innerText == "Meld meg på") {
    console.log("Du har nå blitt meldt på! ")
  } else if (e.target.innerText == "Meld meg på venteliste") {
    console.log("Du har nå blitt satt på venteliste. Du er nummer # i køen")
  }
})