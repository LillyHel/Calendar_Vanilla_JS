if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    }).catch(error => {
      console.log('Service Worker registration failed:', error);
    });
  });
}

const weekdayContainers = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

const holidays = new Map([
  ["1.1.", "Neujahr"],
  ["1.5.", "Tag der Arbeit"],
  ["3.10.", "Tag der deutschen Einheit"],
  ["31.10.", "Reformationstag"],
  ["24.12.", "Heilig Abend"],
  ["25.12.", "Erster Weihnachstfeiertag"],
  ["26.12.", "Zweiter Weihnachtsfeiertag"],
]);

let yearNav = 0; // ausgewähltes Jahr
const date = new Date();
let year = new Date().getFullYear();
const currentMonth = months[date.getMonth()];
const currentDay = date.getDate();

function setYear(yearNum){
  date.setFullYear(yearNum); 
  year = date.getFullYear(); 
}

function getYear() {
  return year; 
}

//Laden jedes Monats des eingestellen Jahres sowie Errechnung der Feiertage
function loadYear() {

  const yearContainer = document.getElementById("yearContainer");
  yearContainer.innerHTML = "";

  if (yearNav !== 0) {
    setYear(year + yearNav);
  }

  document.getElementById("titleTag").innerHTML = "Kalenderjahr " + year;
  document.getElementById("yearDisplay").innerText = year;

  initPicker(year);
  calcDynamicHolidays(year);
  calcBussUndBet(year);

  months.forEach((monthName, monthNum) => {
    const monthSquare = document.createElement("div");
    monthSquare.classList.add("month");
    monthSquare.id = monthName;

    yearContainer.appendChild(monthSquare);
    loadMonthLayout(monthName);
    loadMonth(monthNum, monthName);
  });

}

//Jahresauswahl initialisieren
function initPicker(year) {
  const yearPicker = document.getElementById("yearPicker");
  yearPicker.innerHTML = "";

  for (let i = 2000; i < 2100; i++) {
    const pickerOption = document.createElement("option");
    pickerOption.value = i;
    pickerOption.innerHTML = i;
    yearPicker.appendChild(pickerOption);
  }
  yearPicker.value = year;
}

// Layout für jeden Monat initialisieren 
function loadMonthLayout(monthName) {
  const monthContainer = document.getElementById(monthName);
  monthContainer.innerHTML = `
    <div class="monthName">${monthName}</div>
    <div class="weekdayContainer"></div>
    <div class="calContainer">
      <div class="kwColumn"></div>
      <div class="calendar"></div>
    </div>`;
}

//Fügt Wochentage zu jedem Monat hinzu
function loadweekdayContainers(month) {
  const monthContainer = document.getElementById(month);
  const weekContainer = monthContainer.querySelector(".weekdayContainer");

  weekContainer.innerHTML = `
    <div class="day">KW</div>
    <div class="day">Mo</div>
    <div class="day">Di</div>
    <div class="day">Mi</div>
    <div class="day">Do</div>
    <div class="day">Fr</div>
    <div class="day">Sa</div>
    <div class="day">So</div>`;
}

//Fügt Kalenderwochen zu jedem Monat hinzu
function loadKWs(mKW, monthNum, daysInMonth) {
  for (let i = 1; i <= daysInMonth; i++) {
    const weekNumber = getISOWeekNumber(year, monthNum, i);

    if (new Date(year, monthNum, i).getDay() === 1 || i === 1) {
      mKW.innerHTML += `<div class="kw">${weekNumber}</div>`;
    }
  }
}

//Berechnung der Kalenderwoche für ein bestimmtes Datum 
function getISOWeekNumber(year, monthNum, dayNum) {
  const target = new Date(year, monthNum, dayNum);
  const dayNumber = (target.getDay() + 6) % 7; 
  target.setDate(target.getDate() - dayNumber + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstThursdayDayNumber = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstThursdayDayNumber + 3);
  const weekNumber = 1 + Math.round(((target.getTime() - firstThursday.getTime()) / 86400000 - 3) / 7);

  return weekNumber;
}

