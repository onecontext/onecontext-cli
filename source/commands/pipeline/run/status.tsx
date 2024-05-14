import React, {useEffect, useState} from 'react';
import {render, Box, Text, Spacer, Newline} from 'ink';
import Spinner from 'ink-spinner';
import * as OneContext from '@onecontext/ts_sdk';
import * as zod from 'zod';
import {Credentials} from '../../../setup.js';
import fs from "fs";
import {z} from "zod";

const {API_KEY, BASE_URL} = Credentials;

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	skip: z.number().default(0),
	limit: z.number().default(10),
	sort: z.string().default("date_created"),
	dateCreatedGte: z.date().default(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
	dateCreatedLte: z.date().default(new Date()),
	runid: z.string().optional(),
	status: z.string().optional(),
	showConfig: z.boolean().default(false),
	showSteps: z.boolean().default(false),
})

type Props = { options: zod.infer<typeof options> };

const CheckPipelineRun = ({options}: Props) => {
	const [loading, setLoading] = useState<boolean>(true);
	const [output, setOutput] = useState<any>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			try {
				OneContext.getRunResults(options)
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
				<Text>
					{output.map((run: any, i: number) => {
						return (
							<Text key={i}>
								<Text color={"blue"}>Run id: {run.id}</Text>
								<Newline/>
								{run.status === "SUCCESSFUL" ?
									<Text color={"green"}>Run status: {run.status}</Text> :
									run.status === "RUNNING" ? <Text color={"yellow"}>Run status: {run.status}</Text> :
										<Text color={"red"}>Run status: {run.status} </Text>
								}
								<Newline/>
								<Text color={"yellow"}>Run initiated: <Text>{run.date_created} </Text></Text>

								{options.showSteps &&
									<Text>
										<Newline/>
										<Newline/>
										<Text bold color={"#66FFFF"}>Steps: </Text>
										{
											run.steps && Object.entries(run.steps).map((key0: any) => {
												// return the key and the value
												return (
													<Text>
													<Text key={i}>
														{Object.entries(key0[1]).map((key1: any) => {
															if (!["run_id", "user_id"].includes(key1[0])) {
																return <Text key={i}>
																	<Newline/>
																	<Text color={"#FC6FCF"}>{key1[0]}: </Text><Text color={"#f5f5f5"}>{JSON.stringify(key1[1])} </Text>
																</Text>
															}
															else {
																return <></>
															}
														})}
													</Text>
														<Newline/>
													</Text>
												)
											})
										}
									</Text>
								}

								{options.showConfig &&
									<Text>
										<Newline/>
										<Newline/>
										<Text color={"magenta"}>Pipeline name: <Text color={"magenta"}>{run.pipeline.name} </Text></Text>
										<Newline/>
										<Text color={"#f5f5f5"}>Pipeline config: <Newline/><Text>{run.pipeline.yaml_config} </Text></Text>
									</Text>
								}

								{i !== output.length - 1&& <Text><Newline/><Newline/></Text>}
							</Text>
						)
					})}
				</Text>
			</Box>
			}
		</>
	)
};

export default CheckPipelineRun;

