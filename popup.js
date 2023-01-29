window.onload = function () {
    /* Registrerer klikk på Logg inn-knapp og
    sender melding til background.js som gjør autentisering
    mot Googles API. */
  document
    .getElementById("gammel-knapp")
    .addEventListener("click", function () {
      chrome.runtime.sendMessage({ request: "oauth" }, () => {
        console.log("Authorized user")
      })
    })
}

