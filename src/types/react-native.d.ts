/// <reference types="react-native" />

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

// Extend the global namespace for additional type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
