import React, {useEffect, useState} from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts-sdk';
import * as zod from 'zod';
import {Credentials} from './../setup.js';

const {API_KEY, BASE_URL} = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	name: zod.string().describe('Name to use for the components'),
})

type Props = { options: zod.infer<typeof options> };

const CreateQuickstart = ({options}: Props) => {
	const [loading, setLoading] = useState(true);
	const [text, setText] = useState("");

	useEffect(() => {
		try {
			OneContext.createQuickStart(options)
				.then(res => {
					if (res) {
						setLoading(false);
						setText("Created vector index " + options.name + "_vi" + " with OpenAI model text-embedding-3-small.\n\n" + "Created knowledge base " + options.name + "_kb.\n\n" + "Created a query and an ingestion pipeline linking the knowledge base and the vector index")
					} else {
						setLoading(false)
						setText("Failed to run quickstart")
					}
				})
				.catch((error: any) => {
					console.error('Failed to run quickstart:', error);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to run quickstart:', error);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading ? <Text><Text color={"green"}><Spinner type="dots"/></Text>{` Running quickstart`}</Text> :
				<Box borderStyle="round" flexDirection="column">
					<Text>
						<Text color="yellow">Status:</Text> {text}
					</Text>
				</Box>
			}
		</>
	)
};

export default CreateQuickstart;

