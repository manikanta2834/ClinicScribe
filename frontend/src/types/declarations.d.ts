/**
 * Global type declarations for third-party libraries.
 * Links lucide-react to its bundled declaration file dist/lucide-react.d.ts
 */

declare module "lucide-react" {
  export * from "lucide-react/dist/lucide-react";
}

interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}


