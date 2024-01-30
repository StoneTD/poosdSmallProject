<?php
    // User Registration Script
    $inData = getRequestInfo();
    // Create database connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    // Validate input
    if ($result->num_rows > 0) {
        echo "Username already exists. Please choose a different one.";
    } else {
        // Hash the password
        // Insert new user into the database
        $stmt = $conn->prepare("INSERT INTO Users (firstName, lastName,Login, Password) VALUES (?, ?)");
        $stmt->bind_param("ss",$inData["firstName"], $inData["lastName"], $inData["login"], $inData["password"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "Registration successful!";
        } else {
            echo "Error: " . $stmt->error;
        }
        $stmt->close();
    }
    $checkUser->close();
    $conn->close();
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
?>