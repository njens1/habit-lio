/*
    gemini.js integrates the Gemini AI SDK for affirmation generation
 */

import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const defaultAffirmations = [
    "I am capable of achieving my goals.",
    "I am worthy of success and happiness.",
    "I am in control of my habits and choices.",
    "I am making progress every day.",
    "I am resilient and can overcome challenges."
];

async function generateAffirmations() {
    try{
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: "Give the user a positive affirmation that is 100 characters or less. Here are some examples of positive affirmations: " 
        + defaultAffirmations.join(" ")
        });
        console.log(response.text);
        return response.text;
    } catch (error) {
        console.error("Error generating affirmation: ", error);
        return defaultAffirmations[Math.floor(Math.random() * defaultAffirmations.length)];
    }
}
// // main();
// function callMain() {
//   main();
// }

export { generateAffirmations };