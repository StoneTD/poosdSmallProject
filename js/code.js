const urlBase = 'http://poosdgroup4.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;

function doRegister() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;

  // Log input values for verification
  console.log("Username:", username);
  console.log("Password:", password);
  console.log("First Name:", firstName);
  console.log("Last Name:", lastName);

  // Check for empty fields
  if (!username || !password || !firstName || !lastName) {
    alert("One field is missing");
    return;
  }

  // Create data object and stringify it
  let info = {
    login: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
  };
  console.log("Data to send:", info);
  let jsonPayload = JSON.stringify(info);

  // Log URL before sending request
  console.log("Sending request to:", urlBase +  '/UserRegistration.' + extension);

  let xhr = new XMLHttpRequest();
  let url =  urlBase +  '/UserRegistration.' + extension;
  console.log("Constructed URL:", url); // Check the constructed URL for accuracy
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
      // Log status code and response text
      console.log("Status code:", this.status);
      console.log("Response text:", this.responseText);

      if (this.status == 200) {
        try {
          let jsonObject = JSON.parse(xhr.responseText);
          if (jsonObject.success) {
            alert("SUCCESS!");
            window.location.href = "contacts.html";
          } else {
            document.getElementById("pass").innerHTML =
              "There was an issue signing up: " + xhr.responseText;
          }
        } catch (e) {
          console.error("Error parsing JSON response:", e.message);
        }
      } else {
        console.error("Error in request:", this.status);
      }
    }
  };

  try {
    xhr.send(jsonPayload);
  } catch (err) {
    alert("Request failed:", err.message);
  }
}


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


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

function addContact()
{
	readCookie();
	alert(userId);
	let contactFirstName = document.getElementById("FirstNameContact").value;
	let contactLastName = document.getElementById("LastNameContact").value;
	let contactEmail = document.getElementById("EmailContact").value;
	let contactPhone =  document.getElementById("PhoneContact").value;

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
					alert("SUCCESS!");
					hideContactInfo();
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
	document.getElementById("contactInfo").style.display = 'none';
}

function showContactInfo(){
	document.getElementById("contactInfo").style.display = 'block';
}

function searchContact()
{
	readCookie();
	let srch = document.getElementById("searchText").value;
	//document.getElementById("colorSearchResult").innerHTML = "";
	
	let contactList = "";

	// Split the search text into first and last name (assuming space as delimiter)
	let names = srch.split(" ");

	// Check if we have first and last name (handle the case when there's only one word)
	let firstName, lastName;
	if (names.length === 1) {
  		firstName = names[0];
  		lastName = names[0]; // Set both to the same value if only one word
	} else {
  		firstName = names[0];
  		lastName = names[1];
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
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4) 
			{
				if(this.status == 200){
					//document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
					let jsonObject = JSON.parse( xhr.responseText );
					if (jsonObject.error) {
						console.log(jsonObject.error);
						return;
					}
					for( let i=0; i<jsonObject.results.length; i++ )
					{
						contactList += jsonObject.results[i];
						if( i < jsonObject.results.length - 1 )
						{
							contactList += "<br />\r\n";
						}
					}
					
					document.getElementsByTagName("p")[0].innerHTML = contactList;
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
