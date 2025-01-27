import { generateText, llamacpp } from "modelfusion";

async function main() {
  const text = await generateText(
    llamacpp
      .TextGenerator({
        maxGenerationTokens: 512,
        temperature: 0.7,

        // Assuming the default Llama2 7B model is loaded, the context window size is 4096 tokens.
        // See https://www.philschmid.de/llama-2
        // Change value to match the context window size of the model you are using.
        contextWindowSize: 4096,
      })
      .withTextPrompt(),
    "Write a short story about a robot learning to love."
  );

  console.log(text);
}

main().catch(console.error);
