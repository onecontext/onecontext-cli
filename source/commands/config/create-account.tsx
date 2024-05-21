	import React from 'react';
import { Box, Text  } from 'ink';
import open from 'open';

const CreateAccount = () => {

	open('https://onecontext.ai/settings');

	return (
		<Box flexDirection="column">
			<>
				<Text>We just opened a browser window navigating to https://onecontext.ai/settings !
				Please create an account, get an API key, and then come back here to continue.
				</Text>
			</>
		</Box>
	);
};

export default CreateAccount;
