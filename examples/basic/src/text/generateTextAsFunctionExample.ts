import { OpenAITextGenerationModel } from "ai-utils.js";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const model = new OpenAITextGenerationModel({
    model: "text-davinci-003",
    temperature: 0.7,
    maxTokens: 500,
  });

  const generateStory = model.generateTextAsFunction(
    async ({ character }: { character: string }) =>
      `Write a short story about ${character} learning to love:\n\n`
  );

  const story = await generateStory({ character: "a robot" });

  console.log(story);
})();
