interface Option {
  value: string;
  label: string;
}

const professionListAPI: string = "http://sandbox.gibm.ch/berufe.php"
const classListAPI: string = "http://sandbox.gibm.ch/klassen.php"

function loadOptions(URL: string, element: string): void {
  
  if(element == 'professionList'){
  fetch(URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      console.log("proffessionlist api call:")
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

  if(element == 'classList'){
    console.log(URL)
    fetch(URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then((response: { klasse_id: string; klasse_name: string }[]) => {
      console.log('API Response:', response);
      const options: Option[] = response
      //.filter((item) => item.beruf_name.trim() !== '') // Filter out empty labels
      .map((item) => ({
        value: item.klasse_id,
        label: item.klasse_name,
      }));
      console.log("classList:");
      console.log(options);
      populateDropdown(options, element);
      console.log('API Response:', options);
    })
    .catch((error) => {
      console.log('Error occurred while fetching options:', error);
    });
  }

}


function populateDropdown(options: Option[], id:string): void {
  const dropdown = document.getElementById(id) as HTMLSelectElement;

  // Clear existing options
  dropdown.innerHTML = '';

  if (id == 'classList'){
    dropdown.disabled = false;
  }

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

function loadTabel(URL: string, element: string): void {



}




function onDOMLoaded(callback: () => void) {
  document.addEventListener('DOMContentLoaded', callback);
}

// Usage
onDOMLoaded(() => {
  /// Event listener for the first dropdown
  const firstDropdown = document.getElementById('professionList') as HTMLSelectElement;
  const secondDropdown = document.getElementById('classList') as HTMLSelectElement;
  
  firstDropdown.addEventListener('change', (event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(selectedValue)
    //prepare request parameters
    var request = `?beruf_id=${selectedValue}` 
    console.log(classListAPI+request)
    //load classes
    loadOptions(classListAPI+request,'classList')
    //returns ID
  });

  secondDropdown.addEventListener('change', (event) =>{
    const selectedClass = (event.target as HTMLSelectElement).value;
    
    console.log(selectedClass)
    
    var request = `?klasse_id=${selectedClass}` 
    console.log(classListAPI+request)
    //load classes
    loadOptions(classListAPI+request,'outputTable')


  })
  // Call the loadOptions function to fetch and populate the dropdown with proffession
  loadOptions(professionListAPI,"professionList");
  
});


