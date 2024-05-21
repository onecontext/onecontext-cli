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
	vectorIndexName: zod.string().describe('Name of the vector index to delete'),
});

type Props = { options: zod.infer<typeof options> };

const DeleteVectorIndex = ({ options }: Props) => {
	const [loading, setLoading] = useState(false);
	const [confirm, setConfirm] = useState(false);  // state to manage confirmation
	const [beginState, setBeginState] = useState(true);  // state to manage position in tree

	const [text, setText] = useState("");

	useEffect(() => {
		if (confirm && !beginState) {
			setLoading(true);
			try {
				OneContext.deleteVectorIndex(options).then(res => {
					if (res) {
							setLoading(false);
							setText(res ? "Deleted vector index " + options.vectorIndexName : "Failed to delete vector index " + options.vectorIndexName);
					} else {
						setLoading(false);
						setText("Failed to delete vector index: "+options.vectorIndexName);
					}
					})
					.catch(error => {
						console.error('Failed to delete vector index: '+options.vectorIndexName, error);
						setLoading(false);
						setText("Failed to delete vector index: "+options.vectorIndexName);
					});
			} catch (error) {
				console.error('Failed to delete vector index: '+options.vectorIndexName, error);
				setLoading(false);
				setText("Failed to delete vector index: "+options.vectorIndexName);
			}
		}
		else {
			setLoading(false)
			setText(`Vector Index deletion canceled. ${options.vectorIndexName} lives to see another day.`);
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
				<Text>Are you sure you want to delete the vector index <Text color="red">{options.vectorIndexName}</Text>? This is irreversible. (Yes/No)</Text>
				<SelectInput items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} onSelect={handleConfirm} />
			</Box>
		);
	}

	return (
		<>
			{loading ? (
				<Text color="green"><Spinner type="dots" /> Deleting vector index <Text color="red">{options.vectorIndexName}</Text></Text>
			) : (
				<Box borderStyle="round" flexDirection="column">
					<Text><Text color="yellow">Status:</Text> {text}</Text>
				</Box>
			)}
		</>
	);
};

export default DeleteVectorIndex;
