import * as $ from 'jquery';
    $(document).ready(function() {
      $('#firstDropdown').on('change', function() {
        var firstSelection = $(this).val();
        if (firstSelection) {
          $('#secondDropdown').prop('disabled', false);
          // Make an AJAX call to fetch the options for the second dropdown
          $.ajax({
            url: 'your-server-endpoint',
            data: { selection: firstSelection },
            dataType: 'json',
            success: function(response) {
              populateSecondDropdown(response.options);
            },
            error: function() {
              console.log('Error occurred while fetching options.');
            }
          });
        } else {
          $('#secondDropdown').prop('disabled', true).val('');
          clearOutputTable();
        }
      });
      
      $('#secondDropdown').on('change', function() {
        var firstSelection = $('#firstDropdown').val();
        var secondSelection = $(this).val();
        if (secondSelection) {
          addToOutputTable(firstSelection, secondSelection);
        }
      });
    });

    function populateSecondDropdown(options) {
      $('#secondDropdown').html('<option value="">Select an option</option>');
      options.forEach(function(option) {
        $('#secondDropdown').append('<option value="' + option + '">' + option + '</option>');
      });
    }

    function addToOutputTable(firstSelection, secondSelection) {
      var newRow = $('<tr><td>' + firstSelection + '</td><td>' + secondSelection + '</td></tr>');
      $('#outputTable tbody').append(newRow);
    }

    function clearOutputTable() {
      $('#outputTable tbody').empty();
    }
  