var professionListAPI = "http://sandbox.gibm.ch/berufe.php";
var classListAPI = "http://sandbox.gibm.ch/klassen.php";
function loadOptions(URL, element) {
    fetch(URL)
        .then(function (response) {
        if (!response.ok) {
            throw new Error('Network response was not OK');
        }
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
function populateDropdown(options, id) {
    var dropdown = document.getElementById('professionList');
    // Clear existing options
    dropdown.innerHTML = '';
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
function onDOMLoaded(callback) {
    document.addEventListener('DOMContentLoaded', callback);
}
// Usage
onDOMLoaded(function () {
    /// Event listener for the first dropdown
    var firstDropdown = document.getElementById('professionList');
    firstDropdown.addEventListener('change', function (event) {
        var selectedValue = event.target.value;
        console.log(selectedValue);
        //returns ID
        //TODO read second api documentation and load correct data  and use
        //existing functions to load and display the data
        //populateSecondDropdown(selectedValue);
        //loadOptions(classListAPI)
    });
    // Call the loadOptions function to fetch and populate the dropdown with proffession
    loadOptions(professionListAPI, "professionList");
    console.log("debug:");
    console.log(document.getElementById('professionList'));
});
