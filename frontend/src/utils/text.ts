import DOMPurify from 'dompurify'

export function formatTextToHTML(text: string) {
  // Replace **text** with <strong>text</strong>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Replace \n with <br>
  formattedText = formattedText.replace(/\n/g, '<br>')
  // Sanitize the formatted text
  return DOMPurify.sanitize(formattedText)
}
