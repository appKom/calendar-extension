window.onload = () => {
  document
    .getElementById("gammel-knapp")
    .addEventListener("click", () => {
      chrome.runtime.sendMessage({ request: "oauth" }, () => {
        console.log("Authorized user")
      })
    })
}