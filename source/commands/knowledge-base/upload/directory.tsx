import React, {useState} from 'react';
import {render, Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import * as fs from 'fs';
import * as path from 'path';
import * as OneContext from '@onecontext/ts-sdk'

import {Credentials} from '../../../setup.js';
import * as zod from "zod";

const {API_KEY, BASE_URL} = Credentials

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the knowledge base to upload the file to'),
	metadataJson: zod.string().default("{}")
		.transform((metadata: string) => {
		return JSON.parse(metadata)
	}).describe('Metadata to attach to the file')
})


type Props = { options: zod.infer<typeof options> };

interface FileItem {
	label: string;
	value: string;
}

const DirectoryUpload = ({options}: Props) => {

	const [directory, setDirectory] = useState(process.cwd());
	const [selected, setSelected] = useState(false);

	const items: FileItem[] = fs.readdirSync(directory).map((file) => {
		const filePath = path.join(directory, file);
		const isDirectory = fs.statSync(filePath).isDirectory();
		return {
			label: file + (isDirectory ? '/' : ''),
			value: filePath
		};
	});

	const handleSelect = (item: FileItem) => {
		if (fs.statSync(item.value).isDirectory()) {
			setSelected(true)
			const uploadDirectoryArgs: OneContext.UploadDirectoryType = {
				directory: item?.value+"/",
				metadataJson: options.metadataJson,
				knowledgeBaseName: options.knowledgeBaseName,
				BASE_URL: options.BASE_URL,
				API_KEY: options.API_KEY,
			}
			OneContext.uploadDirectory(uploadDirectoryArgs).then(() => {
			})
		} else {
		}
	};

	return <Box>
		{selected ?
			<Text>Uploading all files in directory to the server. Any pipelines connected to this knowledge base will be
				automatically triggered.</Text> : <SelectInput items={items} onSelect={handleSelect}/>}
	</Box>
}

export default DirectoryUpload
