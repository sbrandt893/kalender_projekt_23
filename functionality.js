//* Wait until the page (HTML) is loaded, then execute the "main" function
window.onload = function () {
    updateCalendar(new Date().getTime());
};

//* Rebuild the calendar for a new date
// Called every time the user changes the date
function updateCalendar(newDate) {

    //* Create a new Date object from the given date
    // Important to ensure the type
    let date = new Date(newDate);

    //* Get and set the specific date informations
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let weekDay = date.getDay();
    let dateGermanFormat = getdateInGermanFormat(date);
    let holiday = checkHoliday(date);
    let calendarTableForHTML = getCalendarTableForHTML(date);
    let calendarHeadForHTML = getCalendarHeadForHTML(date);
    let html = calendarHeadForHTML + calendarTableForHTML;

    getCalendarTableBodyForHTML(date);


    //!==========//HTML-Replace//============================================================================================================================//
    //! Find and overwrite the specific html elements    

    // let list = document.getElementsByClassName("day");
    // for (let i = 0; i < list.length; i++) {
    //     list[i].innerHTML = day;
    // }

    Array.from(document.getElementsByClassName("date_german_format")).forEach(element => {
        element.innerHTML = dateGermanFormat;
    });
    Array.from(document.getElementsByClassName("day")).forEach(element => {
        element.innerHTML = day.toString().length == 1 ? "0" + day : day;
    });
    Array.from(document.getElementsByClassName("month")).forEach(element => {

        element.innerHTML = (month + 1).toString().length == 1 ? "0" + (month + 1) : (month + 1);
    });
    Array.from(document.getElementsByClassName("month_german")).forEach(element => {
        element.innerHTML = getMonthGerman(month);
    });
    Array.from(document.getElementsByClassName("year")).forEach(element => {
        element.innerHTML = year;
    });
    Array.from(document.getElementsByClassName("weekDay")).forEach(element => {
        element.innerHTML = getWeekDayGerman(weekDay);
    });
    Array.from(document.getElementsByClassName("monthNumber")).forEach(element => {
        element.innerHTML = month.toString().length == 1 ? "0" + month : month;
    });
    Array.from(document.getElementsByClassName("howManyWeekDay")).forEach(element => {
        element.innerHTML = getTheHowManyWeekDay(day);
    });
    document.getElementById("month_info").innerHTML = getMonthInformationFromDB(month);
    document.getElementById("holiday_info").innerHTML = getHolidayInfoForHTML(holiday);
    document.getElementById("calendar").innerHTML = html;

    //!======================================================================================================================================================//
}


//?==========//Functions//===================================================================================================================================//

//* convert weekDay as number to german weekDay as string
function getWeekDayGerman(weekDay) {
    const weekDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    return weekDays[weekDay];
}

//* convert month as number to german month as string
function getMonthGerman(month) {
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
        "August", "September", "Oktober", "November", "Dezember"];
    return months[month];
}

//* calculates the how many weekDay of a month it is
function getTheHowManyWeekDay(day) {
    // divide the day by 7 and round up
    return Math.ceil(day / 7);
}

//* calculates the easter sunday of a year
// no idea how it works, but it works
function getEasterSunday(year) {
    const a = year % 19;
    const b = year % 4;
    const c = year % 7;
    const k = Math.floor(year / 100);
    const p = Math.floor((13 + 8 * k) / 25);
    const q = Math.floor(k / 4);
    const M = (15 - p + k - q) % 30;
    const N = (4 + k - q) % 7;
    const d = (19 * a + M) % 30;
    const e = (2 * b + 4 * c + 6 * d + N) % 7;

    let day;
    let month;

    if (d + e > 9) {
        day = d + e - 9;
        month = 4; // April
    } else {
        day = d + e + 22;
        month = 3; // March
    }

    let easterSundayDate = new Date(year, month - 1, day);
    return easterSundayDate;
}

