//~==========//Legend//======================================================================================================================================//
//* - Important Comments
//  - Normal Comments
//? - Questions
//! - Warnings
//& - My Functions
//^ - Burn in your Eyes
//~ - Sections
//todo - To Do
//~==========//END---Legend//================================================================================================================================//


// Wait until the page (HTML) is loaded, then execute the "main" function
window.onload = function () {
    updateCalendar(new Date().getTime());
};

//& Rebuild the calendar for a new date
// Called every time the user changes the date
function updateCalendar(dateTime) {

    // create a new date object from the given dateTime
    date = new Date(dateTime);

    // Set variables for HTML-Replace
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let weekDay = date.getDay();
    let dateGermanFormat = getdateInGermanFormat(date);
    let holiday = checkHoliday(date);
    let nextHoliday = getNextHoliday(date);
    let calendarHtml = getCalendarForHTML(date);
    let season = getBodySeason(month);
    let zodiacSign = getZodiacSign(date);
    let monthString = getMonthGerman(month);

    //~==========//HTML-Replace//============================================================================================================================//
    //~ Find and overwrite the specific HTML elements    

    document.getElementById('title').innerHTML = `Kalender ${year}`;
    document.querySelectorAll('.year').forEach(element => { element.innerHTML = year; });
    document.querySelectorAll('.weekday').forEach(element => { element.innerHTML = getWeekDayGerman(weekDay); });
    document.querySelectorAll('.date_german_format').forEach(element => { element.innerHTML = dateGermanFormat; });
    document.querySelectorAll('.month_german').forEach(element => { element.innerHTML = monthString; });
    document.querySelectorAll('.how_many_weekday').forEach(element => { element.innerHTML = getTheHowManyWeekDay(day); });
    document.getElementById("month_info").innerHTML = getMonthInformationFromDB(month);
    document.getElementById("holiday_info").innerHTML = getHolidayInfoForHTML(holiday);
    document.getElementById('next_holiday_info').innerHTML = getNextHolidayInfoForHTML(nextHoliday);
    document.getElementById("calendar").innerHTML = calendarHtml;
    document.querySelector('body').style.setProperty('--seasonalBodyBackgroundImage', `var(--${season}BodyBackgroundImage)`);
    document.getElementById('calendar_area').style.setProperty('--seasonalCalendarBackgroundColor', `var(--${season}CalendarBackgroundColor)`);
    document.querySelectorAll('.calendar_table td').forEach(td => { td.style.setProperty('--seasonalCalendarCellBackgroundColor', `var(--${season}CalendarCellBackgroundColor)`); });
    document.querySelectorAll('.calendar_table td').forEach(td => { td.style.setProperty('--seasonalCalendarCellTextColor', `var(--${season}CalendarCellTextColor)`); });
    document.querySelectorAll('.calendar_table td').forEach(td => { td.style.setProperty('--seasonalCalendarCellHoverBackgroundColor', `var(--${season}CalendarCellHoverBackgroundColor)`); });
    document.querySelectorAll('.calendar_table td').forEach(td => { td.style.setProperty('--seasonalCalendarCellBackgroundColorForOtherMonths', `var(--${season}CalendarCellBackgroundColorForOtherMonths)`); });
    document.querySelectorAll('.calendar_table td').forEach(td => { td.style.setProperty('--seasonalCalendarCellHoverBackgroundColorForOtherMonths', `var(--${season}CalendarCellHoverBackgroundColorForOtherMonths)`); });
    document.querySelector('tbody').style.setProperty('--monthlyCalendarBackgroundImage', `var(--${zodiacSign}CalendarBackgroundImage)`);

    //~==========//END:HTML-Replace//======================================================================================================================//
}


//~==========//Functions---For-simple-HTML-Replacements//====================================================================================================//

//& convert weekDay as number to german weekDay as string
function getWeekDayGerman(weekDay) {
    const weekDays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    return weekDays[weekDay];
}

