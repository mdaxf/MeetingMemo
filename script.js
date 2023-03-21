function startcaptureaudio(){
  const openai = new OpenAI('apikey', 'v1')
  const engine = 'text-davinci-003'; //'davinci';//
  document.querySelector("#source_logs").innerText ="";
  document.querySelector("#history_logs").innerText ="";
  document.querySelector("#dest_logs").innerText ="";
  const recognition = new webkitSpeechRecognition(); // Create a new speech recognition object
  recognition.lang = 'en-US'; // Set the language of the input audio
  recognition.continuous = true; // Set the recognition to continuous mode
  recognition.interimResults = true; // Enable interim results to get real-time transcription
  let history=""
  let desthistory=""
  let prevTranscript = '';
  // When speech is recognized, send it to the OpenAI API for translation
  recognition.onresult = function(event) {
    
    const transcript = event.results[event.results.length - 1][0].transcript; // Get the latest transcript
    console.log(event.results,transcript, prevTranscript);
    if(prevTranscript == transcript) return;
    prevTranscript = transcript;
    const sourcelang = 'en'
    
    history = history + transcript
    
    document.querySelector("#source_logs").innerText = sourcelang + ':'+transcript;
    document.querySelector("#history_logs").innerText = history;
    
    const language = 'zh'; // Set the desired output language

    const body = {
      prompt: 'Translate this into Chinese: \n' + transcript,
      max_tokens: 100,
      temperature: 0.1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
//      n: 1,
      stream: true      
    }
    openai.complete(engine, JSON.stringify(body),ShowResult,null,null);
  //  console.log(result)
   // ShowResult(result);
  };

  function ShowResult(data){
    if(typeof data =="string") {
      desthistory = desthistory + data; 
      document.querySelector("#dest_logs").innerText += desthistory;
      
    } 
    //return;
    
  }
  // Start the speech recognition
  recognition.start();
  
  // Stream audio from the microphone to the recognition object
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioSource = audioContext.createMediaStreamSource(stream);
      audioSource.connect(recognition);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
  function detectLanguage(text) {
    const detector = new LangDetect(); // Create a new language detector object
    const detectedLanguage = detector.detect(text); // Detect the language of the text
    return detectedLanguage;
  }
}