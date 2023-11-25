import React, { Dispatch, FC, ReactNode, ReactNodeArray, SetStateAction, createContext, useContext, useState } from 'react';

export interface IAudioFileContextProps {
  currentFileId: string | null;
  setCurrentFileId: Dispatch<SetStateAction<string | null>>;
}

const AudioFileContext = createContext<IAudioFileContextProps | null>(null);
AudioFileContext.displayName = 'AudioFileContext';

export const AudioFileProvider: FC<{ children: ReactNode | ReactNodeArray }> = ({ children }) => {
  const [currentFileId, setCurrentFileId] =
    useState<string | null>(null);

  return (
    <AudioFileContext.Provider
      value={{
        currentFileId,
        setCurrentFileId,
      }}
    >
      {children}
    </AudioFileContext.Provider>
  );
};

export const useAudioFileProvider = () => {
  const context = useContext(AudioFileContext);

  if (!context) {
    throw new Error(`Hook useAudioFileProvider must be used within AudioFileProvider`);
  }

  return context;
};
