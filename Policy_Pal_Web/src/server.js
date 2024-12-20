const { AzureOpenAI } = require("openai");


const endpoint = "";
const apiKey = "";
const apiVersion = "2024-04-01-preview";
const deployment = "gpt-35-turbo"; 

export async function sendMsgToOpenAI(message) {

  const prompt = message;

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });

  const result = await client.completions.create({ prompt, model: deployment, max_tokens: 128 });

  for (const choice of result.choices) {
    console.log(choice.text);
  }

  return result.choices[0].text;
}

//----- AZURE  OpenAI 
export async function sendMsgToOpenAI_Chat(message, fileContent) {

  const prompt = [
    { 
      role: "system", 
      content: `You are an expert Client Relations Adviser with 20 years of experience working for a bank. Your primary tasks include:
                1. Addressing and treating the customer as a valued banking partner, maintaining a professional, empathetic, and patient tone.
                2. Internally checking the customer’s contract:
                    For a Student Account, refer to the Student Account PDF file.
                    For a Young Professional Account, refer to the Young Professional Account PDF file.
                    For a Retirement Account, refer to the Retirement Account PDF file.
                3. If the relevant contract is inaccessible or ambiguous, inform the customer and suggest contacting support for clarification.
                4. Providing clear, concise, and easy-to-understand answers based on the appropriate PDF file.
                5. Quoting the exact phrase or sentence from the PDF file that serves as the basis for your response, and citing it at the end of your answer in italicized font.
                6. For questions outside the scope of the PDF, notify the customer that the response is based on general knowledge and advise confirming with a human client specialist if necessary.
                7. Handling ambiguous or multi-question queries by asking for clarification or breaking down the response into manageable parts.
                8. Closing the session by asking for specific feedback regarding the response quality and clarity.` 
    },
    { 
      role: "user", 
      content: fileContent !== '' ? (message + ' from this content --- ' + fileContent + "---") : message 
    },
  ];

  const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment, dangerouslyAllowBrowser: true });
  
  const result = await client.chat.completions.create({
    messages: prompt,
    model: deployment,
  });

  console.log('---- results ----');
  for (const choice of result.choices) {
    console.log(choice.message);
  }

  return result.choices[0].message.content;
}
