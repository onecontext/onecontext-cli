import React, {useState} from 'react';
import {render, Box, Text, Newline} from 'ink';
import SelectInput from 'ink-select-input';
import * as fs from 'fs';
import * as path from 'path';
import * as OneContext from 'onecontext'
import Spinner from 'ink-spinner';

import {Credentials} from '../../../setup.js';
import * as zod from "zod";

const {API_KEY, BASE_URL} = Credentials

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the knowledge base to upload the file to'),
	metadataJson: zod.string().default("{}").describe('Metadata to attach to the file').transform((metadata) => {
		return JSON.parse(metadata)
	})
})

type Props = {options: zod.infer<typeof options>};

interface FileItem {
	label: string;
	value: string;
}

const FileUpload = ({options}: Props) => {

	const [directory, setDirectory] = useState(process.cwd());
	const [selected, setSelected] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [runs, setRuns] = useState([]);

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
			setDirectory(item.value);
		} else {
			setSelected(true)
			const uploadFileArgs: OneContext.UploadFileType = {
				files: [{path: `${item?.value}`}],
				metadataJson: options.metadataJson,
				knowledgeBaseName: options.knowledgeBaseName,
				BASE_URL: options.BASE_URL,
				API_KEY: options.API_KEY,
				stream: false
			}
			OneContext.uploadFile(uploadFileArgs).then((res) => {
				setRuns(res.data)
				setCompleted(true)
			})
		}
	};
	if (completed) {
		return <Text>Upload complete.<Text color={"yellow"}> Triggered the following pipeline runs: </Text>
			<Text color={"green"}>
			{
				runs.map((t: any, i: number) => {
					return <Text key={i}><Newline/><Text>{t}</Text></Text>
				})
			}
			</Text>
		</Text>
	}

	return <Box>
		{selected?<Text color={"green"}><Spinner/> Uploading</Text>:<SelectInput items={items} onSelect={handleSelect}/>}
	</Box>
}

export default FileUpload
