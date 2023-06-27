var professionListAPI = "http://sandbox.gibm.ch/berufe.php";
var classListAPI = "http://sandbox.gibm.ch/klassen.php?beruf_id=";
var lessonListAPI = "http://sandbox.gibm.ch/tafel.php?klasse_id=";
/* REQUIRED PACKAGES
- date-fns
*/
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
            console.log("classList:");
            console.log(options);
            populateDropdown(options, element);
            console.log('API Response:', options);
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
        console.log("items:");
        console.log(scheduleItems);
        var datePicker = document.getElementById('datepicker');
        console.log('//////datepickerdate:', datePicker.value);
        filterTableByWeek(datePicker.value, scheduleItems);
        //console.log('API Response:', options);
    })
        .catch(function (error) {
        console.log('Error occurred while fetching options:', error);
    });
}
function filterTableByWeek(date, scheduleItems) {
    console.log('filterdate:', date);
    //FORMAT is JJJJ-W23
    // Get the selected date from the date picker
    var datePicker = document.getElementById('datepicker');
    var selectedDate = new Date(datePicker.value);
    console.log('selected date for table', selectedDate);
    // Get the ISO week number of the selected date
    var weekNumber = parseInt(date.substr(6));
    //const selectedWeek = getNumberOfWeek(selectedDate);
    console.log('get number of week new', getNumberOfWeek(selectedDate));
    //get all valid entries from the call
    // Filter the data array based on the week number
    var filteredData = scheduleItems.filter(function (item) { return getNumberOfWeek(new Date(item.datum)) === weekNumber; });
    // Function to filter dates based on a given week
    var tbody = document.getElementById('outputTable');
    tbody.innerHTML = '';
    console.log('filtered table', filteredData);
    filteredData.forEach(function (item) {
        var row = document.createElement("tr");
        // Example: Creating a <td> for the 'datum' property
        var datumCell = document.createElement("td");
        datumCell.textContent = item.datum + "nmweek:" + getNumberOfWeek(new Date(item.datum));
        row.appendChild(datumCell);
        // Example: Creating a <td> for the 'wochentag' property
        var wochentagCell = document.createElement("td");
        wochentagCell.textContent = item.wochentag;
        row.appendChild(wochentagCell);
        // Example: Creating a <td> for the 'von' property
        var vonCell = document.createElement("td");
        vonCell.textContent = item.von;
        row.appendChild(vonCell);
        // Example: Creating a <td> for the 'von' property
        var bisCell = document.createElement("td");
        bisCell.textContent = item.bis;
        row.appendChild(bisCell);
        // Example: Creating a <td> for the 'von' property
        var lehrerCell = document.createElement("td");
        lehrerCell.textContent = item.lehrer;
        row.appendChild(lehrerCell);
        // Example: Creating a <td> for the 'von' property
        var fachCell = document.createElement("td");
        fachCell.textContent = item.fach;
        row.appendChild(fachCell);
        // Example: Creating a <td> for the 'von' property
        var raumCell = document.createElement("td");
        raumCell.textContent = item.raum;
        row.appendChild(raumCell);
        //console.log('row:',row);
        tbody.appendChild(row);
    });
}
function getNumberOfWeek(currentDate) {
    var today = currentDate;
    var firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    var pastDaysOfYear = (today.valueOf() - firstDayOfYear.valueOf()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
function onDOMLoaded(callback) {
    document.addEventListener('DOMContentLoaded', callback);
}
// Usage
onDOMLoaded(function () {
    /// Event listener for the first dropdown
    var firstDropdown = document.getElementById('professionList');
    var secondDropdown = document.getElementById('classList');
    // Get the date picker element
    var datePicker = document.getElementById('datepicker');
    //handle default if no entry has been made
    if (localStorage.getItem('pickedDate') === null) {
        var today = new Date();
        var currentYear = '' + new Date().getFullYear().toString(); // super dirty hack to get date to string
        console.log('curretnYear:', currentYear);
        datePicker.value = "".concat(currentYear, "-W").concat(getNumberOfWeek(today));
        //localStorage.setItem('pickedDate',datePicker.value) 
    }
    else {
        //datePicker.value = localStorage.getItem('pickedDate');
    }
    firstDropdown.addEventListener('change', function (event) {
        var selectedValue = event.target.value;
        console.log(selectedValue);
        localStorage.setItem('pickedProfession', selectedValue);
        console.log(classListAPI + selectedValue);
        //load classes
        loadOptions(classListAPI + selectedValue, 'classList');
        //returns ID
    });
    secondDropdown.addEventListener('change', function (event) {
        var selectedClass = event.target.value;
        localStorage.setItem('pickedClass', selectedClass);
        console.log(selectedClass);
        console.log(classListAPI + selectedClass);
        //load classes
        loadTable(lessonListAPI + selectedClass, 'outputTable');
    });
    // Add event listener to detect date changes
    datePicker.addEventListener('change', function () {
        console.log('localstorage date:', localStorage.pickedClass);
        loadTable(lessonListAPI + localStorage.pickedClass, 'outputTable');
    });
    // Call the loadOptions function to initialize and fetch and populate the dropdown with profession
    loadOptions(professionListAPI, "professionList");
});
