# EZTrivia player API Documentation
The EZTrivia API let the player to register and login to the EZTrivia as well as save
their max score

## Insert player into the API
**Request Format:** player-insert.php endpoint with POST parameter of `username`
and `password`
**Request Type:**: POST

**Returned Data Format**: Plain Text

**Description:** Return the success message that tell you if the user information is
inserted or not

**Example Request:** player-insert.php with POST parameters of `username=nyancat` and
`password=secret`

**Example Response:**

```
Successfully added nyancat, password, 0
```
**Error Handling:**
- If missing parameters or the parameters are incorrect it will error with a helpful
message: `Sorry, wrong parameters, please try again`
- If the account already exists in the database it will error with a helpful message to
tell the user to pick a different username: `Sorry this username
is taken, please pick another one`
- If something wrong happens to the connection to the database it will error with a
helpful message: `Sorry, the player cannot be inserted into the database`

## Verify user information
**Request Format:** player-verify.php endpoint with POST parameter of `username` and `password`

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description:** Return max score of the player that you can get in this API

**Example Request:** player-verify.php with POST parameters of `username=nyancat` and
`password=secret`

**Example Response:**

```
99999
```

**Error Handling:**
- If missing parameters or the parameters are incorrect, it will error with a helpful
message: `Sorry, wrong parameters, please try again`
- If the account does not exist in the database, it will error with a helpful message:
`The user does not exist, please register first`
- If the password which the player enters does not match with that in the database it
will error with a helpful message: `Invalid password, please try again.`

## Update player max score in the API
**Request Format:** player-update.php endpoint with POST parameter of `username` and `maxscore`

**Request Type**: POST

**Returned Data Format**: Plain Text

**Description:** Return the success message when the max score is updated that you
can get in this API

**Example Request:** player-update.php with POST parameters of `username=nyancat` and
`maxscore=99999`

**Example Response:**

```
Successfully update the max score 99999 for nyancat
```

**Error Handling:**
- If missing parameters or the parameters are incorrect it will error with a helpful
message: `Sorry, wrong parameters, please try again`
- If the account does not exist it will error with a funny message:
`The player does not exist. Are you hacking?`
