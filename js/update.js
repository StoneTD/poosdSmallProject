//Take the contactList and make a new table in base of that data
function makeTable(contactList){
	clearTable();
	let rows = contactList.split("<br />\r\n");// contains the info of all rows separated

	for(i =0; i < rows.length; i++){ // for each row do the following
		// Get a reference to the table body
		var tbody = document.getElementById("contactsTable").getElementsByTagName("tbody")[0];

		// Create a new row
		var row = tbody.insertRow();
		
		// Insert cells (adjust the number of cells as needed)
		var cell1 = row.insertCell();
		var cell2 = row.insertCell();
		var cell3 = row.insertCell();
		var cell4 = row.insertCell();
		var cell5 = row.insertCell();
		var cell6 = row.insertCell();

		let infoRow = rows[i].split(" "); //get the info for each field in the row
	
		// Add content to the cells
		cell1.innerHTML = infoRow[0];
		cell2.innerHTML = infoRow[1];
		cell3.innerHTML = infoRow[2];
		cell4.innerHTML = infoRow[3];

			// Create buttons for the last two columns
			var deleteButton = document.createElement("button");
			deleteButton.innerHTML = "Delete";
			deleteButton.onclick = function() {
				// Handle button click for column 5
				// Add your custom logic here
				alert("Button 1 clicked");
			};
			cell5.appendChild(deleteButton);
	
			var updateButton = document.createElement("button");
			updateButton.innerHTML = "Update";
			updateButton.onclick = function() {
				// Handle button click for column 6
				// Add your custom logic here
				alert("Button 2 clicked");
			};
			cell6.appendChild(updateButton);	 
	}	 
}

document.addEventListener('DOMContentLoaded', () => {
	// Code to attach event listeners to buttons
	document.querySelectorAll('.rename-button, .delete-button').forEach(button => {
		button.addEventListener('click', () => {
			console.log("Button clicked!");
			const contactId = button.dataset.contactId;

			// For rename button:
			if (button.classList.contains('rename-button')) {
				document.getElementById("update-form").classList.remove("hidden");
				// Populate the form fields with existing data (if needed)
				// ...
				document.getElementById("update-form").addEventListener("submit", (event) => {
					event.preventDefault();
					const updatedContactData = {
						// ... collect data from form fields
					};
					updateContact("update", contactId, updatedContactData);
				});
			} else {
				// For delete button:
				// Make a separate AJAX request to delete the contact
			}
		});
	});
});

function updateContact(action, contactId, data) {
	const xhr = new XMLHttpRequest();
	let url = urlBase + "/EditContact." + extension;
	xhr.open('POST', url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8"); // Set content type to JSON
	xhr.onload = () => {
		try {
			const response = JSON.parse(xhr.responseText);
			if (response.error) {
				// Handle error
				console.error('Request failed:', response.error);
				alert('An error occurred: ' + response.error);
			} else {
				makeTable(xhr.responseText); // Update the table
				document.getElementById("update-form").classList.add("hidden"); //hide the form again
			}
		} catch (error) {
			console.error('Error parsing JSON response:', error);
			alert('An unexpected error occurred.');
		}
	};
	xhr.send(JSON.stringify(data)); // Send JSON-formatted data
}

//Every time we want to update the table, set it empty so that is easier to add to the table
function clearTable() {
	// Get a reference to the table
	var table = document.getElementById("contactsTable");

	// Check if the table exists before further operations
	if (table) {
	// Check if there is a tbody, create one if not
	var tbody = table.querySelector('tbody');
	if (!tbody) {
		tbody = document.createElement('tbody');
		table.appendChild(tbody);
	}

	// Remove all rows from the tbody
	while (tbody.firstChild) {
		tbody.removeChild(tbody.firstChild);
	}
	} else {
	console.error("Table with ID 'contactsTable' not found.");
	}
}