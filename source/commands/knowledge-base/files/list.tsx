import React, { useEffect, useState } from 'react';
import { render, Box, Text, Spacer, Newline } from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts-sdk';
import * as zod from 'zod';
import { Credentials } from '../../../setup.js';

const { API_KEY, BASE_URL } = Credentials;
export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Names of the knowledge bases to list files from'),
	skip: zod.number().default(0).optional(),
	limit: zod.number().default(10).optional(),
	sort: zod.string().default("date_created").optional(),
	nameStartsWith: zod.string().optional(),
	dateCreatedGte: zod.date().default(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).optional(),
	dateCreatedLte: zod.date().default(new Date()).optional(),
	metadataJson: zod.string().default("{}").describe('Metadata to filter the files').transform((metadata) => {
		return JSON.parse(metadata)
	})
})

type Props = { options: zod.infer<typeof options> };
const List = ({ options }: Props) => {
	const [files, setFiles] = useState(Array<{ name: string, status: string, metadata_json: Record<any, any> }>);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			let listFilesArgs: OneContext.ListFilesType = {
				knowledgeBaseNames: [options.knowledgeBaseName],
				BASE_URL: options.BASE_URL,
				API_KEY: options.API_KEY,
				skip: options.skip,
				limit: options.limit,
				sort: options.sort,
				dateCreatedGte: options.dateCreatedGte,
				dateCreatedLte: options.dateCreatedLte,
				metadataJson: options.metadataJson,
			};

			OneContext.listFiles(listFilesArgs)
				.then(res => {
					if (res) {
						if (options.nameStartsWith) {
							const startsWith = options.nameStartsWith;
							// @ts-ignore
							setFiles(res.filter((file: Record<string, string>) => file.name.startsWith(startsWith)));
						}
						else {
							setFiles(res)
						}
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
			{loading ? <Text><Text color={"green"}><Spinner type="dots" /></Text>{` Loading`}</Text> :
				<Box borderStyle="round" flexDirection="column">
					{
						files.map((file, i) => <Text key={i}><Text key={i + "b"} color="yellow">File
							Name:</Text><Text color={"#f5f5f5"} key={i + "a"}> {file.name}</Text></Text>)
					}
				</Box>
			}
		</>
	)
};

export default List;

