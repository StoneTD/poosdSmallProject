
<?php
    // Function to get the request data
    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    // Function to send JSON back to the client
    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    // Function to return an error message
    function returnWithError( $err )
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    // Function to return with no error (success)
    function returnWithInfo()
    {
        $retValue = '{"error":""}';
        sendResultInfoAsJson( $retValue );
    }

    // Main script
    $inData = getRequestInfo();
    
    $contactID = $inData["ID"]; // Assuming 'ID' is the key used in the JSON object for the contact's ID
    $UserID = $inData["UserID"];
    $FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Email = $inData["Email"];
    $Phone = $inData["Phone"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET UserID=?, FirstName=?, LastName=?, Email=?, Phone=? WHERE ID=?");
        $stmt->bind_param("sssssi", $UserID, $FirstName, $LastName, $Email, $Phone, $contactID);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0)
        {
            returnWithInfo();
        }
        else
        {
            returnWithError("No Contact found with this ID or no changes made.");
        }

        $stmt->close();
        $conn->close();
    }
?>
