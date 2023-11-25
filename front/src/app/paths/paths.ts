const createPaths = () => ({
  root: '/',
  taskDetail: '/:id'
});

export type TPaths = ReturnType<typeof createPaths>;

export const paths = createPaths();