/**
 * Schema definitions for the OpenRouter service
 *
 * These types define the data structures used for communication with the OpenRouter API.
 */

import type { CardData } from "@/types";

/**
 * Defines the format for structured responses from the API
 */
export interface ResponseFormat {
  response_format: {
    type: "json_schema";
    json_schema: {
      name: string;
      strict: boolean;
      schema: CardData;
    };
  };
}

/**
 * Parameters for configuring the LLM model behavior
 */
export interface ModelParams {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  [key: string]: any;
}

/**
 * Options for updating service configuration
 */
export interface ConfigOptions {
  systemMessage?: string;
  responseFormat?: ResponseFormat;
  modelName?: string;
  modelParams?: ModelParams;
  apiKey?: string;
  endpoint?: string;
}

/**
 * Structure of the request body sent to the OpenRouter API
 */
export interface RequestBody {
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  model: string;
  response_format?: ResponseFormat;
  [key: string]: any;
}

/**
 * Usage information returned in the API response
 */
export interface ResponseUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Message structure in the response
 */
export interface ResponseMessage {
  role: string;
  content: string | null;
  tool_calls?: any[];
}

/**
 * Choice object in the response
 */
export interface ResponseChoice {
  finish_reason: string | null;
  native_finish_reason?: string | null;
  index: number;
  message: ResponseMessage;
  error?: any;
}

/**
 * Structure of the response received from the OpenRouter API
 */
export interface OpenRouterResponse {
  id: string;
  choices: ResponseChoice[];
  created: number;
  model: string;
  object: string;
  system_fingerprint?: string;
  usage?: ResponseUsage;
  [key: string]: any;
}
