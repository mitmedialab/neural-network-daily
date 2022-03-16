declare var process: {
  env: {
    HOST: number,
    PORT: number,
    NODE_ENV: string
  }
}
export default process;

export const isDevelopmentMode = process.env.NODE_ENV === 'dev';
export const devConsole: Console | undefined = isDevelopmentMode ? console : undefined;