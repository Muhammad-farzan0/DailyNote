import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('📦 Environment loaded:');
console.log('   GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✅ present' : '❌ missing');
console.log('   GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? '✅ present' : '❌ missing');