//& convert month as number to german month as string
function getMonthGerman(month) {
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
        "August", "September", "Oktober", "November", "Dezember"];
    return months[month];
}

//& calculates the how many weekDay of a month it is
function getTheHowManyWeekDay(day) {
    // divide the day by 7 and round up
    return Math.ceil(day / 7);
}

//& calculates the easter sunday of a given year
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

//& calculates all the holidays of a given year
// Returns an array of objects with the date, name and state of the holiday
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
        { date: new Date(year + 1, 0, 1), name: "Neujahr", state: "Bundesweit" }
    ];
    return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
}

//& check if a date is a holiday
// if yes return the holiday object, if no return null/undefined
function checkHoliday(date) {

    let holidays = getHolidays(date.getFullYear());
    let holidayOrNull = holidays.find((holiday) => holiday.date.getTime() == date.getTime());

    return holidayOrNull;
}

//& get the next holiday after a given date
function getNextHoliday(date) {

    let holidays = getHolidays(date.getFullYear());
    let nextHoliday = holidays.find((holiday) => holiday.date.getTime() > date.getTime());

    return nextHoliday;
}

//& convert a given date to its german format (dd.mm.yyyy)
function getdateInGermanFormat(date) {

    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();

    return `${day}.${month}.${year} `;
}

//& build the HTML string for the holiday info
function getHolidayInfoForHTML(holiday) {

    if (holiday != null) {
        return `Heute ist ein gesetzlicher Feiertag und zwar ${holiday.name} (${holiday.state}).`;
    }
    else {
        return "Heute ist kein gesetzlicher Feiertag.";
    }
}

//& build the HTML string for the next holiday info
function getNextHolidayInfoForHTML(nextHoliday) {

    if (nextHoliday != null) {
        return `Der nächste Feiertag ist ${nextHoliday.name} (${nextHoliday.state}) und zwar am ${getdateInGermanFormat(nextHoliday.date)}.`;
    }
    else {
        return "Es gibt keinen weiteren Feiertag in diesem Jahr.";
    }
}

//~==========//END:Functions---For-simple-HTML-Replacements//================================================================================================//



//~==========//Functions---For-Calender-Building//===========================================================================================================//

//& build the HTML string for the calendar sheet
function getCalendarForHTML(date) {

    let html = getCalendarHeadForHTML(date);
    html += getCalendarTableForHTML(date);

    return html;
}

//& build the HTML string for the calendar head
function getCalendarHeadForHTML(date) {

    // create some dates for navigation
    let sameDayNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    if (sameDayNextMonth.getMonth() != new Date(date.getFullYear(), date.getMonth() + 1).getMonth()) {
        sameDayNextMonth = new Date(date.getFullYear(), date.getMonth() + 2, 0);
    }

    let sameDayMonthBefore = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
    if (sameDayMonthBefore.getMonth() != new Date(date.getFullYear(), date.getMonth() - 1).getMonth()) {
        sameDayMonthBefore = new Date(date.getFullYear(), date.getMonth(), 0);
    }

    let sameDayNextYear = new Date(date.getFullYear() + 1, date.getMonth(), date.getDate());
    if (sameDayNextYear.getMonth() != date.getMonth()) {
        sameDayNextYear = new Date(date.getFullYear() + 1, date.getMonth() + 1, 0);
    }

    let sameDayYearBefore = new Date(date.getFullYear() - 1, date.getMonth(), date.getDate());
    if (sameDayYearBefore.getMonth() != date.getMonth()) {
        sameDayYearBefore = new Date(date.getFullYear() - 1, date.getMonth() + 1, 0);
    }

    let html = '<div class="calendar_head">';
    html += '<div class="month_nav">';
    html += `   <button class="button_change_month_and_year" onclick="updateCalendar(${sameDayMonthBefore.getTime()})">`;
    html += '       &lt;';
    html += '   </button>';
    html += `   <p class="month_german">${getMonthGerman(date.getMonth()).substring(0, 3)}.</p>`;
    html += `   <button class="button_change_month_and_year" onclick="updateCalendar(${sameDayNextMonth.getTime()})">`;
    html += '       &gt;';
    html += '   </button>';
    html += '</div>';
    html += '<div class="actual_date_nav">';
    html += `   <button class="button_change_month_and_year" onclick="updateCalendar(${new Date().getTime()})">`;
    html += '   Heute';
    html += '   </button>';
    html += '</div>';
    html += '<div class="year_nav">';
    html += `   <button class="button_change_month_and_year" onclick="updateCalendar(${sameDayYearBefore.getTime()})">`;
    html += '       &lt;';
    html += '   </button>';
    html += `   <p class="year">${date.getFullYear()}</p>`;
    html += `  <button class="button_change_month_and_year" onclick="updateCalendar(${sameDayNextYear.getTime()})">`;
    html += '       &gt;';
    html += '   </button>';
    html += '</div>';
    html += '</div>';

    return html;
}

