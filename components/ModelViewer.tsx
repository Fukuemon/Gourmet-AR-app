import React, { useEffect, FC } from "react";

interface ModelViewerProps {
  src: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": MyElementAttributes;
    }
    interface MyElementAttributes {
      className?: string;
      src: string;
      poster?: string;
      alt?: string;
      ar?: boolean;
      scale?: string;
      "auto-rotate"?: boolean;
      "camera-controls"?: boolean;
    }
  }
}

const ModelViewer: FC<ModelViewerProps> = ({ src }) => {
  useEffect(() => {
    import("@google/model-viewer").catch(console.error);
  }, []);
  return (
    <model-viewer
      className="w-full h-full"
      src="/4ステーキコンボ.glb"
      auto-rotate
      camera-controls
      ar
    ></model-viewer>
  );
};

export default ModelViewer;
