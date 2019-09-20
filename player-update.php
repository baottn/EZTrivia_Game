<?php
/*
  Name: Bao Nguyen
  Section : CSE 154 AC
  Date: 5/29/2019

  This file would update the max score for the users so that they can close the game
  but still able to get the old score back when they log in to play

  Web Service details:
  =====================================================================
  Required POST parameters:
  - username
  - maxscore
  examples
  - username: nyancat
  - maxscore: 99999
  Output formats:
  - Plain text
  Output Details:
  - If the username is passed to any valid string that exists in the database and the max
  score is a valid value, the API would output the message that tells the user that the
  max score is successfully added.
*/

  include 'common.php';
  if (isset($_POST["username"], $_POST["maxscore"])) {
    header("Content-type: text/plain");
    echo update_max_score($_POST["username"], $_POST["maxscore"]);
  } else {
    handle_request_error("Sorry, wrong parameters, please try again");
  }

  /**
   * update the max score in the server's database.
   *
   * @param {String} $username  - username of the player
   * @param {int}    $max_score - max score that the player achieved
   * 
   * @return {String} - the success message that tells the user max score is updated
   */
  function update_max_score($username, $max_score) {
    $db = get_PDO();

    try {
      $qry = "UPDATE player "
           ."SET max_score = :max_score "
           ."WHERE account = :username;";
      $stmt = $db->prepare($qry);
      $params = ["max_score" => $max_score, "username" => $username];
      $stmt->execute($params);
      return "Successfully update the max score {$max_score} for {$username}";
    } catch (PDOException $ex) {
      handle_db_error("The player does not exist. Are you hacking?");
    }
  }
?>