//* calculates all the holidays of a year
function getHolidays(year) {
    let easterSundayDate = getEasterSunday(year);
    const holidays = [
        { date: new Date(year, 0, 1), name: "Neujahr", state: "Bundesweit" },
        { date: new Date(year, 0, 6), name: "Heilige Drei Könige", state: "Baden-Württemberg, Bayern, Sachsen-Anhalt" },
        { date: new Date(year, 3, 8), name: "Internationaler Frauentag", state: "Berlin, Mecklenburg-Vorpommern" },
        { date: new Date(year, easterSundayDate.getMonth(), easterSundayDate.getDate() - 2), name: "Karfreitag", state: "Bundesweit" },
        { date: easterSundayDate, name: "Ostersonntag", state: "Bundesweit" },
        { date: new Date(year, easterSundayDate.getMonth(), easterSundayDate.getDate() + 1), name: "Ostermontag", state: "Bundesweit" },
        { date: new Date(year, 4, 1), name: "Tag der Arbeit", state: "Bundesweit" },
        { date: new Date(year, easterSundayDate.getMonth(), easterSundayDate.getDate() + 39), name: "Christi Himmelfahrt", state: "Bundesweit" },
        { date: new Date(year, easterSundayDate.getMonth(), easterSundayDate.getDate() + 49), name: "Pfingstsonntag", state: "Bundesweit" },
        { date: new Date(year, easterSundayDate.getMonth(), easterSundayDate.getDate() + 50), name: "Pfingstmontag", state: "Bundesweit" },
        { date: new Date(year, easterSundayDate.getMonth(), easterSundayDate.getDate() + 60), name: "Fronleichnam", state: "Baden-Württemberg, Bayern, Hessen, Nordrhein-Westfalen, Rheinland-Pfalz, Saarland" },
        { date: new Date(year, 7, 8), name: "Augsburger Friedensfest", state: "Augsburg Stadtgebiet" },
        { date: new Date(year, 7, 15), name: "Mariä Himmelfahrt	", state: "Saarland, Bayern(teilweise)" },
        { date: new Date(year, 8, 20), name: "Weltkindertag", state: "Thüringen" },
        { date: new Date(year, 9, 3), name: "Tag der Deutschen Einheit", state: "Bundesweit" },
        { date: new Date(year, 9, 31), name: "Reformationstag", state: "Brandenburg, Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen" },
        { date: new Date(year, 10, 1), name: "Allerheiligen", state: "Brandenburg, Bremen, Hamburg, Mecklenburg-Vorpommern, Niedersachsen, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen" },
        { date: new Date(year, 10, 18), name: "Buß- und Bettag", state: "Sachsen" },
        { date: new Date(year, 11, 25), name: "1. Weihnachtstag", state: "Bundesweit" },
        { date: new Date(year, 11, 26), name: "2. Weihnachtstag", state: "Bundesweit" },
    ];
    return holidays;
}

//* check if a date is a holiday
// if yes return holidays object, if no return null
function checkHoliday(date) {
    let holidays = getHolidays(date.getFullYear());
    let holidayOrNull = holidays.find((holiday) => holiday.date.getTime() === date.getTime());
    return holidayOrNull;
}


//* convert the date to german format (dd.mm.yyyy)
function getdateInGermanFormat(date) {
    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();
    return `${day}.${month}.${year} `;
}
//* build the html string for the holiday info
function getHolidayInfoForHTML(holiday) {
    if (holiday != null) {
        return "Heute ist ein Feiertag und zwar " + holiday.name + ` (${holiday.state}).`;
    }
    else {
        return "Heute ist kein Feiertag.";
    }
}

//?==========================================================================================================================================================//



//?==========//Database//====================================================================================================================================//

//* get the month information from the database
function getMonthInformationFromDB(month) {
    const monthInformations = [
        "Der Januar ist der erste Monat des Jahres im gregorianischen und im julianischen Kalender. Er hat 31 Tage. Veraltete Namensformen sind Hartung, Hartmonat, Schneemonat, Eismond, Wintermonat oder Wolfsmonat.",
        "Der Februar ist der zweite Monat des Jahres im gregorianischen Kalender. Er hat 28 Tage, in Schaltjahren 29 Tage. Der Name leitet sich vom lateinischen Wort februare für „reinigen“ ab.",
        "Der März ist der dritte Monat des Jahres im gregorianischen Kalender. Er hat 31 Tage. Der Name leitet sich vom römischen Kriegsgott Mars ab.",
        "Der April ist der vierte Monat des Jahres im gregorianischen Kalender und hat 30 Tage. Er ist nach dem römischen Heerführer und Staatsmann Marcus Antonius benannt, der den Beinamen „Marcus Antonius Aprilis“ trug.",
        "Der Mai ist der fünfte Monat des Jahres im gregorianischen Kalender und hat 31 Tage. Er ist nach der römischen Göttin Maia benannt, die als Verkörperung des weiblichen Wachstums und der Fruchtbarkeit galt.",
        "Der Juni ist der sechste Monat des Jahres im gregorianischen Kalender und hat 30 Tage. Er ist nach der römischen Göttin Juno benannt, der Gemahlin des Jupiter und Schutzgöttin der Ehe und Geburt.",
        "Der Juli ist der siebte Monat des Jahres im gregorianischen Kalender und hat 31 Tage. Er ist benannt nach dem römischen Staatsmann Gaius Iulius Caesar, der im Jahr 46 v. Chr. seinen Geburtsmonat Quintilis in Iulius umbenennen ließ.",
        "Der August ist der achte Monat des Jahres im gregorianischen Kalender und hat 31 Tage. Er wurde nach dem römischen Kaiser Augustus benannt, der zuvor Sextilis genannt wurde.",
        "Der September ist der neunte Monat des Jahres im gregorianischen Kalender und hat 30 Tage. Er ist nach dem lateinischen Wort septem für „sieben“ benannt, da er im ältesten römischen Kalender der siebte Monat war.",
        "Der Oktober ist der zehnte Monat des Jahres im gregorianischen Kalender und hat 31 Tage. Er ist benannt nach dem lateinischen Wort octo für „acht“, da er im ältesten römischen Kalender der achte Monat war.",
        "Der November ist der elfte Monat des Jahres im gregorianischen Kalender und hat 30 Tage. Er ist benannt nach dem lateinischen Wort novem für „neun“, da er im ältesten römischen Kalender der neunte Monat war.",
        "Der Dezember ist der zwölfte und letzte Monat des Jahres im gregorianischen Kalender und hat 31 Tage. Er ist benannt nach dem lateinischen Wort decem für „zehn“, da er im ältesten römischen Kalender der zehnte Monat war.",
    ];
    return monthInformations[month];

}

