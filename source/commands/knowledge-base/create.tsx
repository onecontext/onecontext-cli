import React, {useEffect, useState} from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts-sdk';
import * as zod from 'zod';
import {Credentials} from '../../setup.js';

const {API_KEY, BASE_URL} = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the knowledge base to create')
})

type Props = { options: zod.infer<typeof options> };

const CreateKnowledgeBase = ({options}: Props) => {
	const [loading, setLoading] = useState(true);
	const [text, setText] = useState("");

	useEffect(() => {
		try {
			OneContext.createKnowledgeBase(options)
				.then(res => {
					if (res) {
						setLoading(false);
						setText("Created knowledge base " + options.knowledgeBaseName)
					} else {
						setLoading(false)
						setText("Failed to create knowledge base")
					}
				})
				.catch((error: any) => {
					console.error('Failed to create knowledge base:', error);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to create knowledge base:', error);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading ? <Text><Text color={"green"}><Spinner type="dots"/></Text>{` Creating knowledge base`}</Text> :
				<Box borderStyle="round" flexDirection="column">
					<Text>
						<Text color="yellow">Status:</Text> {text}
					</Text>
				</Box>
			}
		</>
	)
};

export default CreateKnowledgeBase;

