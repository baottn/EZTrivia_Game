<?php
/*
  Name: Bao Nguyen
  Section : CSE 154 AC
  Date: 5/29/2019

  This file provides back-end support for CSS generator API.
  Based on the input parameters supplied using GET requests,
  the API outputs random CSS styles or a welcome message.

  Web Service details:
  =====================================================================
  Required POST parameters:
  - username
  - password
  examples
  - username: nyancat
  - password: secret
  Output formats:
  - Plain text
  Output Details:
  - If the username is passed and set to any valid string that does not exist
  in the database and the password is passed and set to any string, the API
  will output a plain text that tells the user their information
  has been successfully added to the database
*/

include 'common.php';

$db = GET_PDO();

if (isset($_POST["username"], $_POST["password"])) {
  $hashed_password = password_hash($_POST["password"], PASSWORD_DEFAULT);
  $output = insert_player($db, $_POST["username"], $hashed_password, 0);
  header("Content-type: text/plain");
  echo $output;
} else {
  handle_request_error("Sorry, wrong parameters, please try again");
}

/**
 * put the player information such as username, password and initial max score
 * into the database.
 *
 * @param {PDO}    $db        - the database
 * @param {String} $username  - the player's username
 * @param {String} $password  - the player's password
 * @param {int}    $max_score - the player's max_score
 *
 * @return {String} - the success message
 */
function insert_player($db, $username, $password, $max_score) {
  try {
    $sql = "INSERT INTO `player`(`account`, `password`, `max_score`) "
     ."VALUES (:account, :password, :max_score);";
    $stmt = $db->prepare($sql);
    $params = ["account" => $username,
               "password" => $password,
               "max_score" => $max_score,
    ];
    $stmt->execute($params);

    return "Successfully added {$username}, password, {$max_score}"
  ."into the player database!";
  } catch (PDOException $ex) {
    $error_code = $ex->errorInfo[1];
    if ($error_code === 1062) {
      handle_request_error("Sorry this username is taken, please pick another one");
    } else {
      handle_db_error("Sorry, the player cannot be inserted into the database");
    }
  }
}
?>
