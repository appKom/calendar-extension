window.onload = function() {
    document.getElementById("gammel-knapp").addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);
        var init = { 
            'method' : 'GET',
            'async'  : true,
            'headers': {
              'Authorization' : 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            'contentType': 'json'
          };
        
          fetch('https://www.googleapis.com/calendar/v3/calendars/public/events', init)
          .then((response) => response.json()) // Transform the data into json
          .then(function(data) {
              console.log(data);
            })
      });
    });
  };