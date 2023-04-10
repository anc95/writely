export type Instruction = {
  id: string
  name: string
  instruction: string
  icon: string
}

export type Settings = {
  apiKey?: string
  model?: string
  lang?: string
  temperature?: string
  url?: string
  customInstructions?: Instruction[]
  debug?: boolean
}
