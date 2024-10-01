import styles from "./styles/document-viewer.module.css";

type Props = {
  fileUrl: string;
  local?: boolean;
};

/**
 * This component render document via Google Docs API
 *  if `local` is false
 * else it render the document using an embed
 *
 * Why?: When it is on dev server, the GDocs API can't access the local file.
 * - On prod, local params can be omitted
 */
export default function DocumentViewer({ fileUrl, local = false }: Props) {
  // TODO:
  // Add an url checker
  // Add an error handler
  //  offline error
  //  Google Docs  error

  if (local) {
    return (
      <embed
        // src={`/pdf/${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        src={`/file_uploads/${fileUrl}#pagemode=none`}
        type="application/pdf"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%"
        className={styles.embed}
      ></embed>
    );
  }

  return (
    <iframe
      src={`http://docs.google.com/gview?url=${fileUrl}&embedded=true`}
      style={{ width: "100%", height: 500 }}
      frameborder="0"
    ></iframe>
  );
}

// TODO: check which is best iframe vs embed

/*
 */
