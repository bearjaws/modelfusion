import dotenv from "dotenv";
import {
  OpenAIChatFunctionPrompt,
  OpenAIChatMessage,
  OpenAIChatModel,
  useTool,
} from "modelfusion";
import { calculator } from "./calculator-tool";

dotenv.config();

(async () => {
  const { tool, parameters, result } = await useTool(
    new OpenAIChatModel({ model: "gpt-3.5-turbo" }),
    calculator,
    OpenAIChatFunctionPrompt.forToolCurried([
      OpenAIChatMessage.user("What's fourteen times twelve?"),
    ])
  );

  console.log(`Tool: ${tool}`);
  console.log(`Parameters: ${JSON.stringify(parameters)}`);
  console.log(`Result: ${result}`);
})();