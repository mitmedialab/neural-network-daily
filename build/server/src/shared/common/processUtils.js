export default process;
export const isDevelopmentMode = process.env.NODE_ENV === 'dev';
export const devConsole = isDevelopmentMode ? console : undefined;
//# sourceMappingURL=processUtils.js.map