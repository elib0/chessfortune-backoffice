// src/types/globals.d.ts
interface GoogleTranslateElement {
  new (options: any, elementId: string): any;
}

interface Window {
  google: {
    translate: {
      TranslateElement: GoogleTranslateElement;
    };
  };
  googleTranslateElementInit: () => void;
}
