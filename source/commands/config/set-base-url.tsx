import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

const BaseUrlCommand = () => {
	const [input, setInput] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleInputChange = (value: string) => {
		setInput(value);
	};

	const handleSubmit = () => {
		const configDir = path.join(homedir(), '.onecli');
		const configFile = path.join(configDir, 'base_url.txt');

		// Ensure the directory exists
		if (!fs.existsSync(configDir)) {
			fs.mkdirSync(configDir);
		}

		if (input.slice(-1) !== '/') {
			console.log("Base URL should end with a '/', we modified your input for you.")
			setInput(input + '/');
		}

		// Write the API key to the file
		fs.writeFileSync(configFile, input);
		setSubmitted(true);
		setTimeout(()=> {
			process.exit(0);
		},500)
	};

	useInput((_, key) => {
		if (key.return) {
			handleSubmit();
		}
	});

	return (
		<Box flexDirection="column">
			{submitted ? (
				<Text color="green">Base URL saved successfully!</Text>
			) : (
				<>
					<Text>Enter your Base URL:</Text>
					<TextInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} />
				</>
			)}
		</Box>
	);
};

export default BaseUrlCommand;
