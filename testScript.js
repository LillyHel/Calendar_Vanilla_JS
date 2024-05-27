let yearNav = 0; //ausgewähltes Jahr
let clicked = null;
let kwNum = 1;
const date = new Date();

const weekdayContainers = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];
const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

const holidays = new Map([
  ["1.1.", "Neujahr"],
  ["1.5.", "Tag der Arbeit"],
  ["3.10.", "Tag der deutschen Einheit"],
  ["31.10.", "Reformationstag"],
  ["24.12.", "Heilig Abend"],
  ["25.12.", "Erster Weihnachstfeiertag"],
  ["26.12.", "Zweiter Weihnachtsfeiertag"],
]);

const currentDate = new Date();
const currentMonth = months[currentDate.getMonth()];
const currentDay = currentDate.getDate();

function loadYear() {
  //heutiges Datum

  yearContainer.innerHTML = "";

  if (yearNav !== 0) {
    date.setFullYear(new Date().getFullYear() + yearNav);
  }

  const year = date.getFullYear();
  document.getElementById("yearDisplay").innerText = year;


  for(i = 2000; i < 2100; i++){
    const pickerOption = document.createElement("option");
    pickerOption.value = i;
    pickerOption.innerHTML = i; 
    yearPicker.appendChild(pickerOption);
  }

  document.getElementById("yearPicker").value = year;

  calcDynamicHolidays(year);
  calcBussUndBet(year);

  for (let i = 1; i <= 12; i++) {
    let monthName = months[i - 1];

 
    const monthSquare = document.createElement("div");
    monthSquare.classList.add("month");
    monthSquare.id = monthName;
    //monthSquare.innerText = monthName;

    yearContainer.appendChild(monthSquare);
    loadMonthLayout(monthName);
    loadMonth(i - 1, year, monthName);
  }
}

function loadMonthLayout(mName) {
  const monthName = document.createElement("div");
  monthName.classList.add("monthName");
  monthName.innerText = mName;

  const weekdayContainer = document.createElement("div");
  weekdayContainer.classList.add("weekdayContainer");

  const calContainer = document.createElement("div");
  calContainer.classList.add("calContainer");

  const kwColumn = document.createElement("div");
  kwColumn.classList.add("kwColumn");

  const calendar = document.createElement("div");
  calendar.classList.add("calendar");

  document.getElementById(mName).appendChild(monthName);
  document.getElementById(mName).appendChild(weekdayContainer);
  document.getElementById(mName).appendChild(calContainer);

  const container = document.getElementsByClassName("calContainer");

  for (let k = 0; k < container.length; k++) {
    container[k].appendChild(kwColumn);
    container[k].appendChild(calendar);
  }
}

