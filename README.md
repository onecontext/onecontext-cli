# Official OneContext CLI Tool
Use this CLI tool to manage your OneContext account.

## What is OneContext?
OneContext is a platform that enables software engineers to compose and deploy custom RAG pipelines on SOTA infrastructure. You define the pipeline in YAML, and OneContext takes care of the rest of the infra (SSL certs, DNS, Kubernetes cluster, GPUs, autoscaling, load balancing, etc).

## Sounds cool. How do I get started?

### Install the tool
<details>
<summary>Get it from npm (recommended)</summary>
```zsh
npm install -g @onecontext/cli
```
</details>


#### Get it from GitHub (this repo)
##### Clone the repo
```zsh
git clone https://github.com/onecontext/cli.git
```
##### Build it
```zsh
cd cli
npm run build
```
##### Make it available
```zsh
npm link
```

### Set up your config

#### Run the below to set your API key
```zsh
onecli config set-api-key
```
##### Don't have an API key?
You can get one [here](https://onecontext.ai/settings)

#### Run the below to set your base URL
```zsh
onecli config set-base-url
```
##### You can (probably) skip this steph
The default base URL for the serverless platform is `https://api.onecontext.ai/v1/`. You'll only need to set a custom base URL if you are on the dedicated plan and have a custom domain. Users on the dedicated plan have a custom GPU cluster set up just for them on their subdomain.

### Ermahgerd it's not working
Some troubleshooting tips:

#### I don't have node installed
```zsh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```
When that's done, run:
```zsh
sudo apt-get install -y nodejs=20.13.1-1nodesource1
```

#### I don't have npm installed
```zsh
sudo apt-get install npm
```

#### I don't have git installed
```zsh
sudo apt-get install git
```

#### I don't have permissions to make a directory
Try adding sudo before the command. For example instead of:
```zsh
npm install -g @onecontext/cli
```
try:
```zsh
sudo npm install -g @onecontext/cli
```

#### I still have an issue
##### Create an issue
Please open an issue on this repo and we'll help you out.
##### Email us
[help](mailto:help@onecontext.ai)
