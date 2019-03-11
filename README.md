# Backend-Life-Gpa

##

**Backend Architect:** Elisha Atulomah

### Live Backend URL:

###

[Technical Design Document](https://docs.google.com/document/d/1kYs8G4W65JW59-OyD9Uzbde-IDhUXHZxo2zBkVksfBU/edit)

/--------------------------------------------/ REGISTER /---------------------------------------/

###

**Register a User**
_method url_: `/api/register`

_http method_: **[POST]**

#### Headers

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `Content-Type` | String | Yes      | Must be application/json |

#### Body

| name         | type   | required | description    |
| ------------ | ------ | -------- | -------------- |
| `username`   | String | Yes      | Must be unique |
| `fullName`   | String | Yes      |                |
| `password`   | String | Yes      |                |
| `email`      | String | No       |                |
| `userImgUrl` | String | No       |                |

#### Example

```
  {
    "username": "siratl",
    "password": "1234",
    "fullName": "Elisha Atulomah",
    "email": "eatulomah@gmail.com",
    "userImgUrl": "image.jpg"
  }
```

#### Response

##### 201 (created)

###### Example Response

```
  {
    "id": 2
    "username": "siratl",
    "password": "1234",
    "fullName": "Elisha Atulomah",
    "email": "eatulomah@gmail.com",
    "userImgUrl": "image.jpg"
  }
```

##### 400 (Bad Request)

```
  {
    "errorMessage": "missing ${itemMissing}"
  }
```

/--------------------------------------------/ LOGIN /---------------------------------------/

### **Login a user**

_method url_: `/api/login`

_http method_: **[POST]**

#### Headers

| name           | type   | required | description              |
| -------------- | ------ | -------- | ------------------------ |
| `Content-Type` | String | Yes      | Must be application/json |

#### Body

| name       | type   | required | description             |
| ---------- | ------ | -------- | ----------------------- |
| `username` | String | Yes      | must be registered user |
| `password` | String | Yes      |                         |

#### Example

```
  {
    "username": "siratl",
    "password": "1234",
  }
```

#### Response

##### 200 (ok)

> no issues logging in

###### Example response

```
{
    "id":2,
    "username":"sitatl",
    "fullName":"Elisha Atulomah",
    "email":null,
    "userImgUrl":null,
    "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2Vybmk"
}
```

##### 400 (Bad Request)

```
  {
    errorMessage: 'missing ${itemMissing}'
  }
```

##### 401 (Unauthorized)

```
{
  errorMessage: "passwords don't match"
}
```

/--------------------------------------------/ ALL USERS /-----------------------------------------/

### **Get all Users**

_method url_: `/api/users`

_http method_: **[GET]**

#### Response

##### 200 (ok)

###### Example response

```
[
  {
     "id": 2,
     "username": "siratl",
     "password": "$2a$12$UzYfINUnqfZh2n180pBswORvPCIrwHKp3d/MEZ69DaRxoLTYj26UG",
     "fullName": "Elisha Atulomah",
     "email": null,
     "userImgUrl": null
  },
  {
     "id": 3,
     "username": "bean",
     "password": "$2a$12$5.flIIREO8kVSwAGdL2iWO1IUKaaN7VgKN9zEX/Z7XXygBupMSQ0W",
     "fullName": "Rowan Atkinson",
     "email": "mrbean@gmail.com",
     "userImgUrl": ""
  },
]
```

/--------------------------------------------/ SINGLE USER /---------------------------------/

### **Get a single User**

_method url_: `/api/users/:id`

_http method_: **[GET]**

#### Response

##### 200 (ok)

###### Example response

```
[
  {
    "id": 2,
    "username": "siratl",
    "password": "$2a$12$UzYfINUnqfZh2n180pBswORvPCIrwHKp3d/MEZ69DaRxoLTYj26UG",
    "fullName": "Elisha Atulomah",
    "email": null,
    "userImgUrl": null
  }
]
```

/--------------------------------------------/ CREATE HABIT /-----------------------------------/

### **Create a Habit**

_method url_: `/api/habits`

_http method_: **[POST]**

#### Headers

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | Must be application/json |
| `authorization` | String | Yes      | token to Authorize user  |

#### Body

| name         | type    | required | description |
| ------------ | ------- | -------- | ----------- |
| `habitTitle` | String  | Yes      |             |
| `completed`  | Boolean | Yes      |             |
| `category`   | String  | Yes      |             |

#### Example

```
  {
    "habitTitle": "Run 10 miles",
    "category": "Physical Fitness",
  }
```

#### Response

##### 201 (created)

###### Example Response

```
  {
    "id": 1,
    "habitTitle": "Run 10 miles",
    "category": "Physical Fitness",
    "completed": false,
    "userId": 2
  }
```

##### 403 (Forbidden)

###### Example Response

```
  {
    "message": "invalid token"
  }
```

/------------------------------------------/ USER HABITS /-------------------------------------/

### **Get a User with all Habits**

_method url_: `/api/user/habits/:id (id meaning userId)`

_http method_: **[GET]**

#### Headers

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | Must be application/json |
| `authorization` | String | Yes      | token to Authorize user  |

#### Response

##### 200 (ok)

###### Example response

```
[
  {
    "id": 2,
    "username": "siratl",
    "password": "$2a$12$xEMuC6KExFMmz95p6jIAoe4CYT1oDPGBPHpxjR4FjIMmUGO09iR.m",
    "fullName": "Elisha Atulomah",
    "email": null,
    "userImgUrl": null,
    "habits": [
        {
            "id": 2,
            "habitTitle": "Run 10 miles",
            "category": "Physical Fitness",
            "completed": false,
            "userId": 2
        },
        {
          "id": 3,
            "habitTitle": "Eat Fruit",
            "category": "Healthy Living",
            "completed": false,
            "userId": 2
        },
        {
          "id": 4,
            "habitTitle": "Study React",
            "category": "Personal Development",
            "completed": false,
            "userId": 2
        },
        ]
    }
]
```

##### 403 (Forbidden)

###### Example Response

```
  {
    "message": "invalid token"
  }
```

/----------------------------------------/ EDIT USER ACCOUNT /----------------------------------/

### **Edit a User Account**

_method url_: `/api/users/:id`

_http method_: **[PUT]**

#### Headers

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | Must be application/json |
| `authorization` | String | Yes      | token to Authorize user  |

#### Body

| name         | type   | required | description    |
| ------------ | ------ | -------- | -------------- |
| `username`   | String | No       | Must be unique |
| `fullName`   | String | No       |                |
| `password`   | String | No       |                |
| `email`      | String | No       |                |
| `userImgUrl` | String | No       |                |

#### Example

```
  {
    "username": "siratl",
    "password": "cheeseSteak123",
    "fullName": "Elisha Atulomah",
  }
```

#### Response

##### 200 (ok)

###### Example Response

```
  {
    "message":"Your account has been updated"
  }
```

##### 401 (Unauthorized)

###### Example Response

```
  {
    "errorMessage": "You are not authorized to edit this Account, Please Login!"
  }
```

##### 403 (Forbidden)

###### Example Response

```
  {
    "message": "Invalid token"
  }
```

/------------------------------------------/ DELETE ACCOUNT /-------------------------------------/

### **Delete an Account**

_method url_: `/api/users/:id`

_http method_: **[DELETE]**

#### Headers

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | Must be application/json |
| `authorization` | String | Yes      | token to Authorize user  |

#### Response

##### 200 (ok)

###### Example Response

```
  {
    "message":"Your account has been deleted"
  }
```

##### 401 (Unauthorized)

###### Example Response

```
  {
    "errorMessage": "You are not authorized to delete this account"
  }
```

##### 403 (Forbidden)

###### Example Response

```
  {
    "message": "invalid token"
  }
```

/------------------------------------------/ GET HABIT /-------------------------------------/

### **Get a single Habit**

_method url_: `/api/habits/:id (as in id of the habit)`

_http method_: **[GET]**

#### Headers

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | Must be application/json |
| `authorization` | String | Yes      | token to Authorize user  |

#### Response

##### 200 (ok)

###### Example response

```
{
    "id": 12,
    "habitTitle": "Run 10 miles",
    "category": "Physical Fitness",
    "completed": false,
    "userId": 2"
}
```

##### 403 (Forbidden)

###### Example Response

```
  {
    "message": "invalid token"
  }
```

/------------------------------------------/ EDIT HABIT /-------------------------------------/

### **Edit a Habit**

_method url_: `/api/habits/:id`

_http method_: **[PUT]**

#### Headers

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | Must be application/json |
| `authorization` | String | Yes      | token to Authorize user  |

#### Body

| name         | type    | required | description |
| ------------ | ------- | -------- | ----------- |
| `habitTitle` | String  | No       |             |
| `category`   | String  | No       |             |
| `completed`  | Boolean | Yes      |             |

#### Example

```
  {
    "habitTitle": "Run 5 miles",
    "category": "Marathon Training",
  }
```

#### Response

##### 200 (ok)

###### Example Response

```
  {
    "message":"Your Habit has been Updated."
  }
```

##### 401 (Unauthorized)

###### Example Response

```
  {
    "errorMessage": "Not authorized to edit this habit."
  }
```

##### 403 (Forbidden)

###### Example Response

```
  {
    "message": "invalid token"
  }
```

/------------------------------------------/ DELETE HABIT /-------------------------------------/

### **Delete a Habit**

_method url_: `/api/habits/:id (id of the habit)`

_http method_: **[DELETE]**

#### Headers

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | Must be application/json |
| `authorization` | String | Yes      | token to Authorize user  |

#### Response

##### 200 (ok)

###### Example Response

```
  {
    "message":"Habit successfully deleted"
  }
```

##### 401 (Unauthorized)

###### Example Response

```
  {
    "errorMessage": "You are not authorized to delete this Habit"
  }
```

##### 403 (Forbidden)

###### Example Response

```
  {
    "message": "invalid token"
  }
```
