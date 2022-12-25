/**
 * Nome do projeto: Chat I.A
 * Autor: HellFive Osborn
 * Data de entrega: 25/12/2022
 *
 * Este projeto é um chat simples que simula o chat GPT e consome a API da OpenAI. O objetivo deste projeto é explorar a OpenAI e aprender mais sobre ela. Ele se trata mais de um projeto de aprendizado do que de um projeto finalizado.
**/

const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// https://beta.openai.com/account/api-keys
const configuration = new Configuration({ apiKey: "SUA API KEY" });

const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static('web-side/assets/'));

app.get('/', (req, res) => { res.sendFile(__dirname + '/web-side/index.html') });

app.post('/generate-response', async (req, res) => {
  const inputText = req.body.input;
  const modelEngine = req.body.model;
  const response = await generateResponse(inputText, modelEngine);
  res.send(response);
});

async function generateResponse(inputText) {
  const prompt = `${inputText}`;

  // Defina os parâmetros desejados aqui
  const params = {
    model: 'text-davinci-002', // Modelos da I.A https://beta.openai.com/docs/models/gpt-3
    prompt: prompt,
    temperature: 0, // valor de temperatura desejado (sugestão: experimente valores entre 0.5 e 1.0)
    top_p: 1, // valor de top_p desejado (sugestão: experimente valores entre 0.5 e 1.0)
    max_tokens: 2048, // valor de max_tokens desejado (sugestão: verifique o tamanho máximo permitido pelo modelo)
    presence_penalty: 1, // valor de presence_penalty desejado (sugestão: experimente valores entre 0.5 e 1.0)
    stop: "complete"
  };

  try {
    const completions = await openai.createCompletion(params);
    
    // Resposta esta completa.
    if ( completions.data.choices[0].finish_reason === 'stop' ) {
      return completions.data.choices[0].text;
    } else {
      // Resposta não completa envia novamente para receber a resposta completa: complete_text
      setTimeout(generateResponse(inputText), 500);
    }

  } catch (error) {
    return "Ocorreu um erro ao processar a mensagem!";
  }
}

app.listen(8000, () => {
  console.log('WebChat: http://localhost:8000/');
});