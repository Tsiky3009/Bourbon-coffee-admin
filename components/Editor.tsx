import "@mdxeditor/editor/style.css";
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
import style from "./editor.module.css";

type Props = {
  blogContent: string;
  handleChange: (md: string) => void;
};

const Editor = ({ blogContent, handleChange }: Props) => {
  return (
    <MDXEditor
      contentEditableClassName="mdxeditor-content"
      onChange={(md) => handleChange(md)}
      markdown={blogContent}
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
