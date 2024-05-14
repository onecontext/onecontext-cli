import React, {useEffect, useState } from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts_sdk';
import * as zod from 'zod';
import {Credentials} from '../../setup.js';

const {API_KEY, BASE_URL} = Credentials;
export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
})

type Props = {options: zod.infer<typeof options>};

const VectorIndexList = ({options}: Props) => {
	const [vectorIndices, setVectorIndices] = useState(Array<{ name: string, model_name: string }>);
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		try {
			OneContext.listVectorIndices(options)
				.then(res => {
					if (res) {
						setVectorIndices(res);
						setLoading(false);
					}
				})
				.catch(error => {
					console.error('Failed to fetch pipelines:', error);
					setVectorIndices([]);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to fetch pipelines:', error);
			setVectorIndices([]);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading?<Text><Text color={"green"}><Spinner type="dots"/></Text>{` Loading`}</Text>:
				<Box borderStyle="round" flexDirection="column">
					{ vectorIndices.length > 0 ?
						vectorIndices.map((vectorIndex, i) => <Text key={i}><Text color="yellow">Name:</Text><Text> {vectorIndex.name}. </Text><Text color="green">Model Name:
							</Text><Text> {vectorIndex.model_name}.</Text></Text>) : <Text>No vector indices found</Text>
					}
				</Box>
			}
		</>
	)
};

export default VectorIndexList;

