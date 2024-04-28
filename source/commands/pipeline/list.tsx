import React, {useEffect, useState } from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from 'onecontext';
import * as zod from 'zod';
import {Credentials} from '../../setup.js';

const {API_KEY, BASE_URL} = Credentials;
export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	verbose: zod.boolean().default(false),
})

type Props = {options: zod.infer<typeof options>};

const PipelineList = ({options}: Props) => {
	const [pipes, setPipes] = useState(Array<{ name: string, yaml_config?: string }>);
	const [loading, setLoading] = useState(true);

	useEffect(() => {

		try {
			OneContext.listPipelines(options)
				.then(res => {
					if (res) {
						setPipes(res)
						setLoading(false);
					}
				})
				.catch(error => {
					console.error('Failed to fetch pipelines:', error);
					setPipes([]);
					setLoading(false)
				});
		} catch (error) {
			console.error('Failed to fetch pipelines:', error);
			setPipes([]);
			setLoading(false)
		}
	}, []);

	return (
		<>
			{loading?<Text><Text color={"green"}><Spinner type="dots"/></Text>{` Loading`}</Text>:
				<Box borderStyle="round" flexDirection="column">
					{
						options.verbose ? pipes.map((pipe, i) => <><Text key={i}><Text color="yellow">Pipeline
							Name:</Text><Text> {pipe.name}</Text><Newline/><Text color="green">Pipeline
							Yaml: </Text><Newline/><Text>{pipe.yaml_config}</Text></Text></>) : pipes.map((pipe, i) => <Text color={"blue"} key={i}>Pipeline Name: <Text
							key={i} color={"#f5f5f5"}>{pipe.name}</Text></Text>)
					}
				</Box>
			}
		</>
	)
};

export default PipelineList;

