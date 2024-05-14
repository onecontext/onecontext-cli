import React, {useEffect, useState} from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts_sdk';
import * as zod from 'zod';
import {Credentials} from '../../../setup.js';
import fs from "fs";

const {API_KEY, BASE_URL} = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	pipelineName: zod.string().describe('Name of the pipeline to create'),
	pipelineYaml: zod.string().describe('Path to the yaml configuration of the pipeline to create. Relative to where you are running the cli from.').transform((path) => {
		return fs.readFileSync(process.cwd() + "/" + path, 'utf8')
	})
})

type Props = { options: zod.infer<typeof options> };

const CreatePipeline = ({options}: Props) => {
	const [loading, setLoading] = useState(true);
	const [text, setText] = useState("");

	useEffect(() => {
		try {
			OneContext.createPipeline(options)
				.then(res => {
					if (res) {
						setLoading(false);
						setText("Created pipeline " + options.pipelineName)
					} else {
						setLoading(false)
						setText("Failed to create pipeline")
					}
				})
				.catch((error: any) => {
					console.error('Failed to create pipeline:', error);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to create pipeline:', error);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading ? <Text><Text color={"green"}><Spinner type="dots"/></Text>{` Creating pipeline`}</Text> :
				<Box borderStyle="round" flexDirection="column">
					<Text>
						<Text color="yellow">Status:</Text> {text}
					</Text>
				</Box>
			}
		</>
	)
};

export default CreatePipeline;

