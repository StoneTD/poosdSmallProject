const urlBase = 'http://poosdgroup4.xyz/LAMPAPI';
const extension = 'php';

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		//document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function validInputs(first, last, email, phone){
	var res = true;
	var firstIcon= document.getElementById("firstError");
	var lastIcon= document.getElementById("lastError");
	var emailIcon= document.getElementById("emailError");
	var phoneIcon= document.getElementById("phoneError");

	firstIcon.style.display= 'none';
	lastIcon.style.display= 'none';
	emailIcon.style.display= 'none';
	phoneIcon.style.display= 'none';
	document.getElementById("FirstNameContact").style.borderColor = "black";
	document.getElementById("LastNameContact").style.borderColor = "black";
	document.getElementById("EmailContact").style.borderColor = "black";
	document.getElementById("PhoneContact").style.borderColor = "black";

	if(!first){
		document.getElementById("FirstNameContact").style.borderColor = "red";
		firstIcon.style.display= 'inline-block';
		res= false;
	}

	if(!last){
		document.getElementById("LastNameContact").style.borderColor = "red";
		lastIcon.style.display= 'inline-block';
		res= false;
	}
	var phoneRegex = /^\d{10}$/;

	if (!phoneRegex.test(phone)) {
		document.getElementById("EmailContact").style.borderColor = "red";
		phoneIcon.style.display= 'inline-block';
		res= false;
	}

	var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		document.getElementById("PhoneContact").style.borderColor = "red";
		emailIcon.style.display= 'inline-block';
		res= false;
	}

	return res;
}

