import {
  API_URL, downloadConpsect,
  downloadGlossary, getConspect, getGlossary,
  getTasks,
  QUERY_KEY_AUDIO,
  uploadFile
} from "@shared/api/audio/api"
import { useBaseQuery } from "@shared/api/hooks"
import { useMutation, useQueryClient } from "react-query"
import { CommonResponse, FetchError } from "@shared/api/types"
import { apiClient } from "@shared/api"

export const useGetTranscribationQuery = (data: any, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: getTranscribation,
    enabled
  })

export const useGetTranscriptionQuery = (data: any, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: getTranscription,
    enabled
  })

export const useUploadAudioQuery = (data: File, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: uploadFile,
    enabled
  })

export const useAudioAddFile = () => {
  const queryClient = useQueryClient()

  return useMutation<any, any, { file: File }>(
    (file) => {
      console.log("[mut[", file[0])
      const formData = new FormData()
      formData.append("file", file[0])
      return apiClient.post(`${API_URL}/upload`,{ data: formData })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEY_AUDIO)
      }
    }
  )
}

export const useGetTasks = (data: any, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: getTasks,
    enabled,
    refetchInterval: 15000
  })

export const useDownloadConspect = (data: { id: string }, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: downloadConpsect,
    enabled
  })

export const useDownloadGlossary = (data: { id: string }, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: downloadGlossary,
    enabled
  })

export const useGetConspectQuery = (data: { id: string }, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: getConspect,
    enabled,
    refetchInterval: 15000,
  })

export const useGetGlossaryQuery = (data: { id: string }, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: getGlossary,
    enabled,
    refetchInterval: 15000,
  })