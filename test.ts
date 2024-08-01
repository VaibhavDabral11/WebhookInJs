// botgo1/v1-edge-service/src/webhook/test.ts

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { gql } from 'apollo-server-core';
import formidable from 'formidable';
const app = express();
import { print } from 'graphql';
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//-----------------webhooks-----------------------
app.get('/dynamicBot-webhook/ping', (req, res) => {
  console.log("---------------working--------------")
  res.send('PONG');
});

async function callGraphQlApi(inputData: any, query: any, token: any) {
  try {
    const response = await axios.post('http://localhost:4000/graphql', {
      query: print(query),
      variables: inputData
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // 'Access-Control-Allow-Methods': 'Admin-Tickets' // remove permission in permission file 
      }
    });
    return response.data.data;
  } catch (error) {
    console.log('Error making GraphQL request:', error.response ? error.response.data : error.message);
    // Log the error details if available
    if (error.response && error.response.data) {
      console.error('GraphQL Error Details:', error.response.data.errors);
    }
  }
}

export const webhook = async (
  req: any,
  res: any
) => {
  try {
    const form = formidable({ multiples: true });

    const a = form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Error parsing the form data");
      }
      console.log("--------------r--q reached-------");
      console.log("Fields:", fields); // Form fields
      if (fields) {
        const intentString = fields.intent[0];
        const intentObject = JSON.parse(intentString);
        const parameters = intentObject.fulfillment.parameters;
        console.log('-------------------ticket inputs-------------', parameters);
        const ticketTitle = parameters.details["Ticket Title"];
        const ticketDescription = parameters.details["Ticket Description"];

        console.log("Ticket Title:", ticketTitle);
        console.log("Ticket Description:", ticketDescription);
        const inputData = {
          input: {
            categoryTypeId: 1,
            description: ticketDescription,
            priorityId: 1,
            statusId: 1,
            subject: ticketTitle
          }
        }
        const query = gql`
              mutation CreateTicket($input: CreateTicketInput!) {
              createTicket(input: $input) {
              status
              message
              data
              }
             }`;
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0OCwiaWF0IjoxNzIyNTE4NTk3LCJleHAiOjE3MjI2MDQ5OTcsInN1YiI6IjQ0OCJ9.q4KjgDv9zMzbJjAT_nP9gMzAJrPy3sZpKIrxV7lATz4';
        const api = await callGraphQlApi(inputData, query, token);
        console.log("----------import data------", inputData)
        console.log("-------------------tt--------------", api)
      }
    })

  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
}

export const userVerificationWebhook = async (
  req: any,
  res: any
) => {
  try {
    const form = formidable({ multiples: true });

    const a = form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.log(err);
        return res.status(400).send("Error parsing the form data");
      }
      console.log("--------------r--q reached-------");
      console.log("Fields:", fields); // Form fields
      if (fields) {
        const intentString = fields.intent[0];
        const intentObject = JSON.parse(intentString);
        const parameters = intentObject.fulfillment.parameters;
        console.log('-------------------userId--inputs-------------', parameters);
        const userId = parameters.details["Enter your user id"];
        console.log("---------------------userId-------", userId)
        const userId_num = parseInt(userId)
        const inputData = {
          input: {
            userId: userId_num
          }
        }
        const query = gql`query GetUserById($input: getUserById!) {
  getUserById(input: $input) {
    id
    name
    email
    status
    contactNumber
    Designation
    Department
    emailVerified
    onboardingDone
    UserRole {
      roleId
      createdBy
      updatedBy
      userId
      role {
        roleName
      }
    }
    franchiseId
  }
}`;
        console.log("-------------------query--------", query)
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0OCwiaWF0IjoxNzIyNTE4NTk3LCJleHAiOjE3MjI2MDQ5OTcsInN1YiI6IjQ0OCJ9.q4KjgDv9zMzbJjAT_nP9gMzAJrPy3sZpKIrxV7lATz4';
        const api = await callGraphQlApi(inputData, query, token);
        console.log("-----------------------api---------------", api)
        if (api && api.getUserById === null) {
          return res.send({ message: 'No, you are not my user.' });
      } else {
          return res.send({ message: 'Yes, you are my user.' });
      }
      }
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
}
