import React from 'react';
import { Box, Text  } from 'ink';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';

// Read the version from package.json
const CreateAccount = () => {

	const packageJsonPath = resolve( './package.json');
	const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

	return (
		<Box flexDirection="column">
			<>
				<Text>You are running version
					<Text color={"green"}> {packageJson.version}</Text> of the OneCLI.
				</Text>
			</>
		</Box>
	);
};

export default CreateAccount;
