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
					let errorMessageDiv = document.getElementById("loginResult");
					errorMessageDiv.innerHTML = "User/Password combination incorrect";
					errorMessageDiv.style.display = "block"; // Make the error message visible
				
					// Hide the message after 3 seconds (3000 milliseconds)
					setTimeout(function() {
						errorMessageDiv.style.display = "none";
					}, 3000);
				
					return;
				}
				else
				{
					firstName = jsonObject.firstName;
					lastName = jsonObject.lastName;
					saveCookie();
					window.location.href = "contacts.html";
				}
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