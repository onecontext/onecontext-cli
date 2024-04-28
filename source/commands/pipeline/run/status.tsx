import React, {useEffect, useState} from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from 'onecontext';
import * as zod from 'zod';
import {Credentials} from '../../../setup.js';
import fs from "fs";
import {z} from "zod";

const {API_KEY, BASE_URL} = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	runid: z.string().describe('Run ID of the pipeline to get status for'),
})

type Props = { options: zod.infer<typeof options> };

const CheckPipelineRun = ({options}: Props) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [output, setOutput] = useState<any>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			try {
				OneContext.getRunResults({ BASE_URL: options.BASE_URL, API_KEY: options.API_KEY, runID: options.runid })
					.then(res => {
						setOutput(res);
						setLoading(false);
						if (res.status !== 'RUNNING') {
							clearInterval(interval);
						}
					})
					.catch((error: any) => {
						console.error('Failed to fetch pipeline run results:', error);
						setLoading(false);
						clearInterval(interval);
					});
			} catch (error) {
				console.error('Error in fetching data:', error);
				setLoading(false);
				clearInterval(interval);
			}
		}, 2000);

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, []);


	if (loading) {
		return <Text><Text color={"green"}><Spinner type="dots"/></Text>{` Getting run results`}</Text>
	}

	return (
		<>
			{output && <Box borderStyle="round" flexDirection="column">
				<Text color={"cyan"}>Run id: <Text>{output.run_id}</Text></Text>
				<Text color={"yellow"}>Run status: <Text>{output.status} </Text>{output.status === 'RUNNING' && <Text color={"green"}><Spinner type="dots" /></Text>}
				</Text>
				<Text color={"red"}>Run steps: {Object.values(output.steps).map((inner: any, i: number) => {
					return <Text key={i}>
						<Newline/>
						<Text color={"blue"}>Name: </Text><Text color={"#f5f5f5"}>{inner.step_name} </Text>
						<Text color={"blue"}>Success: </Text><Text color={"#f5f5f5"}>{JSON.stringify(inner.success)} </Text>
						<Text color={"blue"}>Summary: </Text><Text color={"#f5f5f5"}>{JSON.stringify(inner.summary)} </Text>
						<Text color={"blue"}>Error: </Text><Text color={"#f5f5f5"}>{JSON.stringify(inner.error_message)} </Text>
				</Text>
				})}</Text>
			</Box>
			}
		</>
	)
};

export default CheckPipelineRun;

