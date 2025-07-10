declare global {
  interface Window {
    __pdfExportMode?: boolean;
    __expandAllFundSourceNodes?: () => void;
    __restoreFundSourceNodes?: () => void;
  }
}

export {};