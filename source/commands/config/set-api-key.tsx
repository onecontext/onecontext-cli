import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

const ApiKeyCommand = () => {
	const [input, setInput] = useState('');
	const [submitted, setSubmitted] = useState(false);

	const handleInputChange = (value: string) => {
		setInput(value);
	};

	const handleSubmit = () => {
		const configDir = path.join(homedir(), '.one-cli');
		const configFile = path.join(configDir, 'key.txt');

		// Ensure the directory exists
		if (!fs.existsSync(configDir)) {
			fs.mkdirSync(configDir);
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
				<Text color="green">API Key saved successfully!</Text>
			) : (
				<>
					<Text>Enter your API Key:</Text>
					<TextInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} />
				</>
			)}
		</Box>
	);
};

export default ApiKeyCommand;