function addContact()
{
	readCookie();
	let contactFirstName = document.getElementById("FirstNameContact").value;
	let contactLastName = document.getElementById("LastNameContact").value;
	let contactEmail = document.getElementById("EmailContact").value;
	let contactPhone =  document.getElementById("PhoneContact").value;

	if(!validInputs(contactFirstName, contactLastName, contactEmail, contactPhone)) return;

	let info = {UserID:userId, Phone:contactPhone, FirstName:contactFirstName, LastName:contactLastName, Email:contactEmail};
	let jsonPayload = JSON.stringify( info );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if(this.readyState == 4){
				if(this.status == 200){
					hideContactInfo();
					searchContact(1);
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		alert("Request failed:", err.message);
	}
	
}

function hideContactInfo(){
	document.getElementById("FirstNameContact").value = "";
	document.getElementById("LastNameContact").value = "";
	document.getElementById("EmailContact").value = "";
	document.getElementById("PhoneContact").value = "";

	document.getElementById("firstError").style.display= 'none';
	document.getElementById("lastError").style.display= 'none';
	document.getElementById("emailError").style.display= 'none';
	document.getElementById("phoneError").style.display= 'none';

	document.getElementById("FirstNameContact").style.borderColor = "black";
	document.getElementById("LastNameContact").style.borderColor = "black";
	document.getElementById("EmailContact").style.borderColor = "black";
	document.getElementById("PhoneContact").style.borderColor = "black";

	document.getElementById("contactInfo").style.display = 'none';
}

function showContactInfo(){
	document.getElementById("contactInfo").style.display = 'block';
}

function hideContactInfoUpdate(){
	document.getElementById("FirstNameContactUpdate").innerHTML = "";
	document.getElementById("LastNameContactUpdate").innerHTML = "";
	document.getElementById("EmailContactUpdate").innerHTML = "";
	document.getElementById("PhoneContactUpdate").innerHTML = "";

	document.getElementById("firstErrorUpdate").style.display= 'none';
	document.getElementById("lastErrorUpdate").style.display= 'none';
	document.getElementById("emailErrorUpdate").style.display= 'none';
	document.getElementById("phoneErrorUpdate").style.display= 'none';
	
	document.getElementById("FirstNameContactUpdate").style.borderColor = "black";
	document.getElementById("LastNameContactUpdate").style.borderColor = "black";
	document.getElementById("EmailContactUpdate").style.borderColor = "black";
	document.getElementById("PhoneContactUpdate").style.borderColor = "black";

	document.getElementById("update-form").style.display = 'none';
}

function showContactInfoUpdate(contactInfo) 
{
	// Access the form fields by their IDs
	const firstNameField = document.getElementById("FirstNameContactUpdate");
	const lastNameField = document.getElementById("LastNameContactUpdate");
	const emailField = document.getElementById("EmailContactUpdate");
	const phoneField = document.getElementById("PhoneContactUpdate");
	const updateID = document.getElementById("updateID");
	// Add more fields as needed (email, phone, etc.)
  
	firstNameField.value = contactInfo[0]; 
	lastNameField.value = contactInfo[1];
	emailField.value = contactInfo[2];
	phoneField.value = contactInfo[3];
	updateID.textContent = contactInfo[4];

	// Show the form
	document.getElementById("update-form").style.display = 'block';
  }

function searchContact(showAllContacts)
{
	  readCookie();
	  let srch = document.getElementById("searchText").value;
	  //document.getElementById("colorSearchResult").innerHTML = "";
	
	  let contactList = "";

	  // Split the search text into first and last name (assuming space as delimiter)
	  let names = srch.split(" ");

	  // Check if we have first and last name (handle the case when there's only one word)
	  let firstName, lastName;

	//If we want to search a specific contact, give it a value, otherwise, leave it empty to load all contacts
	  if(showAllContacts == 0){
		if (names.length === 1) {
  		  firstName = names[0];
  		  lastName = names[0]; // Set both to the same value if only one word
	  	} 
	 	 else {
  		  firstName = names[0];
  		  lastName = names[1];
	  	}

	  }

	  // Create the object with separate first and last name
	  let tmp = {
  	  firstName: firstName,
  	  lastName: lastName,
  	  userId: userId,
	  };

	  // Convert to JSON payload
	  let jsonPayload = JSON.stringify(tmp);

	  let url = urlBase + '/SearchContacts.' + extension;
	
	  let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    try {
                        let jsonObject = JSON.parse(xhr.responseText);

                        if (jsonObject.error) {
                            // Handle error message from server
                            //alert(jsonObject.error);
							clearTable(); // show nothing since nothing was found
                        } else {
                            // Process results if available
                            contactList = "";
                            for (let i = 0; i < jsonObject.results.length; i++) {
                                let contact = jsonObject.results[i];
                                contactList += contact.FirstName + " " + contact.LastName + " " +contact.Email + " " + contact.Phone + " " +contact.ID;
                                if (i < jsonObject.results.length - 1) {
                                    contactList += "<br />\r\n";
                                }
                            }
							makeTable(contactList);
                        }
                    } catch (err) {
                        // Handle parsing errors
                        console.error("Error parsing response:", err);
                        alert("An error occurred while processing the data.");
                    }
                } else {
                    // Handle HTTP errors
                    alert("Request failed:", this.statusText);
                }
            }
        };
        console.log(jsonPayload);
        xhr.send(jsonPayload);
    } catch (err) {
        alert("Request failed:", err.message);
    }
}

	//Take the contactList and make a new table in base of that data
	function makeTable(contactList){
		clearTable();
		let rows = contactList.split("<br />\r\n");// contains the info of all rows separated
		// Get a reference to the table body
		var tbody = document.getElementById("contactsTable").getElementsByTagName("tbody")[0];

		for(i =0; i < rows.length; i++){ // for each row do the following

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
				
			const updateButton = document.createElement("button");
			updateButton.classList.add("circular-button"); // Add circular button class
			
			// Create an <i> element for the icon
			const updateIcon = document.createElement("i");
			updateIcon.classList.add("fa", "fa-solid", "fa-pen-to-square"); 
			
			// Append the <i> element to the button
			updateButton.appendChild(updateIcon);
			
			cell5.appendChild(updateButton);
			
			updateButton.addEventListener("click", function () {
			  showContactInfoUpdate(infoRow); // Use the current contact information
			});



			 // Create update button with event listener
			 const deleteButton = document.createElement("button");
			 deleteButton.classList.add("circular-button"); // Add circular button class

			 // Create an <i> element for the icon
			const deleteIcon = document.createElement("i");
			deleteIcon.classList.add("fa", "fa-solid", "fa-trash"); 

			// Append the <i> element to the button
			deleteButton.appendChild(deleteIcon);

			 cell6.appendChild(deleteButton);
		 
			 deleteButton.addEventListener("click", function()
			 {
			   deleteContact(infoRow); 
			 });
		}	 
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


	
function validInputsUpdate(first, last, email, phone){
	var res = true;
	var firstIcon= document.getElementById("firstErrorUpdate");
	var lastIcon= document.getElementById("lastErrorUpdate");
	var emailIcon= document.getElementById("emailErrorUpdate");
	var phoneIcon= document.getElementById("phoneErrorUpdate");
	document.getElementById("FirstNameContactUpdate").style.borderColor = "black";
	document.getElementById("LastNameContactUpdate").style.borderColor = "black";
	document.getElementById("EmailContactUpdate").style.borderColor = "black";
	document.getElementById("PhoneContactUpdate").style.borderColor = "black";

	firstIcon.style.display= 'none';
	lastIcon.style.display= 'none';
	emailIcon.style.display= 'none';
	phoneIcon.style.display= 'none';

	if(!first){
		document.getElementById("FirstNameContactUpdate").style.borderColor = "red";
		firstIcon.style.display= 'inline-block';
		res= false;
	}

	if(!last){
		document.getElementById("LastNameContactUpdate").style.borderColor = "red";
		lastIcon.style.display= 'inline-block';
		res= false;
	}
	var phoneRegex = /^\d{10}$/;

	if (!phoneRegex.test(phone)) {
		document.getElementById("EmailContactUpdate").style.borderColor = "red";
		phoneIcon.style.display= 'inline-block';
		res= false;
	}

	var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		document.getElementById("PhoneContactUpdate").style.borderColor = "red";
		emailIcon.style.display= 'inline-block';
		res= false;
	}

	return res;
}

	function updateContact() {
		readCookie();
		let contactFirstNameUpdate = document.getElementById("FirstNameContactUpdate").value;
		let contactLastNameUpdate = document.getElementById("LastNameContactUpdate").value;
		let contactEmailUpdate = document.getElementById("EmailContactUpdate").value;
		let contactPhoneUpdate =  document.getElementById("PhoneContactUpdate").value;
		let idContact = document.getElementById("updateID").textContent;

		if(!validInputsUpdate(contactFirstNameUpdate, contactLastNameUpdate, contactEmailUpdate, contactPhoneUpdate)) return;
	
		let info = {UserID: userId, FirstName:contactFirstNameUpdate, LastName:contactLastNameUpdate, Email:contactEmailUpdate, Phone:contactPhoneUpdate,ID:idContact };
		let jsonPayload = JSON.stringify( info );
	
		let url = urlBase + '/EditContact.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if(this.readyState == 4){
					if(this.status == 200){
						hideContactInfoUpdate();
						searchContact(1);
					}
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			alert("Request failed:", err.message);
		}
	}

	function deleteContact(contactInfo){
		var result = window.confirm("Confirm deletion of contact: " + contactInfo[0] + " " + contactInfo[1]);
		if (result) {
			let id = contactInfo[4];
			let info = {ID: id};
			let jsonPayload = JSON.stringify( info );
			let url = urlBase + '/DeleteContact.' + extension;
			let xhr = new XMLHttpRequest();
			xhr.open("POST", url, true);
			try
			{
				xhr.onreadystatechange = function() 
				{
					if(this.readyState == 4){
						if(this.status == 200){
							searchContact(1);
						}
					}
				};
				xhr.send(jsonPayload);
			}
			catch(err)
			{
				alert("Request failed:", err.message);
			}
		} 
	}