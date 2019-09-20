<?php
/*
  Name: Bao Nguyen
  Section : CSE 154 AC
  Date: 5/29/2019

  This file connect the server to the database and also
  process errors handled by the server
*/

  /**
   * Returns a PDO object connected to the database. If a PDOException is thrown when
   * attempting to connect to the database, responds with a 503 Service Unavailable
   * error.
   *
   * @return {PDO} connected to the database upon a succesful connection.
   */
  function get_PDO() {
    $host = "localhost";
    $port = "3306";
    $user = "root";
    $password = "root";
    $dbname = "playerdb";

    # Make a data source string that will be used in creating the PDO object
    $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";

    try {
      $db = new PDO($ds, $user, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

      return $db;
    } catch (PDOException $ex) {
      handle_db_error("Cannot connect to the database. Please try again later.");
    }
  }

  /**
   * Prints out a plain text 400 error message given $msg. Remember that 400 errors
   * indicate an invalid request from a client, but that should be separate from
   * any PDO-related (database) errors. Use handle_db_error for anything related
   * to the database.
   *
   * @param $msg {string} - Plain text 400 message to output.
   */
  function handle_request_error($msg) {
    process_error("HTTP/1.1 400 Invalid Request", $msg);
  }

  /**
   * Prints out a plain text 503 error message given $msg. If given a second (optional) argument as
   * an PDOException, prints details about the cause of the exception. See process_error for
   * note about responding with PDO errors to a client.
   *
   * @param $msg {string} - Plain text 503 message to output
   * @param $ex {PDOException} - (optional) Exception object with additional exception details
   */
  function handle_db_error($msg, $ex = null) {
    process_error("HTTP/1.1 503 Service Unavailable", $msg, $ex);
  }

  /**
   * Terminates the program after printing out a JSON error message given $msg after
   * sending the given header error code (handy to factor out error-handling between
   * 400 request errors and 503 db errors).
   * If given an (optional) third argument as an Exception, prints details about
   * the cause of the exception.
   *
   * @param $type {string} - The HTTP error header string.
   * @param $msg {string} - Message to output.
   * @param mixed|null $ex
   */
  function process_error($type, $msg, $ex = null) {
    header($type); # e.g. "HTTP/1.1 400 Invalid Request"
    header("Content-type: text/plain");
    if ($ex) {
      echo "Error details: {$ex} \n";
    }
    die($msg); # die will print the argument and terminate the program.
  }
?>
