import { FC } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";

interface FileUploadProps {
  onUpload: (url: string) => void;
}

const FileUpload: FC<FileUploadProps> = ({ onUpload }) => {
  const onDrop: DropzoneOptions["onDrop"] = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const url = URL.createObjectURL(file);
    console.log(url); // 追加
    onUpload(url);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} className="p-4 border border-purple-100">
        <input {...getInputProps()} />
        <p>
          ここに3Dファイル(glb形式)をドラッグ＆ドロップするか、クリックしてglbファイルを選択してください
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
