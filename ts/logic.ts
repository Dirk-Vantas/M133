interface Option {
  value: string;
  label: string;
}

interface ScheduleItem {
  id: string;
  datum: string;
  wochentag: string;
  von: string;
  bis: string;
  lehrer: string;
  fach: string;
  longfach: string;
  raum: string;
  kommentar: string;
}

const professionListAPI: string = "http://sandbox.gibm.ch/berufe.php"
const classListAPI: string = "http://sandbox.gibm.ch/klassen.php?beruf_id="
const lessonListAPI: string = "http://sandbox.gibm.ch/tafel.php?klasse_id="

/* REQUIRED PACKAGES
- date-fns
*/


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

function loadTable(URL: string, element: string): void {
    fetch(URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
      return response.json();
    })
    .then((response: { 
      tafel_id: string; 
      tafel_datum: string; 
      tafel_wochentag: string;
      tafel_von: string;
      tafel_bis: string;
      tafel_lehrer: string;
      tafel_fach: string;
      tafel_longfach: string;
      tafel_raum:string;
      tafel_kommentar:string}[]) => {
        console.log('repsonse classes:',response)
        //nicely map them into the interface
        const scheduleItems: ScheduleItem[] = response
        .map((item) => ({
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
        }));
        console.log("items:")
        console.log(scheduleItems);
        const datePicker = document.getElementById('datepicker') as HTMLInputElement;
        filterTableByWeek(datePicker.value, scheduleItems);
        //console.log('API Response:', options);
      })
    .catch((error) => {
      console.log('Error occurred while fetching options:', error);
    });
}

function filterTableByWeek(date:string, scheduleItems: ScheduleItem[]) :void{

  console.log(date)

  //FORMAT is JJJJ-W23

  // Get the selected date from the date picker
  const datePicker = document.getElementById('datepicker') as HTMLInputElement;
  const selectedDate = new Date(datePicker.value);
  
  console.log(selectedDate)
  // Get the ISO week number of the selected date
  const selectedWeek = getWeekNumber(selectedDate);

  //get all valid entries from the call
  // Filter the data array based on the week number
  const filteredData = scheduleItems.filter((item) => getWeekNumber(new Date(item.datum)) === selectedWeek);
  
  console.log('filtered table',filterTableByWeek);
  
}

  function getWeekNumber(d: Date): number{
    const currentdate = new Date();
    const oneJan = new Date(currentdate.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((currentdate.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    console.log(`The week number of the current date (${currentdate}) is ${result}.`);
    return result
  }
  


function onDOMLoaded(callback: () => void) {
  document.addEventListener('DOMContentLoaded', callback);
}

// Usage
onDOMLoaded(() => {
  /// Event listener for the first dropdown
  const firstDropdown = document.getElementById('professionList') as HTMLSelectElement;
  const secondDropdown = document.getElementById('classList') as HTMLSelectElement;

  // Get the date picker element
  const datePicker = document.getElementById('datepicker') as HTMLInputElement;
  
  //handle default if no entry has been made
  if (localStorage.getItem('pickedDate') === null){
    const currentDate = new Date();
    const isoWeekNumber = getWeekNumber(currentDate)
    console.log('no date set using default, now!')
    datePicker.value = new Date().toISOString().split('T')[0];//isoWeekNumber.toString();
    
  }
  else{
    //datePicker.value = localStorage.getItem('pickedDate');
  }
  
  
  firstDropdown.addEventListener('change', (event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log(selectedValue)
    //prepare request parameters
    
    console.log(classListAPI+selectedValue)
    //load classes
    loadOptions(classListAPI+selectedValue,'classList')
    //returns ID
  });

  secondDropdown.addEventListener('change', (event) =>{
    const selectedClass = (event.target as HTMLSelectElement).value;
    
    console.log(selectedClass)
    
    var request = `?klasse_id=${selectedClass}` 
    console.log(classListAPI+selectedClass)
    //load classes
    loadTable(lessonListAPI+selectedClass,'outputTable')
  })

  // Add event listener to detect date changes
  //datePicker.addEventListener('change', () => filterTableByWeek(datePicker.value, ));
  
  
  // Call the loadOptions function to initialize and fetch and populate the dropdown with profession
  loadOptions(professionListAPI,"professionList");
  
});


