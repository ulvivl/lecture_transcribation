import { apiClient } from "@shared/api"

export const API_URL = "audio"
export const API_TASK_URL = "task"
export const QUERY_KEY_AUDIO = "audio"
export const API_DOWNLOAD_URL = "download"
export const API_TEXT_URL = "text"

export const getGlossary = ({ id }: { id: string }) => ({
  key: [QUERY_KEY_AUDIO, id],
  fetch: () => apiClient.get(`${API_TEXT_URL}/glosary`, { params: `task_id=${id}` })
})

export const getConspect = ({ id }: { id: string }) => ({
  key: [QUERY_KEY_AUDIO, id],
  fetch: () => apiClient.get(`${API_TEXT_URL}/conspect`, { params: `task_id=${id}` })
})

// export const getTranscribation = (data: any) => ({
//   key: [QUERY_KEY_AUDIO, data],
//   fetch: () => apiClient.get(`${API_URL}/`)
// })
//
// export const getTranscription = (data: any) => ({
//   key: [QUERY_KEY_AUDIO, data],
//   fetch: () => apiClient.get(`${API_URL}/transcription`)
// })

export const getTasks = (data: any) => ({
  key: [QUERY_KEY_AUDIO, data],
  fetch: () => apiClient.get(`${API_TASK_URL}/list`)
})

export const downloadGlossary = ({ id }: { id: string }) => ({
  key: [QUERY_KEY_AUDIO, id],
  fetch: () => apiClient.get(`${API_DOWNLOAD_URL}/glosary`, { params: `task_id=${id}` })
})

export const downloadConpsect = ({ id }: { id: string }) => ({
  key: [QUERY_KEY_AUDIO, id],
  fetch: () => apiClient.get(`${API_DOWNLOAD_URL}/conspect`, { params: `task_id=${id}` })
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
