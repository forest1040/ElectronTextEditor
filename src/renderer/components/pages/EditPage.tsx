import React, { useState, useEffect, useCallback } from "react";
import GenericTemplate from "../templates/GenericTemplate";
import AceEditor from "react-ace";

import { ipcRenderer } from "electron";

import { Container, TextField } from "@material-ui/core";
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.currentTarget.value);
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
      <TextField
        multiline
        fullWidth
        variant="outlined"
        rows={10}
        rowsMax={20}
        value={text}
        inputProps={{
          style: {
            fontSize: 14,
          },
        }}
        onChange={handleChange}
        helperText={fileName || "[Untitled]"}
      />{" "}
      <AceEditor
        name="EDITOR"
        height="600px"
        width="100%"
        editorProps={{ $blockScrolling: false }}
      />
    </GenericTemplate>
  );
};

export default HomePage;
