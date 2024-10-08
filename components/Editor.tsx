import "@mdxeditor/editor/style.css";
import React from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  InsertImage,
} from "@mdxeditor/editor";

type Props = {
  blogTitle: string;
  handleChange: (md: string) => void;
};

const Editor = ({ blogTitle, handleChange }: Props) => {
  return (
    <MDXEditor
      onChange={(md) => handleChange(md)}
      markdown={blogTitle}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {" "}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <InsertImage />
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
