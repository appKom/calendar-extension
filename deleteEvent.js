document.addEventListener("click", (e) => {

    async function deleteEvent(event){
        /* Funksjon deleteEvent()

        Resultat:
        Fjernet et event fra autentisert brukers kalender.
        
        Beskrivelse:
        Ytre funksjon som fetcher riktige credentials (fra background.js) og deretter
        caller deleteEventInner med disse og eventet.*/

        // Brukes for å sende request til background.js'
        const extension_id = "elijkjhoojegfcnehlpgbkacplephicj"

        // Sender requests til background.js etter credentials.
        chrome.runtime.sendMessage(
            extension_id,
            { request: "credentials" },
            async function (response) {
                // Response er et objekt med verdiene API_KEY og token
                await deleteEventInner(response, event)
            }
        )
    }

    async function deleteEventInner(credentials){
        /* Indre funksjon som blir callet fra deleteEvent() og gjør
        selve DELETE-requesten til kalender-API-et.*/

        const API_KEY = credentials.API_KEY
        const token = credentials.token
      
        let eventData = await getEventData()
    }

    // Returnerer et objekt med eventData som skal plasseres i body i postEvent
    async function getEventData() {
        
    }

    if(e.target.innerText == "Meld meg av"){
        deleteEvent();
    }
})