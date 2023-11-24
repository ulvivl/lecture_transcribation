import { apiClient } from "@shared/api"

const API_URL = "v1/audio"
const QUERY_KEY_AUDIO = "audio"


export const getTranscribation = (data: any) => ({
  key: [QUERY_KEY_AUDIO, data],
  fetch: () => apiClient.get(`${API_URL}/`)
})

export const getTranscription = (data: any) => ({
  key: [QUERY_KEY_AUDIO, data],
  fetch: () => apiClient.get(`${API_URL}/transcription`)
})

export const uploadFile = (data: any) => ({
  key: [QUERY_KEY_AUDIO, data],
  fetch: () =>
    apiClient.post(`${API_URL}/upload`, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      data
    })
})
