



<div>







app.controller("Milestokm", function () {
    var kmc = this;
    kmc.message = "Enter Fist Name";
    kmc.milesToKilos = function (kilos) {
    kmc.answer = kilos / .6214;
  }
  kmc.kilosToMiles = function(miles){
    kmc.answer2 = miles * .6214;
    }
})