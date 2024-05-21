import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

const OutputVersion = () => {
	return (
				<>
					<Text>You are running onecli version number: </Text>
					<Text color={"green"}>0.0.21</Text>
				</>
	);
};

export default OutputVersion;
