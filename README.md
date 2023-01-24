# calendar-extension

Denne chrome-extensionen legger dine online arrangementer rett inn i google calender ved påmelding. 


## Litt om hvordan det fungerer


### oauth.js
Kjører i popup.html og hører etter trykk på knappene. Sender melding (gjennom chrome.runtime.sendMessage) når bruker skal autentiseres. Denne meldingen plukkes opp av background.js og bruker autentiseres så mot Google. 

### background.js
background.js kjører hele tiden når utvidelsen kjører.
Denne håndterer messages mellom de ulike scriptsene. 

Ved autentisering (se oauth.js) lagres key og token i localStorage, slik at background.js kan sende denne informasjonen til content script-et (foreløpig addEvent.js) når det skal postes et event til API-et