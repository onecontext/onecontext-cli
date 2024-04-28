#!/usr/bin/env node
import Pastel from 'pastel';
import ora from "ora";

const app = new Pastel({
	importMeta: import.meta,
});

await app.run();
