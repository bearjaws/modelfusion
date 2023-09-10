import {
  OpenAIChatFunctionPrompt,
  OpenAIChatMessage,
  OpenAIChatModel,
  ZodSchema,
  generateJson,
} from "modelfusion";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

async function main() {
  const {
    output: sentiment,
    metadata,
    response,
  } = await generateJson(
    new OpenAIChatModel({
      model: "gpt-3.5-turbo",
      temperature: 0,
      maxCompletionTokens: 50,
    }),
    {
      name: "sentiment" as const,
      description: "Write the sentiment analysis",
      schema: new ZodSchema(
        z.object({
          sentiment: z
            .enum(["positive", "neutral", "negative"])
            .describe("Sentiment."),
        })
      ),
    },
    OpenAIChatFunctionPrompt.forSchemaCurried([
      OpenAIChatMessage.system(
        "You are a sentiment evaluator. " +
          "Analyze the sentiment of the following product review:"
      ),
      OpenAIChatMessage.user(
        "After I opened the package, I was met by a very unpleasant smell " +
          "that did not disappear even after washing. Never again!"
      ),
    ])
  ).asFullResponse();

  console.log(JSON.stringify(sentiment, null, 2));
}

main().catch(console.error);
