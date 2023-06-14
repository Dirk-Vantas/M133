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
      const options: Option[] = response.map((item) => ({
        value: item.beruf_id,
        label: item.beruf_name,
      }));
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
  options.forEach((option) => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.text = option.label;
    dropdown.appendChild(optionElement);
  });
}

// Call the loadOptions function to fetch and populate the dropdown with proffession
loadOptions(professionListAPI,"professionList");
