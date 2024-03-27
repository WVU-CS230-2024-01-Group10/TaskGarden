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

if (localStorage.getItem("stage")) {                
    stage = JSON.parse(localStorage.getItem("stage"));
}

var plantContainer = document.getElementById('plant-picture');

document.addEventListener('DOMContentLoaded', function() {
    updateView();
    console.log(points);
});


function updateView() {
    plantContainer.innerHTML = `<img src="${plantType}_${stage}.png" alt="${plantType} stage ${stage}">`;
}

function upgradePlant() {
    if (stage == 5) {
        console.log("plant is at maximum stage");
        return;
    }
    if (points >= 100) {
        stage += 1;
        points -= 100;
        localStorage.setItem("stage", stage);
        localStorage.setItem("points", points);
        updateView();
    } else {
        console.log("not enough points to upgrade plant");
    }
}
