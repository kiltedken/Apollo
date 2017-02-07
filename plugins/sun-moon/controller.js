function MoonSun($scope, $interval) {
    //SunCalc
    var SunCalc = require('suncalc');
    var now = new Date();

  function Sunset_Sunrise() {
    //Sunset and Sunrise
    var times = SunCalc.getTimes(new Date(), 39.0, -77.1);

    var riseHours = times.sunrise.getHours();
    var riseMinutes = times.sunrise.getMinutes();
    if (riseMinutes < 10) {
      riseMinutes = "0" + riseMinutes;
    }
    var sunriseStr = riseHours + ':' + riseMinutes + " am";

    var setHours = times.sunset.getHours();
    var setMinutes = times.sunset.getMinutes();
    if (setHours > 12) {
      setHours = setHours - 12;
    }
    if(setMinutes < 10) {
      setMinutes = "0" + setMinutes;
    }
    var sunsetStr = setHours + ':' + setMinutes + " pm";

    document.getElementById('sunrise').innerHTML = sunriseStr;
    document.getElementById('sunset').innerHTML = sunsetStr;
  }

  function MoonPhase() {
    //MoonPhase
    var moon = SunCalc.getMoonIllumination(now);
    var moon_phase = moon.phase.toFixed(2);
    var phase_description;
    //alert(moon_phase);

    // > 0.000 && <= 0.050 - New moon //STRICT
    // > 0.050 && <= 0.275 - Waxing Crescent
    // > 0.275 && <= 0.290 - First Quarter //STRICT
    // > 0.300 && <= 0.500 - Waxing Gibbous
    // > 0.500 && <= 0.550 - Full moon  //STRICT
    // > 0.550 && <= 0.750 - Waning Gibbous
    // > 0.750 && <= 0.800 - Last Quarter //STRICT
    // > 0.800 && <= 1.000 Waning Crescent
    if(moon_phase >= 0.000 && moon_phase < 0.050) {
      moon_phase = "New_Moon";
      phase_description = "New Moon";
    } else if(moon_phase >= 0.050 && moon_phase < 0.275) {
      moon_phase = "Waxing_Crescent";
      phase_description = "Waxing Crescent";
    } else if(moon_phase >= 0.275 && moon_phase < 0.290) {
      moon_phase = "First_Quarter";
      phase_description = "First Quarter";
    } else if(moon_phase >= 0.290 && moon_phase < 0.500) {
      moon_phase = "Waxing_Gibbous";
      phase_description = "Waxing Gibbous";
    } else if(moon_phase >= 0.500 && moon_phase < 0.525) {
      moon_phase = "Full_Moon";
      phase_description = "Full Moon";
    } else if(moon_phase >= 0.525 && moon_phase < 0.750) {
      moon_phase = "Waning_Gibbous";
      phase_description = "Waning Gibbous";
    } else if(moon_phase >= 0.750 && moon_phase < 0.775) {
      moon_phase = "Third_Quarter";
      phase_description = "Third Quarter";
    } else {
      //moon_phase >= 0.775 && moon_phase <= 1.000
      moon_phase = "Waning_Crescent";
      phase_description = "Waning Crescent";
    }
    document.getElementById('phase_description').innerHTML = phase_description;
    document.getElementById('phase_pic').src = "img/Moon_Phases/" + moon_phase + ".png";
  }

  MoonPhase();
  $interval(MoonPhase, 360000)

  Sunset_Sunrise();
  $interval(Sunset_Sunrise, 360000)
  }

angular.module('Apollo')
    .controller('MoonSun', MoonSun);
