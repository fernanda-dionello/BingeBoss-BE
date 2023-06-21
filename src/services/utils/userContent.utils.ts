import axios, { AxiosRequestConfig } from 'axios';
import { openai } from '../../config/openAI';
import { tokenTmdb } from '../../config/commonVariables';

export const getOpenAIRecommendation = async (watchedContentNames: string[]): Promise<string[]> => {
  let chatCompletionContent = "Based on these series and movies in array of strings format below, give me 10 series and movies recommendation with the titles in just one string splited by comma, don't write anything else, just the string:";
    chatCompletionContent = `${chatCompletionContent} [${watchedContentNames}]`;
  
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: chatCompletionContent}],
    });

    const response = completion.data.choices[0].message?.content?.split(',').map(item => item.trim());
    return response ?? [];
}

export const getRecommendedContentsDetailsUrlParams = (chatCompletionContent: string[]): any[] => {
  const requestParams = chatCompletionContent.map((chatContent) => 
  ({
    query: chatContent,
    include_adult: false,
    language: "en-US",
    page: 1
  }));
  return requestParams;
}

export const fetchMultipleUrls = async (params: AxiosRequestConfig['params'][]): Promise<any[]> => {
  const requests = params.map(param => axios.get(`https://api.themoviedb.org/3/search/multi`, 
  { 
    headers: { Authorization: tokenTmdb },
    params: param
  }));

  const responses = await Promise.all(requests);

  return responses.map(response => response.data.results[0]);

} 