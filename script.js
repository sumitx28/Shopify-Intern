var p = document.getElementById("textbox");
var list = document.getElementById("list");
var engine = document.getElementById("engineSelect");

// responses array to store the responses and push to local storage
var responses = []

// on start function to load responses from local Storage (if any)
function onStart(){
    var storedResponses = localStorage.getItem("responses");
    if(storedResponses){
        storedResponses = JSON.parse(storedResponses);
        responses = storedResponses;
        storedResponses.forEach(element => {
            createResponse(element);
        });
    }
}

// Calling onStart() to load all previous stored responses
onStart();

// Action when Enter key is pressed
p.addEventListener("keyup" , eventHandler);

function eventHandler(event){
    var keycode = event.code;
    var promptvalue = p.value;

    if(keycode === 'Enter' && promptvalue != ""){

        const data = {
            prompt: promptvalue,
            temperature: 0.5,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        };

        // Request to API
        let request = fetch(`https://api.openai.com/v1/engines/${engine.value}/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer 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`,
            },
            body: JSON.stringify(data)
        });


        // Reveiving response from API
        request.then(res =>
            res.json()).then(d => {

                var responseObject = {
                    prompt : promptvalue,
                    response : d.choices[0].text
                }

                // Pushing response to responses array
                responses.push(responseObject);

                // Storing responses to local Storage
                localStorage.setItem("responses" , JSON.stringify(responses));

                // Creating response on the UI
                createResponse(responseObject);
    
            })

        p.value = "";

    }

}

// Creating response on UI
function createResponse(responseObject){
    var myResult = document.createElement("div");
    myResult.setAttribute("class" , "container");
    
    var promptDiv = document.createElement("div");
    promptDiv.setAttribute("class" , "res");
    
    var promptHeading = document.createElement("div");
    promptHeading.setAttribute("class" , "heading");
    promptHeading.innerHTML = "Prompt   : ";
    
    var prompttext = document.createElement("div");
    prompttext.setAttribute("class" , "content");
    prompttext.innerHTML = responseObject.prompt;
    
    promptDiv.appendChild(promptHeading);
    promptDiv.appendChild(prompttext);
    
    
    var responseDiv = document.createElement("div");
    responseDiv.setAttribute("class" , "res");
    
    var responsetHeading = document.createElement("div");
    responsetHeading.setAttribute("class" , "heading");
    responsetHeading.innerHTML = "Response : ";
    
    var responseText = document.createElement("div");
    responseText.setAttribute("class" , "content");
    responseText.innerHTML = responseObject.response;
    
    responseDiv.appendChild(responsetHeading);
    responseDiv.appendChild(responseText);
    
    myResult.appendChild(promptDiv);
    myResult.appendChild(responseDiv);
    
    list.prepend(myResult);
}