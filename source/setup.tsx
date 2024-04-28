import * as fs from 'fs';
import * as path from 'path';
import * as OneContext from 'onecontext'
import * as dotenv from "dotenv";
import { homedir } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import React from "react";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

// make sure they are being read correctly and instantiate as global variables
const configDir = path.join(homedir(), '.one-cli');
const apiKeyFile = path.join(configDir, 'key.txt');
const baseUrlFile = path.join(configDir, 'base_url.txt');
const API_KEY: string | null = fs.existsSync(apiKeyFile) ? fs.readFileSync(apiKeyFile, 'utf8') : "";
const BASE_URL: string | null = fs.existsSync(baseUrlFile) ? fs.readFileSync(baseUrlFile, 'utf8') : "https://prod.onecontext.ai/v1/";

if (!API_KEY || API_KEY === "") {
	throw new Error("API key not found. Please run `one-cli set_key`.");
}

export const Credentials: { API_KEY: string, BASE_URL: string } = {
	API_KEY: API_KEY,
	BASE_URL: BASE_URL
}


