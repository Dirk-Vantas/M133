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
        var options = response.map(function (item) { return ({
            value: item.beruf_id,
            label: item.beruf_name,
        }); });
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
    options.forEach(function (option) {
        var optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.text = option.label;
        dropdown.appendChild(optionElement);
    });
}
// Call the loadOptions function to fetch and populate the dropdown with proffession
loadOptions(professionListAPI, "professionList");
