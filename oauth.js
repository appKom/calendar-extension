// function onGAPILoad() {
//   gapi.client.init({
//     // Don't pass client nor scope as these will init auth2, which we don't want
//     apiKey: API_KEY,
//     discoveryDocs: DISCOVERY_DOCS,
//   }).then(function () {
//     console.log('gapi initialized')
//   }, function(error) {
//     console.log('error', error)
//   });
// }


window.onload = function() {
    document.getElementById("gammel-knapp").addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
        var init = { 
            'method' : 'INSERT',
            'async'  : true,
            'headers': {
              'Authorization' : 'Bearer ' + token,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            'contentType': 'json',
            "body": {
              "summary": "test"
            }
          };
        
          fetch('https://www.googleapis.com/calendar/v3/calendars?key=AIzaSyCL3vj18BOFVjgfPjHUEMxYfcxqwKZOpss', init)
          .then(function(data) {console.log(data)}) // Transform the data into json
          // .then(function(data) {
          //     console.log(data);
            // })
      });
    });
  };