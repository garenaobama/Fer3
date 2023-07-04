import { Button, Card, Input, Row } from "antd";
import React, { useRef, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

const MySunEditor = ({ initialTempVar = [], ...rest }) => {
  const [tempVar, setTempVar] = useState(initialTempVar);

  const editor = useRef();
  const getSunEditorInstance = (sunEditor) => {
    editor.current = sunEditor;
  };

  return (
    <Card className="m-10">
      <Row>
        <SunEditor
          {...rest}
          setOptions={{
            buttonList: [
              ["font", "fontSize", "formatBlock"],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["align", "horizontalRule", "list", "table"],
              ["fontColor", "hiliteColor"],
              ["outdent", "indent"],
              ["undo", "redo"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["link", "image"],
              ["preview", "print"],
              ["fullScreen", "showBlocks", "codeView"],
            ],
          }}
          getSunEditorInstance={getSunEditorInstance}
          height="60vh"
        />
      </Row>
      <Row>
        {tempVar?.map((variable, index) => (
          <span className="m-10" key={index}>
            {variable}
          </span>
        ))}
      </Row>
    </Card>
  );
};
export default MySunEditor;
