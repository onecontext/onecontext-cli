import React, { useState, useEffect } from 'react';
import { Box, Text, render } from 'ink';
import Spinner from 'ink-spinner';
import SelectInput from 'ink-select-input';
import * as OneContext from '@onecontext/ts-sdk';
import * as zod from 'zod';
import { Credentials } from '../../setup.js';

const { API_KEY, BASE_URL } = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the knowledge base to delete'),
});

type Props = { options: zod.infer<typeof options> };

const DeleteKnowledgeBase = ({ options }: Props) => {
	const [loading, setLoading] = useState(false);
	const [confirm, setConfirm] = useState(false);  // state to manage confirmation
	const [beginState, setBeginState] = useState(true);  // state to manage position in tree

	const [text, setText] = useState("");

	useEffect(() => {
		if (confirm && !beginState) {
			setLoading(true);
			try {
				OneContext.deleteKnowledgeBase(options).then(res => {
					if (res) {
							setLoading(false);
							setText(res ? "Deleted knowledge base " + options.knowledgeBaseName : "Failed to delete knowledge base " + options.knowledgeBaseName);
					} else {
						setLoading(false);
						setText("Failed to delete knowledge base: "+options.knowledgeBaseName);
					}
					})
					.catch(error => {
						console.error('Failed to delete knowledge base: '+options.knowledgeBaseName, error);
						setLoading(false);
						setText("Failed to delete knowledge base: "+options.knowledgeBaseName);
					});
			} catch (error) {
				console.error('Failed to delete knowledge base: '+options.knowledgeBaseName, error);
				setLoading(false);
				setText("Failed to delete knowledge base: "+options.knowledgeBaseName);
			}
		}
		else {
			setLoading(false)
			setText(`Knowledge Base deletion canceled. ${options.knowledgeBaseName} lives to see another day.`);
		}
	}, [confirm]); //

	const handleConfirm = (item: any) => {
		if (item.value) {
			setConfirm(true);
			setBeginState(false)
		} else {
			setConfirm(false)
			setBeginState(false)
		}
	};

	if (!confirm && !loading && beginState) {
		return (
			<Box flexDirection="column">
				<Text>Are you sure you want to delete the knowledge base <Text color="red">{options.knowledgeBaseName}</Text>? This is irreversible. (Yes/No)</Text>
				<SelectInput items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} onSelect={handleConfirm} />
			</Box>
		);
	}

	return (
		<>
			{loading ? (
				<Text color="green"><Spinner type="dots" /> Deleting knowledge base <Text color="red">{options.knowledgeBaseName}</Text></Text>
			) : (
				<Box borderStyle="round" flexDirection="column">
					<Text><Text color="yellow">Status:</Text> {text}</Text>
				</Box>
			)}
		</>
	);
};

export default DeleteKnowledgeBase;
