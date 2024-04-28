import React from 'react';
import {Text, Box} from 'ink';

export default function Index() {
	return (
		<>
			<Box flexDirection={"column"} borderStyle={"classic"}>
			<Box flexDirection={"column"} alignItems="center" justifyContent="center" borderStyle={"double"}><Text bold color={"yellow"}>OneContext CLI</Text></Box>
				<Box flexDirection={"column"} alignItems={"center"}><Text color={"green"}>Run one-cli --help for more information on any commands.</Text></Box>
				<Box flexDirection={"column"} alignItems={"center"}><Text color={"yellow"}>https://onecontext.ai</Text></Box>
			</Box>
			</>
	);
}
