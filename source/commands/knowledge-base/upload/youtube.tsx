import React, {useState} from 'react';
import {render, Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import * as fs from 'fs';
import * as path from 'path';
import * as OneContext from '@onecontext/ts_sdk'

import {Credentials} from '../../../setup.js';
import * as zod from "zod";

const {API_KEY, BASE_URL} = Credentials

export const options = zod.object({
	BASE_URL: zod.string().default(BASE_URL),
	API_KEY: zod.string().default(API_KEY),
	knowledgeBaseName: zod.string().describe('Name of the Knowledge Base to upload to'),
	youtubeurl: zod.string().describe('URL of the YouTube video to upload')
})

type Props = { options: zod.infer<typeof options> };
const YouTubeUpload = ({options}: Props) => {

	const [selected, setSelected] = useState(false)

	const uploadYouTubeArgs: OneContext.YouTubeUrlType = {
		BASE_URL: options.BASE_URL,
		API_KEY: options.API_KEY,
		knowledgeBaseName: options.knowledgeBaseName,
		urls: [options.youtubeurl]
	}
	OneContext.uploadYouTubeUrl(uploadYouTubeArgs).then(() => {
		setSelected(true)
	})

	return <Box>{selected?<Text>Sent YouTube channel to the server. All videos in the channel will be parsed and
		embedded.</Text>:<Text color="green"><Spinner type="dots"/> Sending channel to the server.</Text>}</Box>
}

export default YouTubeUpload
