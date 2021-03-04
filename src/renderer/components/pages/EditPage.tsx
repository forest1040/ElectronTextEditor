import React, { useState, useEffect, useCallback } from "react";
import GenericTemplate from "../templates/GenericTemplate";
import AceEditor from "react-ace";

import { ipcRenderer } from "electron";

import Menu from "../menu";

import { FILE_EVENTS, saveFile, FileInfoType } from "../../../fileIO";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-chrome";

/** エディタ共通の設定 */
const EditorCommonSettings = {
  mode: "java",
  theme: "chrome",
  tabSize: 2,
  enableBasicAutocompletion: true,
  height: "inherit",
  width: "inherit",
};

//{...EditorCommonSettings}

const openFileDialog = (): void => {
  ipcRenderer.send(FILE_EVENTS.OPEN_DIALOG);
};

const openSaveAsDialog = (fileInfo: FileInfoType): void => {
  ipcRenderer.send(FILE_EVENTS.SAVE_DIALOG, fileInfo);
};

const HomePage: React.FC = () => {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");

  // Dialog選択結果の取得
  useEffect(() => {
    ipcRenderer.on(FILE_EVENTS.OPEN_FILE, (_, fileInfo: FileInfoType) => {
      setText(fileInfo.fileText);
      setFileName(fileInfo.fileName);
    });
    ipcRenderer.on(FILE_EVENTS.SAVE_FILE, (_, newFileName: string) => {
      setFileName(newFileName);
    });

    return (): void => {
      ipcRenderer.removeAllListeners(FILE_EVENTS.OPEN_FILE);
      ipcRenderer.removeAllListeners(FILE_EVENTS.SAVE_FILE);
    };
  }, []);

  const handleFileSave = useCallback(() => {
    if (fileName) {
      saveFile(fileName, text);
    } else {
      openSaveAsDialog({
        fileName: "",
        fileText: text,
      });
    }
  }, [fileName, text]);

  const handleFileSaveAs = useCallback(() => {
    openSaveAsDialog({
      fileName: fileName,
      fileText: text,
    });
  }, [fileName, text]);

  return (
    <GenericTemplate title="タスク">
      {/* <>内容</> */}
      <Menu
        onFileOpen={openFileDialog}
        onFileSave={handleFileSave}
        onFileSaveAs={handleFileSaveAs}
      />
      <AceEditor
        name="EDITOR"
        height="600px"
        width="100%"
        value={text}
        onChange={(value) => {
          setText(value);
        }}
        editorProps={{ $blockScrolling: false }}
      />
    </GenericTemplate>
  );
};

export default HomePage;