//Laden des Monats mit Wochentagen, Kalenderwochen
function loadMonth(monthNum, monthName) { 
  const mContainer = document.getElementById(monthName);
  const mKW = mContainer.querySelector(".kwColumn");
  const mCalendar = mContainer.querySelector(".calendar");
  const daysInMonth = new Date(year, monthNum + 1, 0).getDate();
  const paddingDays = calcPaddingDays(monthNum);

  loadweekdayContainers(monthName);
  loadKWs(mKW, monthNum, daysInMonth);


  for (let j = 1; j <= paddingDays + daysInMonth; j++) {
    const daySquare = document.createElement("div");
    const dayMonthDate = new Date(year, monthNum, j - paddingDays).toLocaleDateString("de-DE", {
      month: "numeric",
      day: "numeric",
    });

    daySquare.classList.add("day");

    if (monthName === currentMonth && j === currentDay + paddingDays && yearNav === 0) {
      daySquare.setAttribute("id", "currentDay");
    }

    if (j > paddingDays) {
      daySquare.innerHTML = `<div class="dayNumber">${j - paddingDays}</div>`;
      if (holidays.has(dayMonthDate)) {
        const holidayDropdown = document.createElement("div");
        holidayDropdown.classList.add("holidayDropdown");
        holidayDropdown.setAttribute("id", holidays.get(dayMonthDate));
        holidayDropdown.innerHTML = holidays.get(dayMonthDate); 
        daySquare.appendChild(holidayDropdown); 
        daySquare.classList.add("holiday");

        //Bezeichnung der Feiertage erscheint als Dropdown beim Klicken auf den Tag
        daySquare.addEventListener("click", () => {
      
        var dropdown =  document.getElementById(holidays.get(dayMonthDate));
        dropdown.classList.toggle("show");
      
          var rect = dropdown.getBoundingClientRect();
          var windowWidth = window.innerWidth;
   
          if (rect.right > windowWidth / 2) {
            dropdown.parentElement.style.justifyContent = 'right'; 
        
          } else {
            dropdown.parentElement.style.justifyContent = 'left'; 
          }
        });
      
      }
    } else {
      daySquare.classList.add("padding");
    }

    mCalendar.appendChild(daySquare);
  }
}

//Berechnet wie viele 'Fülltage' es in einer Woche vor dem 1. des Monats gibt
function calcPaddingDays(monthNum) {
  const firstDayOfMonth = new Date(year, monthNum, 1);
  const dateString = firstDayOfMonth.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdayContainers.indexOf(dateString.split(", ")[0]);
  return paddingDays;
}

//Berechnet die dynamischen Feiertage im Jahr
function calcDynamicHolidays(year) {
  const dynamicHolidays = ["Karfreitag", "Ostersonntag", "Ostermontag", "Pfingstsonntag", "Pfingstmontag", "Himmelfahrt"];
  dynamicHolidays.forEach(holiday => deleteDynamicHolidays(holidays, holiday));

  const [month, day] = calculateEasterDate(year);
  const easterDate = new Date(year, month - 1, day);

  const holidayDates = {
    "Karfreitag": new Date(easterDate).setDate(easterDate.getDate() - 2),
    "Ostersonntag": easterDate,
    "Ostermontag": new Date(easterDate).setDate(easterDate.getDate() + 1),
    "Pfingstsonntag": new Date(easterDate).setDate(easterDate.getDate() + 49),
    "Pfingstmontag": new Date(easterDate).setDate(easterDate.getDate() + 50),
    "Himmelfahrt": new Date(easterDate).setDate(easterDate.getDate() + 39)
  };

  Object.entries(holidayDates).forEach(([holiday, date]) => {
    holidays.set(new Date(date).toLocaleDateString("de-DE", { month: "numeric", day: "numeric" }), holiday);
  });
}

//Berechnung des Osterdatums
function calculateEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return [month, day];
}

//Berechnung des Datums auf den Buß-und Bettag fällt
function calcBussUndBet(year) {
  deleteDynamicHolidays(holidays, "Buß- und Bettag");

  let bussUndBettag = new Date(year, 10, 23);
  while (bussUndBettag.getDay() !== 3) {
    bussUndBettag.setDate(bussUndBettag.getDate() - 1);
  }

  holidays.set(bussUndBettag.toLocaleDateString("de-DE", { month: "numeric", day: "numeric" }), "Buß- und Bettag");
}

//Entfernt alle dynamischen Feiertage aus der Feiertage-Map 
function deleteDynamicHolidays(map, deleteValue) {
  for (let [key, value] of map) {
    if (value === deleteValue) {
      map.delete(key);
      break;
    }
  }
}

//Initialisert Vor- und Zurück-Buttons
function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    yearNav = 1;

    loadYear();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    yearNav = -1;

    loadYear();
  });

  document.getElementById("yearPicker").addEventListener("change", updateYearOnSelected);
}

//Laden des ausgewählten Jahres
function updateYearOnSelected() {
  const selectedYear = document.getElementById('yearPicker').value;
  setYear(selectedYear); 
  yearNav = 0; 
  loadYear();
}

//Zurücksetzen auf das aktuelle Jahr
function resetToCurrentYear(){
  year = new Date().getFullYear();
  yearNav = 0; 
  loadYear(); 
}

//Öffnen und Schließen der Top-Navigation 
function openNav() {
  document.getElementById("topNav").style.height = "25%";
}

function closeNav() {
  document.getElementById("topNav").style.height = "0%";
}

//Schließt alle Dropdowns beim Klicken außerhalb eines Dropdowns 
window.onclick = function(event) {
  if (!event.target.matches('.holiday')) {
    var dropdowns = document.getElementsByClassName("holidayDropdown");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}



initButtons();
loadYear();