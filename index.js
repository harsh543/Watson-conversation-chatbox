var express = require('express');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var app = express();

var contexts = [];

app.get('/smssent', function (req, res) {
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
    version_date: ConversationV1.VERSION_DATE_2016_09_20
  });

  console.log(JSON.stringify(context));
  console.log(contexts.length);

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

         var intent = response.intents[0].intent;
         console.log(intent);
         if (intent == "done") {
           //contexts.splice(contexts.indexOf({'from': number, 'context': response.context}),1);
           contexts.splice(contextIndex,1);
           // Call REST API here (order pizza, etc.)
           //Input order from json
console.log("Getting order from file...");
var order = new pizzapi.Order(
  orderconfig["order"]
);
//Add items to order
console.log("Adding items to order...")
var items = orderconfig["items"];
for (var i=0; i<items.length; i++) {
  order.addItem(
    new pizzapi.Item(
      items[i]
    )
  );
}

// Setup your Credit Card Info
console.log("Setting up credit card info...")
var cardInfo = new order.PaymentObject();
cardInfo.Amount = order.Amounts.Customer;
cardInfo.Number = orderconfig["cardNum"];
cardInfo.CardType = order.validateCC(orderconfig["cardNum"]);
cardInfo.Expiration = orderconfig["cardExp"];//  01/15 just the numbers "01/15".replace(/\D/g,'');
cardInfo.SecurityCode = orderconfig["cardSec"];
cardInfo.PostalCode = orderconfig["cardPost"]; // Billing Zipcode

console.log("Adding card to order...");
order.Payments.push(cardInfo);

//TODO: if no mac address, find one and save it
console.log("Searching for Dash Button...");
var dash = dash_button(orderconfig["dashMacAddress"]);
dash.on("detected", function (){
    console.log("Dash Button Found");
    console.log("Configuring Dash Button...");
	//Validate, price, and place order!
	order.validate(
	    function(result) {
	        console.log("Order is Validated");
	    }
	);
	order.price(
	    function(result) {
            console.log("Order is Priced");
	    }
	);
	order.place(
	    function(result) {
            console.log("Price is", result.result.Order.Amounts, "\nEstimated Wait Time",result.result.Order.EstimatedWaitMinutes, "minutes");
	        console.log("Order placed!");
	    }
	);
	console.log("Listening...");
});
         }

         var client = require('twilio')(
           '',
           ''
         );

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
