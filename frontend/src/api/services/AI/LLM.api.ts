import axios from 'axios'
import { Task } from '@/types/schemas'
import { buildPrompt } from '@/utils'

const axiosLM = axios.create({
  baseURL: 'http://localhost:7000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request parameters:
// ------------------
// max_tokens: Maximum number of tokens in response.
// temperature: Controls the randomness of the output by adjusting the probability distribution over possible choices.
// top_p: Controls nucleus sampling, which limits the model’s choices to the most probable tokens whose cumulative probability is at or above this value.
// frequency_penalty: Penalizes tokens that have already been used in the text, discouraging repetition.
// presence_penalty: Encourages the model to introduce new topics or concepts by penalizing tokens that have already appeared.

async function getSuggestions(tasks: Task[]) {
  const prompt = buildPrompt(tasks)

  try {
    const response = await axiosLM.post('/v1/completions', {
      model: 'granite-3.1-8b',
      prompt: prompt,
      max_tokens: 1000,
      temperature: 0.7, // more creativiy and diversity in responses
      top_p: 0.3, // restricts to only high probability tokens, producing safer, more focused responses
      frequency_penalty: 0.0, // allow repetition
      presence_penalty: 0.0 // stick to the same topic
    })

    // Return the generated suggestions
    return response.data.choices[0].text.trim()
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    throw error
  }
}

export const llmApi = { getSuggestions }
