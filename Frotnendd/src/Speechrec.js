
const speechRecognizer = window.SpeechRecognition || window.webkitSpeechRecognition;

export const Recognizer = speechRecognizer ? new speechRecognizer() : null;

if (Recognizer) {
       Recognizer.continuous = false;   //false = stops listening automatically after one sentence or pause.
       //true = keeps listening until manually stopped (good for long dictation).


       Recognizer.lang = 'en-us';
       Recognizer.interimResults = false; //false = only final results are returned.
       //true = you get interim (in-progress) speech as it’s being recognized — useful for live transcription.




}