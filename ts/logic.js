var professionListAPI = "http://sandbox.gibm.ch/berufe.php";
var classListAPI = "http://sandbox.gibm.ch/klassen.php?beruf_id=";
var lessonListAPI = "http://sandbox.gibm.ch/tafel.php?klasse_id=";
function loadOptions(URL, element) {
    if (element == 'professionList') {
        fetch(URL)
            .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            console.log("proffessionlist api call:");
            return response.json();
        })
            .then(function (response) {
            var options = response
                .filter(function (item) { return item.beruf_name.trim() !== ''; }) // Filter out empty labels
                .map(function (item) { return ({
                value: item.beruf_id,
                label: item.beruf_name,
            }); });
            console.log(options);
            populateDropdown(options, element);
            console.log('API Response:', options);
        })
            .catch(function (error) {
            console.log('Error occurred while fetching options:', error);
        });
    }
    if (element == 'classList') {
        console.log(URL);
        fetch(URL)
            .then(function (response) {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();
        })
            .then(function (response) {
            console.log('API Response:', response);
            var options = response
                .map(function (item) { return ({
                value: item.klasse_id,
                label: item.klasse_name,
            }); });
            // console.log("classList:");
            // console.log(options);
            populateDropdown(options, element);
            //console.log('API Response:', options);
        })
            .catch(function (error) {
            console.log('Error occurred while fetching options:', error);
        });
    }
}
function populateDropdown(options, id) {
    var dropdown = document.getElementById(id);
    // Clear existing options
    dropdown.innerHTML = '';
    if (id == 'classList') {
        dropdown.disabled = false;
    }
    // Populate dropdown with new options
    options.forEach(function (option, index) {
        if (option.label.length != 0) {
            var optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.text = option.label;
            dropdown.appendChild(optionElement);
            // Select the first option
            if (index === 0) {
                optionElement.selected = true;
            }
        }
    });
}
function loadTable(URL, element) {
    console.log('call:', URL);
    fetch(URL)
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
        return response.json();
    })
        .then(function (response) {
        console.log('repsonse classes:', response);
        //nicely map them into the interface
        var scheduleItems = response
            .map(function (item) { return ({
            id: item.tafel_id,
            datum: item.tafel_datum,
            wochentag: item.tafel_wochentag,
            von: item.tafel_von,
            bis: item.tafel_bis,
            lehrer: item.tafel_lehrer,
            fach: item.tafel_fach,
            longfach: item.tafel_longfach,
            raum: item.tafel_raum,
            kommentar: item.tafel_kommentar,
        }); });
        //get date
        var datePicker = document.getElementById('datepicker');
        //render table
        filterTableByWeek(datePicker.value, scheduleItems);
    })
        .catch(function (error) {
        console.log('Error occurred while fetching options:', error);
    });
}
function filterTableByWeek(date, scheduleItems) {
    //FORMAT is JJJJ-W23 //mozilla
    // Get the selected date from the date picker
    var datePicker = document.getElementById('datepicker');
    var selectedDate = new Date(datePicker.value);
    // Get the ISO week number of the selected date
    var weekNumber = parseInt(date.substr(6));
    //get all valid entries from the call
    // Filter the data array based on the week number (! not needed since this is an API function)
    //const filteredData = scheduleItems.filter((item) => getNumberOfWeek(new Date(item.datum)) === weekNumber);
    var tbody = document.getElementById('outputTable');
    // Remove data rows from the table before filling them back up
    var rowCount = tbody.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        tbody.deleteRow(i);
    }
    //generating rows
    scheduleItems.forEach(function (item) {
        var row = document.createElement("tr");
        var datumCell = document.createElement("td");
        datumCell.textContent = item.datum;
        row.appendChild(datumCell);
        var wochentagCell = document.createElement("td");
        wochentagCell.textContent = item.wochentag;
        row.appendChild(wochentagCell);
        var vonCell = document.createElement("td");
        vonCell.textContent = item.von;
        row.appendChild(vonCell);
        var bisCell = document.createElement("td");
        bisCell.textContent = item.bis;
        row.appendChild(bisCell);
        var lehrerCell = document.createElement("td");
        lehrerCell.textContent = item.lehrer;
        row.appendChild(lehrerCell);
        var fachCell = document.createElement("td");
        fachCell.textContent = item.fach;
        row.appendChild(fachCell);
        var raumCell = document.createElement("td");
        raumCell.textContent = item.raum;
        row.appendChild(raumCell);
        //append new row
        tbody.appendChild(row);
    });
    //after update of table display glowing effect to notify user of change
    // Modify the CSS properties directly
    tbody.style.boxShadow = "0 0 50px 15px #48abe0";
    // After a delay, reset the CSS properties
    setTimeout(function () {
        tbody.style.boxShadow = "none";
    }, 1000);
}
//dumb ass function that almost made me rip my hair out
function getNumberOfWeek(currentDate) {
    var today = currentDate;
    var firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    var pastDaysOfYear = (today.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
//wait for dom to load before doing anything :)
function onDOMLoaded(callback) {
    document.addEventListener('DOMContentLoaded', callback);
}
//domloader function
onDOMLoaded(function () {
    /// Event listener for the first dropdown
    var firstDropdown = document.getElementById('professionList');
    var secondDropdown = document.getElementById('classList');
    // Get the date picker element
    var datePicker = document.getElementById('datepicker');
    //handle default if no entry has been made
    if (localStorage.getItem('pickedWeek') === null) {
        var today = new Date();
        var currentYear = '' + new Date().getFullYear().toString(); // super dirty hack to get date to string
        console.log('curretnYear:', currentYear);
        datePicker.value = "".concat(currentYear, "-W").concat(getNumberOfWeek(today));
    }
    else {
        //if user picked date and its store in local storage
        var datePicker_1 = document.getElementById('datepicker');
        datePicker_1.value = localStorage.getItem('pickedWeek');
    }
    firstDropdown.addEventListener('change', function (event) {
        var selectedValue = event.target.value;
        localStorage.setItem('pickedProfession', selectedValue);
        //load classes into dropdown
        loadOptions(classListAPI + selectedValue, 'classList');
    });
    //prepare second dropdown
    secondDropdown.addEventListener('change', function (event) {
        var selectedClass = event.target.value;
        //save selection in local storage
        localStorage.setItem('pickedClass', selectedClass);
        //load classes
        var datePicker = document.getElementById('datepicker');
        var getWeek = parseInt(datePicker.value.substr(6));
        var getYear = datePicker.value.substring(0, 4);
        var week = "&woche=".concat(getWeek, "-").concat(getYear);
        //update Table
        loadTable(lessonListAPI + selectedClass + week, 'outputTable');
    });
    // Add event listener to detect date changes
    datePicker.addEventListener('change', function () {
        var datePicker = document.getElementById('datepicker');
        var getWeek = parseInt(datePicker.value.substr(6));
        var getYear = datePicker.value.substring(0, 4);
        var week = "&woche=".concat(getWeek, "-").concat(getYear);
        loadTable(lessonListAPI + localStorage.pickedClass + week, 'outputTable');
        localStorage.setItem('pickedWeek', datePicker.value);
    });
    // Call the loadOptions function to initialize and fetch and populate the dropdown with professions
    loadOptions(professionListAPI, "professionList");
});
