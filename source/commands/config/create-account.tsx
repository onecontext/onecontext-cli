import React from 'react';
import { Box, Text  } from 'ink';
import open from 'open';

const CreateAccount = () => {

	open('https://onecontext.ai/settings');

	return (
		<Box flexDirection="column">
			<>
				<Text>We just opened a browser window navigating to https://onecontext.ai/settings !
				Please create an account, get an API key, and then come back here to continue. Note if you executed this command in an environment with no browser / screen (i.e. you have ssh'd into a server), please manually navigate to the URL provided.
				</Text>
			</>
		</Box>
	);
};

export default CreateAccount;
