Для запуска части backend
1. `make setup`
2. run all together: `make application` - web app, `make whisper` - consumer with whisperx for transcribation, `make llm_glosary` - consumer with Mistral7B for generation glosary, `make llm_conspect` - with Mistral7B for generation conspect

Для запуска части frontend
0. `cd ./front`
1. `yarn install`
2. `yarn start`
