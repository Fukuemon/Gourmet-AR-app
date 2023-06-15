import React, { useEffect, FC, CSSProperties } from "react";

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
      style?: React.CSSProperties;
      "auto-rotate"?: boolean;
      "camera-controls"?: boolean;
    }
  }
}

const ModelViewer: FC<ModelViewerProps> = ({ src }) => {
  const [style, setStyle] = React.useState<CSSProperties>({});
  useEffect(() => {
    import("@google/model-viewer").catch(console.error);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 600) {
        setStyle({ width: "100%", height: "300px" });
      } else if (window.innerWidth < 900) {
        setStyle({ width: "100%", height: "600px" });
      } else {
        setStyle({ width: "100%", height: "800px" });
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <model-viewer
      style={style}
      className="w-full h-full"
      src={src}
      auto-rotate
      camera-controls
      ar
    ></model-viewer>
  );
};

export default ModelViewer;
