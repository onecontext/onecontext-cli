# Official OneContext CLI Tool
Use this CLI tool to manage your OneContext account.

## What is OneContext?
OneContext is a platform that enables software engineers to compose and deploy custom RAG pipelines on SOTA infrastructure. You define the pipeline in YAML, and OneContext takes care of the rest of the infra (SSL certs, DNS, Kubernetes cluster, GPUs, autoscaling, load balancing, etc).

## Sounds cool. How do I get started?

### Install the tool
<details>
  
<summary>Get it from npm (recommended)</summary>

#### Install globally using npm
```zsh 
npm install -g @onecontext/cli
```

</details>

<details>

<summary>Get it from GitHub</summary>

#### Clone this repo
```zsh 
git clone https://github.com/onecontext/cli.git
```
#### Build it
```zsh
cd cli
npm run build
```
#### Make it available
```zsh
npm link
```

</details>



### Set up your config

<details>

<summary>Your API Key</summary>

#### Run the below to set your API key
```zsh
onecli config set-api-key
```
##### Don't have an API key?
You can get one [here](https://onecontext.ai/settings)

</details>

<details>
<summary>Your base URL</summary>

##### You can (probably) skip this steph
The default base URL for the serverless platform is `https://api.onecontext.ai/v1/`. You'll only need to set a custom base URL if you are on the dedicated plan and have a custom domain. Users on the dedicated plan have a custom GPU cluster set up just for them on their subdomain.

#### Run the below to set your base URL
```zsh
onecli config set-base-url
```

</details>

## Now what?

Now you can do (almost) everything the OneContext platform allows you to do, but from the command line, with a nice TUI. To go through the full gamut of what OneContext offers is beyond the scope of this README. For that, we'll direct you to https://docs.onecontext.ai !

For a quick overview though, please see below:

<details>
<summary>Pipelines</summary>

### List your pipelines
```zsh 
onecli pipeline list
```
This will list your pipelines like so.

<img width="524" alt="Screenshot 2024-05-14 at 21 07 59" src="https://github.com/onecontext/cli/assets/43931816/f6e59572-d9e9-49e7-93e3-817598b5e68b">

Hint: pass a --verbose flag if you want to view the full yaml file for each pipeline.


### Create a new pipeline
```zsh
onecli pipeline create --pipeline-name=index_pipeline --pipeline-yaml=example_yamls/index_pipeline.yaml && \
onecli pipeline create --pipeline-name=retrieve_fast --pipeline-yaml=example_yamls/retriever_pipeline.yaml
```
This command will create a pipeline according to the specification in the provided yaml file.


### Delete a pipeline
```zsh
onecli pipeline delete --pipeline-name=index_pipeline
```
This will ask you for confirmation Yes / No before proceeding.

### Run a pipeline
```zsh
onecli pipeline run sync --pipeline-name=retriever_pipeline
```

### Run a pipeline with overrides to certain fields
```zsh
onecli pipeline run sync --pipeline-name=retrieve_fast --override-args='{"retriever" : {"query" : "the difference between ipv4 and ipv6 and what it means for the internet", "top_k": 1}}'
```
As this is a retriever pipeline, it will return a list of chunks from the vector index. As we've set _top_k_ equal to 1, there will be just one chunk in the list.

<img width="807" alt="image" src="https://github.com/onecontext/cli/assets/43931816/5028b59b-f914-4220-9615-d84ef4ad11f7">


</details>

<details>
<summary>Knowledge Bases</summary>

### List your knowledge bases
```zsh 
onecli knowledge-base list
```

<img width="648" alt="image" src="https://github.com/onecontext/cli/assets/43931816/b1f4fc9e-5a73-4525-9eb1-e8bcbf39d10d">


### Create a new knowledge bases
```zsh
onecli knowledge-base create --knowledge-base-name=demo_kb
```
This will create a new knowledge base you can upload files to.

### Delete a knowledge base
```zsh
onecli knowledge-base delete --knowledge-base-name=demo_kb
```
This will ask you for confirmation Yes / No before deleting.
Note, all the files, chunks, and embeddings connected to this Knowledge Base will be deleted.

</details>


<details>
<summary>Vector Indices</summary>

### List your vector indices
```zsh 
onecli vector-index list
```

<img width="646" alt="image" src="https://github.com/onecontext/cli/assets/43931816/b39ae057-e78e-4434-8d81-9746a568de3e">


### Create a new vector index
```zsh
onecli vector-index create --vector-index-name=demo_vi --model-name=BAAI/bge-base-en-v1.5
```
Note you must pass both the vector index name, _and_ the model name (because each vector index is tied to a particular embedding model).

### Delete a vector index
```zsh
onecli vector-index delete --vector-index-name=demo_vi
```
This will ask you for confirmation Yes / No before deleting.
Note all the embeddings in this vector index will be deleted.
The source files will remain in the knowledge base.

</details>

<details>
<summary>Files</summary>

### List the files in a knowledge base
```zsh 
onecli knowledge-base files list --knowledge-base-name=rm_kb
```
<img width="810" alt="image" src="https://github.com/onecontext/cli/assets/43931816/c55daa5b-d32e-4668-89ae-e90df87f1300">


### Upload a new file to a knowledge base
```zsh
onecli knowledge-base upload file --knowledge-base-name=rm_kb
```
A file picker TUI will open, showing all files in the current directory. If you select a file, it will upload the selected file to the knowledge base.

<img width="804" alt="image" src="https://github.com/onecontext/cli/assets/43931816/9648fd42-3361-453f-ba14-7913d61844dc">

Confirmation will be shown like so:

<img width="807" alt="image" src="https://github.com/onecontext/cli/assets/43931816/f245ea1b-1fab-4b97-929c-d45d89dae47c">


### Upload a new directory of files to a knowledge base
```zsh
onecli knowledge-base upload directory --knowledge-base-name=rm_kb
```
A file picker TUI will open, showing all files in the current directory. If you select a directory, it will upload all PDF, .txt, .docx, and .md within that directory. Confirmation will be shown like so:

<img width="810" alt="image" src="https://github.com/onecontext/cli/assets/43931816/a3db3c6c-b1e9-4c04-9031-79ce313887e7">


### Delete a file from a knowledge base
```zsh
onecli knowledge-base files delete select --knowledge-base-name=rm_kb
```

A file picker TUI will open, showing all files in the current knowledge base (on the server). If you select a file, it will ask you for confirmation Yes / No before deleting. If you delete it, all associated chunks and embeddings will also be deleted.



</details>


<details>
<summary>Runs</summary>

### List the runs executed on your account
```zsh 
onecli pipeline run status
```

<img width="809" alt="image" src="https://github.com/onecontext/cli/assets/43931816/a0d75d2c-66ac-4f85-bb14-9f2215438331">

### Show a particular run
```zsh
onecli pipeline run status --runid=24b554e89fc64e97955cf06e0e14dfc2
```

<img width="812" alt="image" src="https://github.com/onecontext/cli/assets/43931816/cf430dd6-a126-449c-9035-6c9765277437">

### Output the steps for a run
```zsh
onecli pipeline run status --runid=24b554e89fc64e97955cf06e0e14dfc2 --show-steps
```

<img width="811" alt="image" src="https://github.com/onecontext/cli/assets/43931816/f2a0ae25-95f0-471f-9f9f-87c43b6e9643">

Hint: omit the "runid" selector to show this output for _all_ runs on the account.

### Show the full config for the run
```zsh
onecli pipeline run status --runid=24b554e89fc64e97955cf06e0e14dfc2 --show-config
```
<img width="806" alt="image" src="https://github.com/onecontext/cli/assets/43931816/f99b99f8-b2dd-464d-9143-9a7cf9f4551b">

Hint: omit the "runid" selector to show this output for _all_ runs on the account.

### Filter the above by further parameters

If you have multiple runs, you can also further refine the output by passing flags such as:
```skip``` and ```limit``` (for pagination).
```sort``` to sort by a field on the run.
```date-created-gte``` to only show runs with a date greater than or equal to the provided date.
```date-created-lte``` to only show runs with a date less than or equal to the provided date.
```status``` to only show runs with a particular status (e.g. "RUNNING").

For more information execute the below command:
```zsh
onecli pipeline run status -h
```


</details>




## Ermahgerd it's not working
Some troubleshooting tips:


<details>

<summary>I don't have node installed</summary>

### Get it from the interweb
```zsh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```
When that's done, run:
```zsh
sudo apt-get install -y nodejs=20.13.1-1nodesource1
```


</details>

<details>

<summary>I don't have npm installed</summary>

### Get it via apt-get
```zsh
sudo apt-get install npm
```

</details>

<details>

<summary>I don't have git installed</summary>

### Get it via apt-get
```zsh
sudo apt-get install git
```

</details>


<details>

<summary>I don't have permission to make a directory</summary>

### Try it with sudo
i.e. instead of:
```zsh
npm install -g @onecontext/cli
```
try:
```zsh
sudo npm install -g @onecontext/cli
```

</details>

<details>

<summary>I still have an issue</summary>

### Create an issue in this repo
We'll get back to you ASAP, or one of our helpful community will beat us to it.

### Email us
Always happy to hear from our users! Please feel free to reach out. [help](mailto:help@onecontext.ai)

</details>

Thanks!
