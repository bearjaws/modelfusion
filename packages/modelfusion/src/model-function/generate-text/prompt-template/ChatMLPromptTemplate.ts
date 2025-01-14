import { TextGenerationPromptTemplate } from "../TextGenerationPromptTemplate.js";
import { TextChatPrompt, validateChatPrompt } from "./ChatPrompt.js";
import { TextInstructionPrompt } from "./InstructionPrompt.js";

const START_SEGMENT = "<|im_start|>";
const END_SEGMENT = "<|im_end|>";

function segmentStart(role: "system" | "user" | "assistant") {
  return `${START_SEGMENT}${role}\n`;
}

function segment(
  role: "system" | "user" | "assistant",
  text: string | undefined
) {
  return text == null ? "" : `${segmentStart(role)}${text}${END_SEGMENT}\n`;
}

/**
 * Formats a text prompt using the ChatML format.
 */
export function text(): TextGenerationPromptTemplate<string, string> {
  return {
    stopSequences: [END_SEGMENT],
    format(prompt) {
      // prompt and then prefix start of assistant response:
      return segment("user", prompt) + segmentStart("assistant");
    },
  };
}

/**
 * Formats an instruction prompt using the ChatML format.
 *
 * ChatML prompt template:
 * ```
 * <|im_start|>system
 * ${ system prompt }<|im_end|>
 * <|im_start|>user
 * ${ instruction }<|im_end|>
 * <|im_start|>assistant
 * ${response prefix}
 * ```
 */
export function instruction(): TextGenerationPromptTemplate<
  TextInstructionPrompt,
  string
> {
  return {
    stopSequences: [END_SEGMENT],
    format(prompt) {
      return (
        segment("system", prompt.system) +
        segment("user", prompt.instruction) +
        segmentStart("assistant") +
        (prompt.responsePrefix ?? "")
      );
    },
  };
}

/**
 * Formats a chat prompt using the ChatML format.
 *
 * ChatML prompt template:
 * ```
 * <|im_start|>system
 * You are a helpful assistant that answers questions about the world.<|im_end|>
 * <|im_start|>user
 * What is the capital of France?<|im_end|>
 * <|im_start|>assistant
 * Paris<|im_end|>
 * ```
 */
export function chat(): TextGenerationPromptTemplate<TextChatPrompt, string> {
  return {
    format(prompt) {
      validateChatPrompt(prompt);

      let text = prompt.system != null ? segment("system", prompt.system) : "";

      for (const { role, content } of prompt.messages) {
        switch (role) {
          case "user": {
            text += segment("user", content);
            break;
          }
          case "assistant": {
            text += segment("assistant", content);
            break;
          }
          default: {
            const _exhaustiveCheck: never = role;
            throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
          }
        }
      }

      // prefix start of assistant response:
      text += segmentStart("assistant");

      return text;
    },
    stopSequences: [END_SEGMENT],
  };
}
