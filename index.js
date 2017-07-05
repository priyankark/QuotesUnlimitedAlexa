/**
 * Random Quote
 * Get a Random Quote from an API
 */
const request = require('request');
const requestPromise = require('request-promise');
const API_URL = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
const OPTIONS = {
       uri: API_URL,
       json: true
   };




exports.handler = (event, context) => {

  try {

    if (event.session.new) {
      // New Session
      console.log("NEW SESSION")
    }

    switch (event.request.type) {

      case "LaunchRequest":
        // Launch Request
        console.log(`LAUNCH REQUEST`)
        context.succeed(
          generateResponse(
            buildSpeechletResponse("To use this skill, simply ask to generate a random quote. Be inspired, motivated and productive.", false),
            {}
          )
        )
        break;


      case "IntentRequest":
        // Intent Request
        console.log(`INTENT REQUEST`)

        switch(event.request.intent.name) {
          case "AMAZON.HelpIntent":
          context.succeed(
            generateResponse(
              buildSpeechletResponse("To use this skill, simply ask to generate a random quote. Utterances such as find a quote, generate a quote or just quote, will help you find a quote. ", false),
              {}
            )
          )
          break;
          case "AMAZON.StopIntent":
          context.succeed(
            generateResponse(
              buildSpeechletResponse("Have a good and productive day!", true),
              {}
            )
          )
          break;
          case "AMAZON.CancelIntent":
          context.succeed(
            generateResponse(
              buildSpeechletResponse("Have a good and productive day!", true),
              {}
            )
          )
          break;



          case "GenerateRandomQuote":
            requestPromise( OPTIONS )
        .then( (response) => {
          let quoteText="Try not to become a man of success, but rather try to become a man of value.";
          let author="Albert Einstein";
            if(response.quoteText!==undefined&&response.quoteAuthor!==undefined)
            {
              quoteText = response.quoteText;
              author = response.quoteAuthor || "Unknown";
            }
            context.succeed(
                  generateResponse(
                    buildSpeechletResponse(`${quoteText} quoting ${author}`, true),
                    {}
                  ))
          });
          break;



          default: throw "Bad Intent"
        }
        break;
        case "SessionEndedRequest":
       // Session Ended Request
          console.log(`SESSION ENDED REQUEST`)
          break;

        default:
            context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)

   }

 } catch(error) { context.fail(`Exception: ${error}`) }

}


// Helpers
buildSpeechletResponse = (outputText, shouldEndSession) => {

  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}
