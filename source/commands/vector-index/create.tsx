import React, {useEffect, useState} from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts_sdk';
import * as zod from 'zod';
import {Credentials} from '../../setup.js';
import fs from "fs";

const {API_KEY, BASE_URL} = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	vectorIndexName: zod.string().describe('Name of the vector index to create'),
	modelName: zod.string().describe('Name of the model you want to use to embed the chunks going into this vector index'),
})

type Props = { options: zod.infer<typeof options> };

const CreateVectorIndex = ({options}: Props) => {
	const [loading, setLoading] = useState(true);
	const [text, setText] = useState("");

	useEffect(() => {
		try {
			OneContext.createVectorIndex(options)
				.then(res => {
					if (res) {
						setLoading(false);
						setText("Created vector index " + res.data.name + " with model " + res.data.model_name)
					} else {
						setLoading(false)
						setText("Failed to create vector index")
					}
				})
				.catch((error: any) => {
					console.error('Failed to create vector index:', error);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to create vector index:', error);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading ? <Text><Text color={"green"}><Spinner type="dots"/></Text>{` Creating vector index`}</Text> :
				<Box borderStyle="round" flexDirection="column">
					<Text>
						<Text color="yellow">Status:</Text> {text}
					</Text>
				</Box>
			}
		</>
	)
};

export default CreateVectorIndex;

