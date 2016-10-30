(function() {
  const $gameDef = document.getElementById('game--def');
  const $gameEntry = document.getElementById('game--entry');
  const $gamePoints = document.getElementById('game--points');
  const cancelPattern = '17,67';
  let points = 0;

  // getJSON function
  const getJSON = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      let status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };

  // Get random data
  function randomizeValue(input) {
    const randomPickVal = Math.floor(Math.random() * Object.keys(input).length);
    return randomPickVal;
  }

  // Display points data
  function updatePoints(points) {
    $gamePoints.innerHTML = points;
  }

  // Get Game Questions
  getJSON('./cmd-ref.json', function(err, data) {
    if (err != null) {
      return ('Something went wrong :(');
    } else {

      // TODO: ADD ES6 Transpilation Support
      const dataArray = [... Object.values(data)];
      let activeEntry = [];
      let currentPattern = '';
      let currentCmdName = '';

      function nextEntry() {
        let randomItem = dataArray[randomizeValue(data)];
        $gameDef.innerHTML = randomItem.desc;
        currentCmdName = randomItem.command;
        currentPattern = randomItem.keyBinding.join();
      }

      nextEntry()
      
      // for every keydown, check to see if the answer is complete yet, or if ctrl+c was clicked to skip it
      // show entries typing out 
      // if complete, they get a point

      function newGameItem() {
        $gameEntry.innerHTML = '';
        randomItem = dataArray[randomizeValue(data)]
        nextEntry();
      }

      function checkKey(e) {
        e = e || window.event;
        activeEntry.push(e.keyCode);
        $gameEntry.innerHTML += e.key;

        // backspace to clear entry
        if (e.keyCode === 8) {
          $gameEntry.innerHTML = '';
        }

        if (activeEntry.join().includes(cancelPattern)) {
          // show answers in console to check afterward
          console.log('action: ' + $gameDef.innerHTML, '\ncommand: ' + currentCmdName);
          // clear for new entry
          activeEntry = [];
          newGameItem();
        } else if (activeEntry.join().includes(currentPattern)) {
          points++;
          updatePoints(points);
          newGameItem();
        }
      }

      // init keydown function
      document.onkeydown = checkKey;

    }
  });

  // after 30 seconds, modal overlay with tweet link and your score
  // can be done in CSS

  // TODO:
  // add unicorns that pop in when you get it right and some color
})();