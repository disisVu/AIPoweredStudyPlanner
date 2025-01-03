import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { llmApi } from '@/api/apiLLM'
import { Loader } from '@/components/Indicator'
import { RootState } from '@/store'
import { useToast } from '@/hooks/use-toast'
import { buildPrompt, formatTextToHTML } from '@/utils'
import { ToolLabel } from '@/components/Text'
import { colors } from '@/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'

export function AIAssistor() {
  const { toast } = useToast()
  const tasks = useSelector((state: RootState) => state.tasks.tasks)
  const [prompt, setPrompt] = useState<string>('')
  const [suggestions, setSuggestions] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const canGenerateSuggestions = tasks.length > 1

  useEffect(() => {
    const newPrompt = buildPrompt(tasks)
    setPrompt(newPrompt)
  }, [tasks])

  // Call the API to get AI suggestions
  const submitRequest = async () => {
    try {
      setIsLoading(true)
      const response = await llmApi.getSuggestions(tasks)
      setSuggestions(response)
    } catch (error) {
      toast({
        title: 'Failed to create or update focus timer.',
        description: error instanceof Error ? error.message : 'An error occurred during focus timer creation or update.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='grid h-full grid-rows-3 px-4 py-3' style={{ color: colors.text_primary }}>
      <div className='row-span-1 flex flex-col gap-1 text-sm'>
        <ToolLabel label='Prompt Preview' />
        <div className='flex h-full flex-col rounded-md border border-gray-300 bg-gray-100'>
          <div className='overflow-y-auto p-3'>
            <p
              className='whitespace-pre-line text-left'
              dangerouslySetInnerHTML={{
                __html: formatTextToHTML(prompt)
              }}
            />
          </div>
          <div
            className={`flex items-center justify-start gap-x-2 rounded-b-md ${canGenerateSuggestions ? 'cursor-pointer bg-purple-700 text-white hover:brightness-125' : 'bg-gray-200 text-black'} px-3 py-2`}
            onClick={canGenerateSuggestions ? submitRequest : () => {}}
          >
            <span className='font-medium'>Generate Suggestions</span>
            <FontAwesomeIcon icon={faArrowDown} />
          </div>
        </div>
      </div>
      <div className='row-span-2 flex flex-col gap-1 pb-7 pt-10 text-sm'>
        <ToolLabel label='LLM Response' />
        <div className='flex h-full flex-col rounded-md border border-gray-300 bg-gray-100'>
          <div className='grow overflow-y-auto p-3'>
            {isLoading ? (
              <Loader />
            ) : (
              <p
                className='whitespace-pre-line text-left'
                dangerouslySetInnerHTML={{
                  __html: formatTextToHTML(suggestions)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
