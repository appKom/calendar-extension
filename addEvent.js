// Ved å legge til lenken: https://online.ntnu.no/events/*  under "content_scripts" i manifest.json, kan vi bestemme spesefike scripts og css-filer
// som skal kjøres ved følgende url. * betyr at filene vi legger til vil kjøres på alt som oppfyller alt frem til stjernen og uansett hva som kommer etter.

// Her legger vi til en eventlistener på siden vi befinner oss på.

function postEvent(){
    var token = localStorage.getItem("user token");
    var init = {
        'method': 'POST',
        'async': true,
        'headers': {
          'Authorization' : 'Bearer ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        'body': `{
          "end": {
          "dateTime": "2022-11-28T09:00:00-07:00",
          "timeZone": "America/Los_Angeles"
          },
          "start": {
          "dateTime": "2022-11-28T09:00:00-07:00",
          "timeZone": "America/Los_Angeles"
          }
        }`
      }
}

document.addEventListener("click", (e)=> {

    // her trekker vi ut teksten til knappen som ble klikket på, og sjekker om det samsvarer med den knappen vi ønsker å gi funksjonalitet til.
    postEvent();
    if (e.target.innerText == "Meld meg på") {
        console.log("Du har nå blitt meldt på! ");
    }
    else if (e.target.innerText == "Meld meg på venteliste") {
        console.log("Du har nå blitt satt på venteliste. Du er nummer # i køen");
    }
})
