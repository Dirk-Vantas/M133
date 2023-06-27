interface Option {
  value: string;
  label: string;
}

const professionListAPI: string = "http://sandbox.gibm.ch/berufe.php"
const classListAPI: string = "http://sandbox.gibm.ch/klassen.php"

function loadOptions(URL: string, element: string): void {
  fetch(URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    
    .then((response: { beruf_name: string; beruf_id: string }[]) => {
      const options: Option[] = response
      .filter((item) => item.beruf_name.trim() !== '') // Filter out empty labels
      .map((item) => ({
        
        value: item.beruf_id,
        label: item.beruf_name,
      }));
      console.log(options)
      populateDropdown(options, element);
      console.log('API Response:', options);
    })
    .catch((error) => {
      console.log('Error occurred while fetching options:', error);
    });
}


function populateDropdown(options: Option[], id:string): void {
  const dropdown = document.getElementById('professionList') as HTMLSelectElement;

  // Clear existing options
  dropdown.innerHTML = '';

  // Populate dropdown with new options
  options.forEach((option,index) => {
    if (option.label.length != 0) {
      const optionElement = document.createElement('option');
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




function onDOMLoaded(callback: () => void) {
  document.addEventListener('DOMContentLoaded', callback);
}

// Usage
onDOMLoaded(() => {
  /// Event listener for the first dropdown
  const firstDropdown = document.getElementById('professionList') as HTMLSelectElement;
  firstDropdown.addEventListener('change', (event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(selectedValue)
    //returns ID
    //TODO read second api documentation and load correct data  and use
    //existing functions to load and display the data
    //populateSecondDropdown(selectedValue);
    //loadOptions(classListAPI)
  });
  // Call the loadOptions function to fetch and populate the dropdown with proffession
  loadOptions(professionListAPI,"professionList");
  console.log("debug:")
  console.log(document.getElementById('professionList'))
});


