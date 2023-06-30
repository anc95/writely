export type Instruction = {
  id: string
  name: string
  instruction: string
  icon: string
}

export enum ServiceProvider {
  Writely = 'writely',
  OpenAI = 'openai',
  ChatGPT = 'chatgpt',
}

export type Settings = {
  apiKey?: string
  model?: string
  lang?: string
  temperature?: string
  url?: string
  customInstructions?: Instruction[]
  debug?: boolean
  serviceProvider?: ServiceProvider
}
