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
	pipelineName: zod.string().describe('Name of the pipeline to delete'),
});

type Props = { options: zod.infer<typeof options> };

const DeletePipeline = ({ options }: Props) => {
	const [loading, setLoading] = useState(false);
	const [confirm, setConfirm] = useState(false);  // state to manage confirmation
	const [beginState, setBeginState] = useState(true);  // state to manage position in tree

	const [text, setText] = useState("");

	useEffect(() => {
		if (confirm && !beginState) {
			setLoading(true);
			try {
				OneContext.deletePipeline(options)
					.then(res => {
						setLoading(false);
						setText(res ? "Deleted pipeline " + options.pipelineName : "Failed to delete pipeline");
					})
					.catch(error => {
						console.error('Failed to delete pipeline:', error);
						setLoading(false);
						setText("Failed to delete pipeline");
					});
			} catch (error) {
				console.error('Failed to delete pipeline:', error);
				setLoading(false);
				setText("Failed to delete pipeline");
			}
		}
		else {
			setLoading(false)
			setText("Pipeline deletion canceled.");
		}
	}, [confirm]); // Dependency on `confirm` to initiate delete

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
				<Text>Are you sure you want to delete the pipeline <Text color="red">{options.pipelineName}</Text>? This is irreversible. (Yes/No)</Text>
				<SelectInput items={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} onSelect={handleConfirm} />
			</Box>
		);
	}

	return (
		<>
			{loading ? (
				<Text color="green"><Spinner type="dots" /> Deleting pipeline <Text color="red">{options.pipelineName}</Text></Text>
			) : (
				<Box borderStyle="round" flexDirection="column">
					<Text><Text color="yellow">Status:</Text> {text}</Text>
				</Box>
			)}
		</>
	);
};

export default DeletePipeline;