//& build the HTML string for the calendar table
function getCalendarTableForHTML(date) {

    let html = `<table class="calendar_table">`;
    html += getCalendarTableHeadForHTML(date);
    html += getCalendarTableBodyForHTML(date);
    html += `</table>`;

    return html;
}

//& build the HTML string for the calendar table head
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

//& build the HTML string for the calendar table body
function getCalendarTableBodyForHTML(date) {

    // define some variables for later use
    let firstWeekdayThisMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let daysToDrawFromMonthBefore = (firstWeekdayThisMonth + 6) % 7;
    let firstDateToDraw = new Date(date.getFullYear(), date.getMonth(), 1 - daysToDrawFromMonthBefore);

    // create HTML string for table body with all days to draw
    // let tbodyStyle = "background-image: url('images/seasonal_body_background/spring.jpg');";
    let html = `<tbody>`;

    for (let i = 0; i < 42; i++) {

        let day = new Date(firstDateToDraw.getFullYear(), firstDateToDraw.getMonth(), firstDateToDraw.getDate() + i);

        if (day.getDay() == 1) {
            html += `<tr>`;
        }

        let classAttribute = "";
        if (day.getDate() == date.getDate() && day.getMonth() == date.getMonth() && day.getFullYear() == date.getFullYear()) {
            classAttribute += " today";
        }
        if (day.getDay() == 0) {
            classAttribute += " sunday";
        }
        if (day.getDay() == 6) {
            classAttribute += " saturday";
        }
        if (checkHoliday(day) != null) {
            classAttribute += " holiday";
        }
        if (day.getMonth() != date.getMonth()) {
            classAttribute += " day_of_another_month";
        }

        html += `<td class="${classAttribute}" onclick="updateCalendar(${day.getTime()})">`;
        html += day.getDate();
        html += `</td>`;
        if (day.getDay() == 0) {
            html += `</tr>`;
        }
    }
    return html;
}

//~==========//END:Functions---For-Calender-Building//=======================================================================================================//


//~==========//Functions---For-CSS-Design//==================================================================================================================//

//& get the season for a given month
function getBodySeason(month) {

    if (month == 2 || month == 3 || month == 4) {
        return "spring";
    }
    else if (month == 5 || month == 6 || month == 7) {
        return "summer";
    }
    else if (month == 8 || month == 9 || month == 10) {
        return "fall";
    }
    else if (month == 11 || month == 0 || month == 1) {
        return "winter";
    }
}

//& get the zodiac sign for a given date
function getZodiacSign(dateTime) {

    let date = new Date(dateTime);
    let day = date.getDate();
    let month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
        return "aries";
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
        return "taurus";
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
        return "gemini";
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
        return "cancer";
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
        return "leo";
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
        return "virgo";
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
        return "libra";
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
        return "scorpio";
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
        return "sagittarius";
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return "capricorn";
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
        return "aquarius";
    } else {
        return "pisces";
    }
}

//~==========//END:Functions---For-CSS-Design//==============================================================================================================//


//~==========//Database//====================================================================================================================================//

//& get the month information from the database
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

//~==========//END:Database//================================================================================================================================//