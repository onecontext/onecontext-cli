import React, {useEffect, useState } from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from 'onecontext';
import * as zod from 'zod';
import {Credentials} from '../../setup.js';

const {API_KEY, BASE_URL} = Credentials;
export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the knowledge base to list pipelines from')
})

type Props = {options: zod.infer<typeof options>};
const ListFiles = ({options}: Props) => {
	const [files, setFiles] = useState(Array<{ name: string, status: string, metadata_json: Record<any,any> }>);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			OneContext.listFiles(options)
				.then(res => {
					if (res) {
						setFiles(res)
						setLoading(false);
					}
				})
				.catch(error => {
					console.error('Failed to query files:', error);
					setFiles([]);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to query files:', error);
			setFiles([]);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading?<Text><Text color={"green"}><Spinner type="dots"/></Text>{` Loading`}</Text>:
				<Box borderStyle="round" flexDirection="column">
					{
						files.map((file, i) => <Text key={i}><Text key={i+"b"} color="yellow">File
							Name:</Text><Text color={"#f5f5f5"} key={i+"a"}> {file.name}</Text></Text>)
					}
				</Box>
			}
		</>
	)
};

export default ListFiles;

