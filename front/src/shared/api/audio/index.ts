import { getTranscribation, getTranscription, uploadFile } from "@shared/api/audio/api"
import { useBaseQuery } from "@shared/api/hooks"

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

export const useUploadAudioQuery = (data: any, enabled = true) =>
  useBaseQuery<any>({
    data,
    getMethod: uploadFile,
    enabled
  })
