import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from "dotenv";
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// make sure they are being read correctly and instantiate as global variables
const configDir = path.join(homedir(), '.onecli');
const apiKeyFile = path.join(configDir, 'key.txt');
const baseUrlFile = path.join(configDir, 'base_url.txt');
const API_KEY: string | null = fs.existsSync(apiKeyFile) ? fs.readFileSync(apiKeyFile, 'utf8') : "";
const BASE_URL: string | null = fs.existsSync(baseUrlFile) ? fs.readFileSync(baseUrlFile, 'utf8') : "https://api.onecontext.ai/v1/";

if (!API_KEY || API_KEY === "") {
	console.log("API key not found. Please run `onecli config set-api-key`.");
}

export const Credentials: { API_KEY: string, BASE_URL: string } = {
	API_KEY: API_KEY,
	BASE_URL: BASE_URL
}


