var express = require('express');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var pizzapi = require('dominos');
var app = express();
//context for every user information
var contexts = [];

app.get('/smssent', function (req, res) {
 //what message is sent
  var message = req.query.Body;
  var number = req.query.From;
  var twilioNumber = req.query.To;

  var context = null;
  var index = 0;
  var contextIndex = 0;
  contexts.forEach(function(value) {
    console.log(value.from);
    if (value.from == number) {
      context = value.context;
      contextIndex = index;
    }
    index = index + 1;
  });

  console.log('Recieved message from ' + number + ' saying \'' + message  + '\'');

  var conversation = new ConversationV1({
    username: '',
    password: '',
    version_date: ConversationV1.VERSION_DATE_2018_03_10
  });

  console.log(JSON.stringify(context));
  console.log(contexts.length);
  //watson cloud library being used to interact with conversation
  conversation.message({
    input: { text: message },
    workspace_id: '',
    context: context
   }, function(err, response) {
       if (err) {
         console.error(err);
       } else {
         console.log(response.output.text[0]);
         if (context == null) {
           contexts.push({'from': number, 'context': response.context});
         } else {
           contexts[contextIndex].context = response.context;
         }
        //we get a final intent now we know the order
         var intent = response.intents[0].intent;
         console.log(intent);
         if (intent == "done") {
         //remove previous context
           contexts.splice(contextIndex,1);
           // Call npm library to order the pizza
           //Input order from your message of order
	console.log("Getting order from file...");
	var order = new pizzapi.Order(message);
	//Add items to order
	console.log("Adding items to order...")
	var items = message;
	for (var i=0; i<items.length; i++) {
	  order.addItem(
	    new pizzapi.Item(
	      items[i]
	    )
	  );
	}
        }

         var client = require('twilio')(
           '',
           ''
         );
       //send watson response to customer
         client.messages.create({
           from: twilioNumber,
           to: number,
           body: response.output.text[0]
         }, function(err, message) {
           if(err) {
             console.error(err.message);
           }
         });
       }
  });

  res.send('');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