//?==========================================================================================================================================================//

function getCalendarHeadForHTML(date) {
    let firstOfMonthBefore = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    let firstOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);


    let newDate = new Date(date);
    let html = `<div class="calendar">`;
    html += `<img class="calendar_cover" , src="images\\black_cat.jpg" alt="black cat closeup face" />`;
    html += `<div class="month_nav">`;
    html += `<button onclick="updateCalendar(${firstOfMonthBefore.getTime()})">`;
    html += `&lt;Zurück`;
    html += `</button>`;
    html += `<h1>`;
    html += `<span class="month_german">${getMonthGerman(newDate.getMonth())}</span>`;
    html += `</h1>`;
    html += `<button onclick="updateCalendar(${firstOfNextMonth.getTime()})">`;
    html += `Weiter&gt;`;
    html += `</button>`;
    html += `</div>`;

    return html;
}

//* build the html string for the calendar table head
function getCalendarTableHeadForHTML() {

    let html = `<thead>`;
    html += `<tr>`;
    html += `<th>Mo</th>`;
    html += `<th>Di</th>`;
    html += `<th>Mi</th>`;
    html += `<th>Do</th>`;
    html += `<th>Fr</th>`;
    html += `<th>Sa</th>`;
    html += `<th>So</th>`;
    html += `</tr>`;
    html += `</thead>`;

    return html;
}
//* build the html string for the calendar table body
function getCalendarTableBodyForHTML(date) {

    // define some variables for later use
    let firstWeekdayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let lastDayMonthBefore = new Date(date.getFullYear(), date.getMonth(), 0);
    let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let lastWeekdayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
    let firstOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    //* create html string for table body with all days to draw
    let html = `<tbody>`;

    // days to be drawn from month before
    let daysToDrawBefore = (firstWeekdayOfMonth + 6) % 7;
    for (let i = 1; i <= daysToDrawBefore; i++) {
        let day = new Date(lastDayMonthBefore.getFullYear(), lastDayMonthBefore.getMonth(), lastDayMonthBefore.getDate() - daysToDrawBefore + i);
        if (day.getDay() == 1) {
            html += `<tr>`;
        }
        html += `<td class="day_of_another_month "onclick="updateCalendar(${day.getTime()})">`;
        html += day.getDate();
        html += `</td>`;
        if (day.getDay() == 0) {
            html += `</tr>`;
        }
    }

    // days to be drawn this month
    for (let i = 1; i <= lastDayOfMonth; i++) {
        let day = new Date(date.getFullYear(), date.getMonth(), i);
        let classAttribute = "";
        if (day.getDay() == 1) {
            html += `<tr>`;
        }
        // if today
        if (day.getTime() == new Date().setHours(0, 0, 0, 0)) {
            classAttribute = " today";
        }
        // if sunday
        if (day.getDay() == 0) {
            classAttribute = " sunday";
            // html += `<td class="sunday" onclick="updateCalendar(${day.getTime()})">`;
            // html += day.getDate();
            // html += `</td>`;
        }
        // if saturday
        if (day.getDay() == 6) {
            classAttribute = " saturday";
            // html += `<td class="saturday" onclick="updateCalendar(${day.getTime()})">`;
            // html += day.getDate();
            // html += `</td>`;
        }

        html += `<td class="${classAttribute}" onclick="updateCalendar(${day.getTime()})">`;
        html += day.getDate();
        html += `</td>`;

        if (day.getDay() == 0) {
            html += `</tr>`;
        }
    }

    // days to be drawn from next month
    let daysToDrawAfter = (7 - lastWeekdayOfMonth) % 7;
    for (let i = 1; i <= daysToDrawAfter; i++) {
        let day = (new Date(firstOfNextMonth.getFullYear(), firstOfNextMonth.getMonth(), i));
        if (day.getDay() == 1) {
            html += `<tr>`;
        }
        html += `<td class="day_of_another_month" onclick="updateCalendar(${day.getTime()})">`;
        html += day.getDate();
        html += `</td>`;
        if (day.getDay() == 0) {
            html += `</tr>`;
        }
    }

    html += `</tbody>`;
    html += `</table>`;

    // console.log(firstWeekdayOfMonth);
    // console.log(lastWeekdayOfMonth);

    return html;
}

// weekday + 6 % 7

function getCalendarTableForHTML(date) {
    let firstOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
    let lastOfMonthBefore = new Date(date.getFullYear(), date.getMonth(), 0).getTime();
    let firstOfMonthBefore = new Date(date.getFullYear(), date.getMonth() - 1, 1).getTime();

    let html = `<table class="calendar_table">`;
    html += getCalendarTableHeadForHTML(date);
    html += getCalendarTableBodyForHTML(date);
    html += `</table>`;
    return html;
} 