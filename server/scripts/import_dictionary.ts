import mongoose from 'mongoose'
import { WordRepository } from 'repositories'
import https from 'node:https'

const getDictionary = async () => {
  return new Promise<object>((resolve) => {
    https.get(
      'https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words_dictionary.json',
      (response) => {
        let data = ''
        response.on('data', (chunk) => {
          data += chunk
        })
        response.on('end', () => {
          const strData = data.toString()
          const dictionary = JSON.parse(strData)
          resolve(dictionary)
        })
      }
    )
  })
}

const main = async () => {
  const dictionary = await getDictionary()
  mongoose.connect('mongodb://user:pass@localhost:27017')
  const wordRepository = new WordRepository()
  for (const word of Object.keys(dictionary)) {
    await wordRepository.register(word)
    console.log(word)
  }
  console.log('FINISHED')
}

main()
