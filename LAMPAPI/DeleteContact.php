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
    
    $contactID = $inData["ID"];  // Assuming 'ID' is the key used in the JSON object for the contact's ID

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID=?");
        $stmt->bind_param("i", $contactID);
        $stmt->execute();
        
        if ($stmt->affected_rows > 0)
        {
            returnWithInfo();
        }
        else
        {
            returnWithError("No Contact found with this ID.");
        }

        $stmt->close();
        $conn->close();
    }
?>
