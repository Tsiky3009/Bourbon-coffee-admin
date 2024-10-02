import React from 'react';
import styles from "./styles/document-viewer.module.css";

type Props = {
  fileUrl: string;
  local?: boolean;
  fileType?: string;
};

export default function DocumentViewer({ fileUrl, local = false, fileType }: Props) {
  const renderContent = () => {
    if (local) {
      // Pour les fichiers locaux
      if (fileType === 'application/pdf' || fileUrl.endsWith('.pdf')) {
        return (
          <embed
            src={fileUrl}
            type="application/pdf"
            width="100%"
            height="600px"
            className={styles.embed}
          />
        );
      } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        fileUrl.endsWith('.docx') ||
        fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        fileUrl.endsWith('.xlsx')
      ) {
        // Utilisation de Google Docs Viewer pour DOCX et XLSX
        return (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            style={{ width: "100%", height: "600px" }}
            frameBorder="0"
          />
        );
      } else if (fileType?.startsWith('image/')) {
        return <img src={fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '600px' }} />;
      } else {
        return (
          <div>
            <p>Prévisualisation non disponible pour ce type de fichier. Veuillez <a href={fileUrl} download>Télécharger</a> le fichier pour le voir.</p>
          </div>
        );
      }
    } else {
      // Pour les fichiers non locaux, utiliser Google Docs Viewer
      return (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
          style={{ width: "100%", height: "600px" }}
          frameBorder="0"
        />
      );
    }
  };

  return (
    <div className={styles.documentViewer}>
      {renderContent()}
    </div>
  );
}
