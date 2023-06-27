var professionListAPI = "http://sandbox.gibm.ch/berufe.php";
var classListAPI = "http://sandbox.gibm.ch/klassen.php";
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
                //.filter((item) => item.beruf_name.trim() !== '') // Filter out empty labels
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
function loadTabel(URL, element) {
}
function onDOMLoaded(callback) {
    document.addEventListener('DOMContentLoaded', callback);
}
// Usage
onDOMLoaded(function () {
    /// Event listener for the first dropdown
    var firstDropdown = document.getElementById('professionList');
    var secondDropdown = document.getElementById('classList');
    firstDropdown.addEventListener('change', function (event) {
        var selectedValue = event.target.value;
        console.log(selectedValue);
        //prepare request parameters
        var request = "?beruf_id=".concat(selectedValue);
        console.log(classListAPI + request);
        //load classes
        loadOptions(classListAPI + request, 'classList');
        //returns ID
    });
    secondDropdown.addEventListener('change', function (event) {
        var selectedClass = event.target.value;
        console.log(selectedClass);
        var request = "?klasse_id=".concat(selectedClass);
        console.log(classListAPI + request);
        //load classes
        loadOptions(classListAPI + request, 'outputTable');
    });
    // Call the loadOptions function to fetch and populate the dropdown with proffession
    loadOptions(professionListAPI, "professionList");
});
