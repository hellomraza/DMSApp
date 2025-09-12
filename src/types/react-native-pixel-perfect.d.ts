declare module 'react-native-pixel-perfect' {
  interface DesignResolution {
    width: number;
    height: number;
  }

  type PerfectSizeFunction = (size: number) => number;
  function create(designResolution: DesignResolution): PerfectSizeFunction;
  export { create };
  export default create;
}
