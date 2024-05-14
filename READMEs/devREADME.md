# For local DEVELOPMENT of this CLI

## Initial Set-up

### Link your local version of the TS-SDK to this package

#### Make the TS SDK package available locally
```zsh
cd /path/to/your/TS-SDK-repo
npm link
```
- This will make the npm package in that repo available locally.
- The package is called onecontext (because of the package.json)

#### Link the CLI to the local TS SDK
```zsh
cd /path/to/your/CLI-repo
npm link onecontext
```
- This will make the onecontext package dependency in the CLI now references your local version of the TS SDK.
- Note you could also of course just npm install onecontext and take the latest version from npm.
- However, then iteration speed is slower (because you keep needing to publish changes to the official npm repo and then npm install them again in the CLI)
- In production, we will just have a fixed version of the TS SDK on npm that the public version of this CLI will use.

### Build the application
```zsh
npm run build
```

### Run the application
```zsh
onecli --help
```

## Making changes to either the CLI or the TS SDK

### CLI
If you make a change to the CLI, run:
```zsh
npm run build
```
You can then run the CLI again with:
```zsh
onecli --help
```

### TS SDK
If you make a change to the TS SDK, you'll need to compile the package again (using tsc or similar), and make this newer version the linked package it again (using npm link).
To this, you can run:
```zsh
cd /path/to/your/TS-SDK-repo
tsc && npm link
```
Or, you can use the handy script already set up in the package.json of the TS SDK to do this automatically.
```zsh
cd /path/to/your/TS-SDK-repo/
npm run reload
```
Under the hood, running this script runs this command:
```zsh
nodemon --watch './src/**/*.ts' --ext 'ts,js' --exec 'tsc && npm link'
```
This runs a file-watcher, which will watch for changes in the typescript and javascript files in the src folder of the TS SDK, and when it detects a change, it will compile the package and link it again.

