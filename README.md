# WebhookInJs

webhooks are use to intigrate third party application. 
![image](https://github.com/user-attachments/assets/e059c6f6-7cba-428a-9a7b-d1f752bfda01)
![image](https://github.com/user-attachments/assets/209b1ce1-6641-4e6d-aa1c-da76f6b674f7)

```@ruby
https://youtu.be/z-BfzrRJuD0?si=jg3_DDKH3WixgiUX 
```
This is the simple webhook in javascript node 
```@ruby
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
 
 
app.use(cors(corsOpts));
 
app.use(express.json());
 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
 
app.use(routes);
 
//-----------------webhooks-----------------------
app.get('/dynamicBot-webhook/ping', (req, res) => {
  console.log("---------------working--------------")
  res.send('PONG');
});
app.post('rr/dynamicBotWebhook/webhook', (req, res) => {
  console.log("______________")
  const data = req.body.intent;
  console.log(req);
  console.log(data);
  res.send(data);
});
 
app.post('/dynamicBotWebhook/webhook', (req, res) => {
  const payload = req.body;
  const data = payload.intent;
  console.log(req.body)
  console.log("______________")
  console.log(data)
  res.send(data)
 
});
 
// const upload = multer();
// app.use(upload.none());
// const webhook = async (req: any,
//   res: any
// ) => {
//   try {
//     // console.log("------------in webhook/dynamicbot000000-----------------")
//     // const intent: JSON = req.body;
//     // console.log("------------intent", intent)
//     // const formdata = req.body
//     // // const data = JSON.parse(intent);
//     // const intent = formdata.intent
//     // const formData = req.body;
//     // Extract form data from the request body
//     const formData = req.body;
//     let intent = formData.intent;
//     // // Assuming your form sends keys like 'intent' and 'userId'
//     // // const intent = formData.intent;
 
//     // console.log("-------------------data-------------------", intent);
//     // const action = data.fulfillment.action;
//     // const query = data.fulfillment.parameters.details;
//     res.json({});
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// }
//http://localhost:4000/dynamicBotWebhook/webhook
// app.post('/dynamicBotWebhook/webhook',webhook)
//-----------------webhooks----------------------
```
In the given below webhook we pass the data in the form-data format: 
```@ruby
// add imports
  app.use(express.json());
  app.use(routes);
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  //-----------------webhooks-----------------------
  app.get('/dynamicBot-webhook/ping', (req, res) => {
    console.log("---------------working--------------")
    res.send('PONG');
  });
  // Function to handle the question and generate a response
  function handleFunction(question) {
    // Implement your logic here to generate a response based on the question
    return 'Generated response based on the question';
  }
  const webhook = async (
    req: any,
    res: any
  ) => {
    try {
      const form = formidable({ multiples: true });

      const a = form.parse(req, (err: any, fields: any, files: any) => {
        if (err) {
          console.log(err);
          return res.status(400).send("Error parsing the form data");
        }
        console.log("--------------r--q reached-------");
        console.log("Fields:", fields); // Form fields
        if (fields) {
          // Step 1: Extract the string inside the intent array
          const intentString = fields.intent[0];
          // Step 2: Parse the extracted string to get the nested JSON object
          const intentObject = JSON.parse(intentString);
          // Step 3: Extract the parameters field from the nested JSON object
          const parameters = intentObject.fulfillment.parameters;
          console.log('-------------------ticket inputs-------------', parameters);
          
        }
      })

    } catch (error) {
      console.log(error);
      res.status(500).send("Something went wrong");
    }
  }
  //http://localhost:4000/dynamicBotWebhook/webhook
  app.post('/dynamicBotWebhook/webhook', webhook)
  //-----------------webhooks-----------------------
// add local server 
```
In the above code formidable is use to add get data in the form format.
In the below code we are calling create ticket inside a webhook.
```@rubyasync function callGraphQlApi(inputData: any, query: any, token: any) {
    try {
      const response = await axios.post('http://localhost:4000/graphql', {
        query: query,
        variables: inputData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // 'Access-Control-Allow-Methods': 'Admin-Tickets'
        }
      });
      console.log("----------------res-----------------", response)
      console.log("-----------data-----", response.data)
      console.log("-----------data1-----", response.data.data)
      return response.data.data;
    } catch (error) {
      console.error('Error making GraphQL request:', error);
      throw error;
    }
  }
  const webhook = async (
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
          const query = gql`mutation CreateTicket($input: CreateTicketInput!) {
  createTicket(input: $input) {
    status
    message
    data
  }
}`;
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0OCwiaWF0IjoxNzIxMjE5NzY2LCJleHAiOjE3MjEzMDYxNjYsInN1YiI6IjQ0OCJ9.pAzkClGy2xVBEjGcj_UTmLvqmHv74mOYH2rYtDvrsmc';
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
  //http://localhost:4000/dynamicBotWebhook/webhook
  app.post('/dynamicBotWebhook/webhook', webhook)```
```
```@ruby
https://drive.google.com/file/d/1Id6QUq5gl2ZrPbZZn0UbVADoAvna0-UZ/view?usp=sharing
```

