// Ved å legge til lenken: https://online.ntnu.no/events/*  under "content_scripts" i manifest.json, kan vi bestemme spesefike scripts og css-filer
// som skal kjøres ved følgende url. * betyr at filene vi legger til vil kjøres på alt som oppfyller alt frem til stjernen og uansett hva som kommer etter.

// Her legger vi til en eventlistener på siden vi befinner oss på.

async function postEvent() {
    /* Sender request til extensionen (popup-en) og 
    ber om API-key og user-token tilbake. 
    Caller så postEventInner med riktige credentials */

    const extension_id = "elijkjhoojegfcnehlpgbkacplephicj"

    chrome.runtime.sendMessage(extension_id,
        { request: "credentials" },
        async function (response) {
            console.log("API_KEY i getCredentials: " + response.API_KEY)
            console.log("token i getCredentials: " + response.token)
            await postEventInner(response)
        })
}


async function postEventInner(credentials) {
    // Poster event til brukers online-kalender
    const API_KEY = credentials.API_KEY
    const token = credentials.token

    chrome.storage.local.get(["online_calendar_id"], (result) => {
        const online_calendar_id = result.online_calendar_id

        var init = {
            'method': 'POST',
            'async': true,
            'headers': {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            'body': `{
                "start": {
                    "dateTime": "2022-11-28T09:00:00-08:00",
                    "timeZone": "America/Los_Angeles"
                },
                "end": {
                    "dateTime": "2022-11-28T09:00:00-09:00",
                    "timeZone": "America/Los_Angeles"
                }
            }`
        }

        console.log("Test inni postEvent")

        fetch("https://www.googleapis.com/calendar/v3/calendars/" + online_calendar_id + "/events?key=" + API_KEY, init)
            .then((response) => response.json())
            .then((data) => {
                console.log("Test inni fetch")
                console.log(data)
            })
    })
}

document.addEventListener("click", (e) => {

    // her trekker vi ut teksten til knappen som ble klikket på,
    // og sjekker om det samsvarer med den knappen vi ønsker å gi
    // funksjonalitet til.
    postEvent();
    if (e.target.innerText == "Meld meg på") {
        console.log("Du har nå blitt meldt på! ");
    }
    else if (e.target.innerText == "Meld meg på venteliste") {
        console.log("Du har nå blitt satt på venteliste. Du er nummer # i køen");
    }
})