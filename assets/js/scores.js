function printHighscores() {
  // Either get scores from localstorage or set to an empty array
  var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

  // Sort highscores by score property in descending order
  highscores.sort(function(a, b) {
      return b.score - a.score;
  });

  // Iterate through all highscores and create a list item for each one
  highscores.forEach(function(score) {
      // Create li tag for each high score
      var liTag = document.createElement('li');
      liTag.textContent = score.initials + ' - ' + score.score;

      // Display on page
      var olEl = document.getElementById('highscores');
      olEl.appendChild(liTag);
  });
}

function clearHighscores() {
  // Remove highscores from local storage and reload the page
  window.localStorage.removeItem('highscores');
  window.location.reload();
}

// Add clearHighscores function to clear button onclick event
document.getElementById('clear').addEventListener('click', clearHighscores);

// Run printHighscores function when page loads
printHighscores();
