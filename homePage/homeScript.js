// default variable values
var plantType = "succulent";
var points = 0;
var stage = 1;

if (localStorage.getItem("plantType")) {                
    plantType = JSON.parse(localStorage.getItem("plantType"));
}

if (localStorage.getItem("points")) {                
    points = JSON.parse(localStorage.getItem("points"));
}

if (points >= 100) {
    stage = 2;
} else if (points >= 250) {
    stage = 3;
} else if (points >= 500) {
    stage = 4;
} else if (points >= 1000) {
    stage = 5;
}

var plantContainer = document.getElementById('plant-picture');

document.addEventListener('DOMContentLoaded', function() {
    updateView();
    console.log(points);
});


function updateView() {
    plantContainer.innerHTML = `<img src="${plantType}_${stage}.png" alt="${plantType} stage ${stage}">`;
}
