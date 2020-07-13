# OGTickets Solution API V1

A mordern rubust ticketing system built on NodeJs and TypeScript

Read up the OGTickets Idea Concept [Here](##) with this URL to understand what this Solution(API) implements

This API Live documentation can be found here: [Click here to see API Documentation](##)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites 

Inside the project directory, run

```
npm install

```
to install required dependencies.

### Credentials
This application requires that you setup some paramenters at the  `.env file`, thus:

* Create an env file
* Copy and paste the contents of .env.example file to the .env file you just created : 

*N/B: Replace `SECRET` with any text of your choice*
* Enter the `DBSERVER` ULi and the `DBNAME` name. You can also change the application `PORT` if you wish to.

### Running the project
To start this application, follow the following steps:

* Install the application dependencies with the command:

```
npm install
```

* Generate the application routes by running the command:

```
npm run generate
```

* Start the application locally with the command:

```
npm run start
```
The application will be life on `PORT:5000` if you followed all the above stated process

### Running the tests

To test the application tests on your local machine,

```
npm run test
```
A code coverage report will be seen on your console.

### Auth
To access the protected routes, include the Authentication token as any of the following paramentes
`request.body.token` || `request.query.token` || `request.headers["x-access-token"]` || `request.query.access_token`


## API Endpoints Docs

You can see the documentation for the endpoint on this link `localhost:5000`

## Contribution
This solution is built and maintained by [agavitalis] and Licenced under MIT Licence.
