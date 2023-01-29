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

async function postEventInner(credentials, event) {
    /* Indre funksjon som blir callet fra postEvent() og gjør
    selve POST-requesten til kalender-API-et.*/

    const API_KEY = credentials.API_KEY
    const token = credentials.token

    /* Statisk HTTP-header som brukes for å poste event */
    var init = {
        method: 'POST',
        async: true,
        headers: {
            Authorization: 'Bearer ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }

    // Gjør eventobjektet til en string som kan gjøres til body
    // Legger til selve eventet i bodyen til HTTP-requesten.
    let eventString = JSON.stringify(event)
    init.body = eventString

    chrome.storage.local.get(["online_calendar_id"], (result) => {
        // Henter id-en til event-kalenderen fra storage
        const online_calendar_id = result.online_calendar_id

        // Poster event til kalender-API
        fetch(
            "https://www.googleapis.com/calendar/v3/calendars/" +
            online_calendar_id +
            "/events?key=" +
            API_KEY,
            init
        )
            .then((response) => response.json())
            .then((data) => {
                // Respons fra event
                console.log(data)

            })
    })
}

document.addEventListener("click", (e) => {
    /* Hører etter alle klikk og sjekker om det er riktig
    knapp ved å sjekke objektets innerText */
    if (e.target.innerText == "Meld meg på"
        || e.target.innerText == "Meld meg på venteliste") {
        postEvent();
    }
})