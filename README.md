# Express and Mongoose REST API #

Includes user authentication and authorization

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites


What things you need to install the software and how to install them

```
Node: v16.17.0 or Above
MangoDB
GIT
```

### Installing ###

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
1. npm install
2. copy and paste .env.example and rename it to .env
3. vi .env

Change Environment variable mentioned in .env according to your needs

4. npm start
```

## Setup Started

Postman collection for your reference is also added in Root Directory Express - Backend.postman_collection.json

### Create Role ###

Create Role according to user need from given request

```
POST /api/role/add

//Body
{
    "name": "Users",
    "rolePermission": [
        'user-add',
        'user-update',
        'user-delete',
        'user-view',
    ]
}
```

### Create permission with feature ###

Create permission with feature according to user need from given request

Remember for user access permission with "name": "User" is used in users middleware for reference 

```
POST /api/permission/add

//Body
{
    "name": "User",
    "feature": ["Add", "Update", "Delete", "View"]
}
```

Thanks for reading