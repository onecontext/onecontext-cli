#!/usr/bin/env node
import Pastel from 'pastel';
import ora from "ora";
import {Command} from 'commander';

const app = new Pastel({
	importMeta: import.meta,
});

const program = new Command();

const version = '0.0.20';

program.version(version, '-v, --version', 'output the current version').description(
	"Official CLI for OneContext!"
)

program.parse(process.argv);

await app.run();
