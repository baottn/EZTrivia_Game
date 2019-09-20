<?php
/*
  Name: Bao Nguyen
  Section : CSE 154 AC
  Date: 5/29/2019

  This file would verify the players' username and password to assign the
  max score for them

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
  - If the username is passed to any valid string that exists in the database and the
  password is a valid value, the API would output the max score in plain text.
*/

  include 'common.php';
  if (isset($_POST["username"], $_POST["password"])) {
    $max_score = verify_user($_POST["username"], $_POST["password"]);
    header("Content-type: text/plain");
    echo $max_score;
  } else {
    handle_request_error("Sorry, wrong parameters, please try again");
  }

  /**
   * verify player's username and password.
   *
   * @param {String} $username - username of the player
   * @param {String} $password - password of the player
   *
   * @return {String} - the max score of the user
   */
  function verify_user($username, $password) {
    $db = get_PDO();

    try {
      $qry = "SELECT password, max_score "
           . "FROM player "
           . "WHERE account = :username;";
      $stmt = $db->prepare($qry);
      $params = ["username" => $username];
      $stmt->execute($params);
    } catch (PDOException $ex) {
      handle_db_error("The user does not exist, please register first");
    }
    $output = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $output = $output[0];
    $db_password = $output["password"];
    if ($db_password !== "admin") {
      $is_password = password_verify($password, $db_password);
    } else {
      $is_password = ($password === $db_password);
    }
    if ($is_password) {
      return $output["max_score"];
    }
    handle_request_error("Invalid password, please try again.");
  }
?>
