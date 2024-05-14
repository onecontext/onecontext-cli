import React, {useEffect, useState } from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts_sdk';
import * as zod from 'zod';
import {Credentials} from '../../setup.js';

const {API_KEY, BASE_URL} = Credentials;
export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
})

type Props = {options: zod.infer<typeof options>};

const KnowledgeBaseList = ({options}: Props) => {
	const [knowledgeBases, setKnowledgeBases] = useState(Array<{ id: string, name: string }>);
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		try {
			OneContext.listKnowledgeBases(options)
				.then(res => {
					if (res) {
						setKnowledgeBases(res);
						setLoading(false);
					}
				})
				.catch(error => {
					console.error('Failed to fetch knowledge bases:', error);
					setKnowledgeBases([]);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to fetch knowledge bases:', error);
			setKnowledgeBases([]);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading?<Text><Text color={"green"}><Spinner type="dots"/></Text>{` Loading`}</Text>:
				<Box borderStyle="round" flexDirection="column">
					{ knowledgeBases.length > 0 ?
						knowledgeBases.map((kb, i) => <Text key={i}><Text color="green">Knowledge Base Name:
							</Text><Text color={"#f5f5f5"}> {kb.name}.</Text></Text>) : <Text>No knowledge bases found</Text>
					}
				</Box>
			}
		</>
	)
};

export default KnowledgeBaseList;

