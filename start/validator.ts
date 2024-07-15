import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  required: 'O Campo {{field}} é obrigatório.',
  string: 'O valor do campo {{field}} precisa ser um texto.',
  email: 'O valor do campo {{field}} precisa ser um e-mail válido.',
})
