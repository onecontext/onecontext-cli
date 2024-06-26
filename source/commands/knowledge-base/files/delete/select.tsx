import React, { useEffect, useState } from 'react';
import { render, Box, Text, Newline } from 'ink';
import SelectInput from 'ink-select-input';
import * as OneContext from '@onecontext/ts-sdk';
import Spinner from 'ink-spinner';

import { Credentials } from '../../../../setup.js';
import * as zod from "zod";

const { API_KEY, BASE_URL } = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the knowledge base to list files from'),
	skip: zod.number().default(0).optional(),
	limit: zod.number().default(10).optional(),
	sort: zod.string().default("date_created").optional(),
	dateCreatedGte: zod.date().default(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).optional(),
	dateCreatedLte: zod.date().default(new Date()).optional(),
	metadataJson: zod.string().default("{}").describe('Metadata to filter the files').transform((metadata) => {
		return JSON.parse(metadata);
	})
});

interface FileItem {
	label: string;
	value: string;
}
type Props = { options: zod.infer<typeof options> };

const FileDelete = ({ options }: Props) => {
	const [files, setFiles] = useState<FileItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [completed, setCompleted] = useState(false);
	const [deleting, setDeleting] = useState(false);

	useEffect(() => {
		setLoading(true);
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
				setLoading(false);
				if (res && Array.isArray(res) && Array(res).length > 0) {
					const fileItems = res.map(file => ({
						label: file.name, // assuming the response has a 'name' property
						value: file.id // assuming each file has an 'id' that can be used to delete it
					}));
					setFiles(fileItems);
				} else {
					setFiles([]);
				}
			})
			.catch((error) => {
				console.error('Failed to fetch files:', error);
				setLoading(false);
			});
	}, []);

	const handleSelect = (item: FileItem) => {
		setSelectedFile(item);
		setConfirmDelete(false); // Set the flag to show confirmation
	};

	const handleConfirm = (item: any) => {
		if (item.value && selectedFile) {
			setConfirmDelete(true)
			setLoading(true)
			const deleteFilesArgs: OneContext.DeleteFilesType = {
				fileNames: [selectedFile.label],
				knowledgeBaseName: options.knowledgeBaseName,
				BASE_URL: options.BASE_URL,
				API_KEY: options.API_KEY,
			};
			OneContext.deleteFiles(deleteFilesArgs).then(() => {
				setCompleted(true);
				setLoading(false)
			});
		} else {
			setSelectedFile(null);
			return
		}
		setConfirmDelete(false); // Hide confirmation regardless of the choice
		return
	};

	if (loading) {
		return <Text color="green"><Spinner type="dots" /> Deleting file...</Text>;
	}

	if (completed) {
		return <Text>Deleted Successfully.</Text>;
	}

	if (selectedFile) {
		if (!confirmDelete) {
			return (
				<Box>
					<Text>Are you sure you want to delete the file <Text color="red">{selectedFile.label}</Text>? This action is
						irreversible. All of the associated chunks and embeddings with this file will be deleted. (Yes/No)</Text>
					<SelectInput items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} onSelect={handleConfirm} />
				</Box>
			);
		} else {
			if (!completed) {
				return <Text color="green"><Spinner type="dots" /> Deleting file <Text
					color="red">{selectedFile.label}</Text></Text>;
			} else {
				return <Text>Deleted Successfully.</Text>;
			}
		}
	}

	if (deleting) {
		return <Text color="green"><Spinner type="dots" /> Deleting file</Text>;
	}

	return (
		<Box>
			<SelectInput items={files} onSelect={handleSelect} />
		</Box>
	);
};

export default FileDelete;