function loadweekdayContainers(month) {
  var monthContainer = document.querySelector(`#${month}`);
  var weekContainer = monthContainer.querySelector(".weekdayContainer");

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

function loadKWs(paddingDays, daysInMonth, mKW) {
  let kwInMonth = 5;
  let paddingDaysExist = paddingDays > 0 ? true : false;

  if (paddingDays + daysInMonth > 35) {
    kwInMonth = 6;
  } else if (paddingDays + daysInMonth < 29) {
    kwInMonth = 4;
  }

  for (let l = 1; l <= kwInMonth; l++) {
    if (paddingDaysExist) {
      const kwSquare = document.createElement("div");
      kwSquare.classList.add("kw");
      if (kwNum === 1) {
        kwSquare.innerText = 52;
      } else {
        kwSquare.innerText = kwNum - 1;
      }

      mKW.append(kwSquare);
      paddingDaysExist = false;
      l++;
    }
    const kwSquare = document.createElement("div");
    kwSquare.classList.add("kw");
    kwSquare.innerText = kwNum;
    mKW.append(kwSquare);
    kwNum++;

    if (kwNum > 52) {
      kwNum = 1;
    }
  }
}

function loadMonth(month, year, monthID) {
  let mContainer = document.getElementById(monthID);
  let mKW = mContainer.children[2].children[0];
  let mCalender = mContainer.children[2].children[1];

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calcDynamicHolidays(year);

  const dateString = firstDayOfMonth.toLocaleDateString("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdayContainers.indexOf(dateString.split(", ")[0]);

  loadweekdayContainers(monthID);
  loadKWs(paddingDays, daysInMonth, mKW);

  for (let j = 1; j <= paddingDays + daysInMonth; j++) {
    //let monthNum = 1;
    const daySquare = document.createElement("div");
    const dayMonthDate = new Date(
      year,
      month,
      j - paddingDays
    ).toLocaleDateString("de-DE", {
      month: "numeric",
      day: "numeric",
    });

    daySquare.classList.add("day");

    if (
      monthID === currentMonth &&
      j === currentDay + paddingDays &&
      yearNav === 0
    ) {
      daySquare.setAttribute("id", "currentDay");
    }

    if (j > paddingDays) {
      daySquare.innerText = j - paddingDays;
      if (holidays.has(dayMonthDate)) {
        daySquare.setAttribute("id", holidays.get(dayMonthDate));
        daySquare.addEventListener("click", () => {
          alert(daySquare.id);
        });
        daySquare.classList.add("holiday");
      }
    } else {
      daySquare.classList.add("padding");
    }

    //addHolidays(daySquare,monthID,year);

    mCalender.appendChild(daySquare);
  }
}

function calcDynamicHolidays(year) {
  deleteDynamicHolidays(holidays, "Karfreitag");
  deleteDynamicHolidays(holidays, "Ostersonntag");
  deleteDynamicHolidays(holidays, "Ostermontag");
  deleteDynamicHolidays(holidays, "Pfingstsonntag");
  deleteDynamicHolidays(holidays, "Pfingstmontag");
  deleteDynamicHolidays(holidays, "Himmelfahrt");

  let a = year % 19;
  let b = Math.floor(year / 100);
  let c = year % 100;
  let d = Math.floor(b / 4);
  let e = b % 4;
  let f = Math.floor((b + 8) / 25);
  let g = Math.floor((b - f + 1) / 3);
  let h = (19 * a + b - d - g + 15) % 30;
  let i = Math.floor(c / 4);
  let k = c % 4;
  let l = (32 + 2 * e + 2 * i - h - k) % 7;
  let m = Math.floor((a + 11 * h + 22 * l) / 451);
  let month = Math.floor((h + l - 7 * m + 114) / 31);
  let day = ((h + l - 7 * m + 114) % 31) + 1;

  let easterSun = new Date(year, month - 1, day).toLocaleDateString("de-DE", {
    month: "numeric",
    day: "numeric",
  });

  let goodFriday = new Date(year, month - 1, day - 2).toLocaleDateString(
    "de-DE",
    {
      month: "numeric",
      day: "numeric",
    }
  );

  let easterMon = new Date(year, month - 1, day + 1).toLocaleDateString(
    "de-DE",
    {
      month: "numeric",
      day: "numeric",
    }
  );

  let pentecostSun = new Date(year, month - 1, day + 49).toLocaleDateString(
    "de-DE",
    {
      month: "numeric",
      day: "numeric",
    }
  );

  let pentecostMon = new Date(year, month - 1, day + 50).toLocaleDateString(
    "de-DE",
    {
      month: "numeric",
      day: "numeric",
    }
  );

  let ascension = new Date(year, month - 1, day + 39).toLocaleDateString(
    "de-DE",
    {
      month: "numeric",
      day: "numeric",
    }
  );

  holidays.set(goodFriday, "Karfreitag");
  holidays.set(easterSun, "Ostersonntag");
  holidays.set(easterMon, "Ostermontag");
  holidays.set(pentecostSun, "Pfingstsonntag");
  holidays.set(pentecostMon, "Pfingstmontag");
  holidays.set(ascension, "Himmelfahrt");
}

function calcBussUndBet(year) {
  deleteDynamicHolidays(holidays, "Buß- und Bettag");

  let bussUndBettag = new Date(year, 10, 23); // Der 23. November im gegebenen Jahr
  while (bussUndBettag.getDay() !== 3 /* Mittwoch */) {
    bussUndBettag.setDate(bussUndBettag.getDate() - 1);
  }

  let bussUndBet = bussUndBettag.toLocaleDateString("de-DE", {
    month: "numeric",
    day: "numeric",
  });

  holidays.set(bussUndBet, "Buß- und Bettag");
}

function deleteDynamicHolidays(map, deletValue) {
  for (let [key, value] of map) {
    if (value === deletValue) {
      map.delete(key);
      break;
    }
  }
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    yearNav++;
    kwNum = 1;
    loadYear();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    yearNav--;
    kwNum = 1;
    loadYear();
  });
}


function updateYearOnSelected() {
  let selectedYear = document.getElementById('yearPicker').value; 
  
  console.log(yearNav); 
  
  date.setFullYear(document.getElementById('yearPicker').value); 
  loadYear(); 

}

initButtons();
loadYear();
