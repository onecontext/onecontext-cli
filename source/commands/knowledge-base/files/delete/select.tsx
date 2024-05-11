import React, {useEffect, useState} from 'react';
import {render, Box, Text, Newline} from 'ink';
import SelectInput from 'ink-select-input';
import * as OneContext from 'onecontext'
import Spinner from 'ink-spinner';

import {Credentials} from '../../../../setup.js';
import * as zod from "zod";

const {API_KEY, BASE_URL} = Credentials

interface FileItem {
	label: string;
	value: string;
}

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the knowledge base to list pipelines from'),
	skip: zod.number().default(0).optional(),
	limit: zod.number().default(10).optional(),
	sort: zod.string().default("date_created").optional(),
	dateCreatedGte: zod.date().default(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).optional(),
	dateCreatedLte: zod.date().default(new Date()).optional(),
	metadataJson: zod.string().default("{}").describe('Metadata to filter the files').transform((metadata) => {
		return JSON.parse(metadata)
	})
})

type Props = {options: zod.infer<typeof options>};

const FileUpload = ({options}: Props) => {

	const [files, setFiles] = useState([])
	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState(false);
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		try {
			OneContext.listFiles(options)
				.then(res => {
					if (res) {
						setLoading(false);
						setFiles(res)
					} else {
						setLoading(false)
						setFiles([])
					}
				})
				.catch((error: any) => {
					console.error('Failed to fetch files:', error);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to create pipeline:', error);
			setLoading(false)
		}
	}, []);

	const handleSelect = (item: FileItem) => {
			setSelected(true)
			const deleteFilesArgs: OneContext.DeleteFilesType = {
				fileNames: [`${item?.value}`],
				knowledgeBaseName: options.knowledgeBaseName,
				BASE_URL: options.BASE_URL,
				API_KEY: options.API_KEY,
			}
			OneContext.deleteFiles(deleteFilesArgs).then(() => {
				setCompleted(true)
			})
	};
	if (completed) {
		return <Text>Deleted Successfully.</Text>
	}

	return <Box>
		{selected?<Text color={"green"}><Spinner/> Deleting</Text>:<SelectInput items={files} onSelect={handleSelect}/>}
	</Box>
}

export default FileUpload
