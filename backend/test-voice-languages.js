import dotenv from 'dotenv';
import { synthesizeSarvamSpeech } from './src/services/sarvam.js';
import path from 'path';

// Load the local environment variables manually for testing
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const LANGUAGE_CODES = [
  'en-IN', 'hi-IN', 'pa-IN', 'ta-IN', 'te-IN', 
  'kn-IN', 'mr-IN', 'gu-IN', 'bn-IN', 'ur-IN', 
  'or-IN', 'as-IN', 'ml-IN', 'kok-IN', 'mai-IN', 
  'mni-IN', 'sat-IN', 'brx-IN', 'doi-IN', 'sd-IN', 
  'ks-IN', 'sa-IN'
];

async function runTests() {
  console.log(`Using Sarvam Key: ${process.env.SARVAM_API_KEY ? 'Present' : 'Missing'}`);
  console.log(`Testing ${LANGUAGE_CODES.length} languages for Sarvam TTS...\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const lang of LANGUAGE_CODES) {
    try {
      console.log(`[TESTING] Language: ${lang}...`);
      
      const result = await synthesizeSarvamSpeech({
        text: "Hello, this is a test of the agricultural voice assistant.",
        targetLanguageCode: lang,
      });

      if (result && result.audioBase64) {
        console.log(`✅ [SUCCESS] ${lang} generated audio of length ${result.audioBase64.length}`);
        successCount++;
      } else {
        console.log(`❌ [FAILED] ${lang} returned an empty or invalid response.`);
        failureCount++;
      }
    } catch (error) {
      console.log(`❌ [FAILED] ${lang} threw an error: ${error.message}`);
      failureCount++;
    }
    
    // Quick delay to avoid rate-limiting on the API
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n=== TEST COMPLETE ===`);
  console.log(`Successful Languages: ${successCount}`);
  console.log(`Failed Languages: ${failureCount}`);
  
  if (failureCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
