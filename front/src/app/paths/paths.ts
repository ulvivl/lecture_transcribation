const createPaths = () => ({
  root: '/',
});

export type TPaths = ReturnType<typeof createPaths>;

export const paths = createPaths();