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
      // console.log("classList:");
      // console.log(options);
      populateDropdown(options, element);
      //console.log('API Response:', options);
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
  console.log('call:',URL)  
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
        //get date
        const datePicker = document.getElementById('datepicker') as HTMLInputElement;
        //render table
        filterTableByWeek(datePicker.value, scheduleItems);
      })
    .catch((error) => {
      console.log('Error occurred while fetching options:', error);
    });
}

function filterTableByWeek(date:string, scheduleItems: ScheduleItem[]) :void {
  //FORMAT is JJJJ-W23 //mozilla

  // Get the selected date from the date picker
  const datePicker = document.getElementById('datepicker') as HTMLInputElement;
  const selectedDate = new Date(datePicker.value);
  
  // Get the ISO week number of the selected date
  const weekNumber = parseInt(date.substr(6));
  
  //get all valid entries from the call
  // Filter the data array based on the week number (! not needed since this is an API function)
  //const filteredData = scheduleItems.filter((item) => getNumberOfWeek(new Date(item.datum)) === weekNumber);
  
  const tbody = document.getElementById('outputTable') as HTMLTableElement
  // Remove data rows from the table before filling them back up
  const rowCount = tbody.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    tbody.deleteRow(i);
  }
  
  //generating rows
  scheduleItems.forEach((item) => {
    const row = document.createElement("tr");

     
    const datumCell = document.createElement("td");
    datumCell.textContent = item.datum;
    row.appendChild(datumCell);

    
    const wochentagCell = document.createElement("td");
    wochentagCell.textContent = item.wochentag;
    row.appendChild(wochentagCell);

    
    const vonCell = document.createElement("td");
    vonCell.textContent = item.von;
    row.appendChild(vonCell);

    
    const bisCell = document.createElement("td");
    bisCell.textContent = item.bis;
    row.appendChild(bisCell);

    
    const lehrerCell = document.createElement("td");
    lehrerCell.textContent = item.lehrer;
    row.appendChild(lehrerCell);

    
    const fachCell = document.createElement("td");
    fachCell.textContent = item.fach;
    row.appendChild(fachCell);

    
    const raumCell = document.createElement("td");
    raumCell.textContent = item.raum;
    row.appendChild(raumCell);

    //append new row
    tbody.appendChild(row);
  
  });

    //after update of table display glowing effect to notify user of change
    // Modify the CSS properties directly
    tbody.style.boxShadow = "0 0 50px 15px #48abe0";
    // After a delay, reset the CSS properties
    setTimeout(() => {
      tbody.style.boxShadow = "none";
    }, 1000);
}

//dumb ass function that almost made me rip my hair out
function getNumberOfWeek(currentDate:Date): number {
  const today = currentDate;
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  const pastDaysOfYear = (today.valueOf() - firstDayOfYear.valueOf()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

//wait for dom to load before doing anything :)
function onDOMLoaded(callback: () => void) {
  document.addEventListener('DOMContentLoaded', callback);
}

//domloader function
onDOMLoaded(() => {
  /// Event listener for the first dropdown
  const firstDropdown = document.getElementById('professionList') as HTMLSelectElement;
  const secondDropdown = document.getElementById('classList') as HTMLSelectElement;

  // Get the date picker element
  const datePicker = document.getElementById('datepicker') as HTMLInputElement;
  
  //handle default if no entry has been made
  if (localStorage.getItem('pickedWeek') === null){
    const today = new Date();
    const currentYear:string  = ''+new Date().getFullYear().toString(); // super dirty hack to get date to string
    console.log('curretnYear:',currentYear)
    datePicker.value = `${currentYear}-W${getNumberOfWeek(today)}`;
  }
  else{
    //if user picked date and its store in local storage
    const datePicker = document.getElementById('datepicker') as HTMLInputElement;
    datePicker.value = localStorage.getItem('pickedWeek');
  }

  firstDropdown.addEventListener('change', (event) => {
    const selectedValue = (event.target as HTMLSelectElement).value;
    localStorage.setItem('pickedProfession',selectedValue);
    //load classes into dropdown
    loadOptions(classListAPI+selectedValue,'classList');
  });
  //prepare second dropdown
  secondDropdown.addEventListener('change', (event) =>{
    const selectedClass = (event.target as HTMLSelectElement).value;
    //save selection in local storage
    localStorage.setItem('pickedClass',selectedClass)
    //load classes
    const datePicker = document.getElementById('datepicker') as HTMLInputElement;
    const getWeek = parseInt(datePicker.value.substr(6));
    const getYear = datePicker.value.substring(0, 4);
    const week = `&woche=${getWeek}-${getYear}`;
    //update Table
    loadTable(lessonListAPI+selectedClass+week,'outputTable');
  });
  // Add event listener to detect date changes
  datePicker.addEventListener('change', () => {
    const datePicker = document.getElementById('datepicker') as HTMLInputElement;
    const getWeek = parseInt(datePicker.value.substr(6));
    const getYear = datePicker.value.substring(0, 4);
    const week = `&woche=${getWeek}-${getYear}`;
    loadTable(lessonListAPI+localStorage.pickedClass+week,'outputTable');
    localStorage.setItem('pickedWeek',datePicker.value)
  });
  // Call the loadOptions function to initialize and fetch and populate the dropdown with professions
  loadOptions(professionListAPI,"professionList");
});