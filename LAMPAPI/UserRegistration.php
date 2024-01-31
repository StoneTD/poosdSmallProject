<?php
    // User Registration Script
    $inData = getRequestInfo();

    $login = $inData["login"];
    // Hash the password before storing it
    $password = $inData["password"];
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];

    // Create database connection
    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    // Check connection
    if ($conn->connect_error) {
        returnWithError("Connection failed: " . $conn->connect_error);
    } else {
        // Check if login already exists
        $stmt = $conn->prepare("SELECT Login FROM Users WHERE Login=?");
        $stmt->bind_param("s", $login);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Login already exists
            returnWithError("Login already in use");
        } else {
            // Login is unique, proceed with insertion
            $stmt = $conn->prepare("INSERT INTO Users (Login, Password, firstName, lastName) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $login, $password, $firstName, $lastName);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                sendResponse(true, "Registration successful!");
            } else {
                sendResponse(false, "Error: " . $stmt->error);
            }
            returnWithError(""); // No error, registration successful
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo() {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson($obj) {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err) {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }
    function sendResponse($success, $message) {
        echo json_encode(array("success" => $success, "message" => $message));
    }
?>