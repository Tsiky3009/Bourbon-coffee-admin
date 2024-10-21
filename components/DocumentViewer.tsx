// components/DocumentViewer.tsx
import React, { useEffect, useState } from 'react';
import styles from "./styles/document-viewer.module.css";
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

type Props = {
  fileUrl: string;
  local?: boolean;
  fileType?: string;
};

const DocumentViewer: React.FC<Props> = ({ fileUrl, local = false, fileType }) => {
  const [content, setContent] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRender = async () => {
      setError(null);
      setContent(null);

      if (local) {
        if (fileType === 'application/pdf' || fileUrl.endsWith('.pdf')) {
          // Prévisualisation des PDF
          setContent(
            <embed
              src={fileUrl}
              type="application/pdf"
              width="100%"
              height="478px"
              className={styles.embed}
            />
          );
        } else if (
          fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          fileUrl.endsWith('.docx')
        ) {
          // Prévisualisation des fichiers DOCX avec mammoth.js
          try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Erreur lors de la récupération du fichier DOCX.');
            const arrayBuffer = await response.arrayBuffer();
            const { value } = await mammoth.convertToHtml({ arrayBuffer });
            setContent(<div dangerouslySetInnerHTML={{ __html: value }} />);
          } catch (err) {
            console.error("Erreur lors de la conversion DOCX :", err);
            setError('Impossible de prévisualiser le fichier DOCX. Veuillez le télécharger.');
          }
        } else if (
          fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          fileUrl.endsWith('.xlsx')
        ) {
          // Prévisualisation des fichiers XLSX avec SheetJS
          try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Erreur lors de la récupération du fichier XLSX.');
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const html = XLSX.utils.sheet_to_html(worksheet);
            setContent(<div dangerouslySetInnerHTML={{ __html: html }} />);
          } catch (err) {
            console.error("Erreur lors de la conversion XLSX :", err);
            setError('Impossible de prévisualiser le fichier XLSX. Veuillez le télécharger.');
          }
        } else if (fileType?.startsWith('image/')) {
          // Prévisualisation des images
          setContent(<img src={fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '600px' }} />);
        } else {
          // Type de fichier non pris en charge pour la prévisualisation
          setContent(
            <div>
              <p>
                Prévisualisation non disponible pour ce type de fichier. Veuillez{' '}
                <a href={fileUrl} download>
                  télécharger
                </a>{' '}
                le fichier pour le voir.
              </p>
            </div>
          );
        }
      } else {
        // Prévisualisation des fichiers non locaux avec Google Docs Viewer
        setContent(
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            style={{ width: "100%", height: "478px" }}
            frameBorder="0"
          />
        );
      }
    };

    fetchAndRender();
  }, [fileUrl, local, fileType]);

  return (
    <div className={styles.documentViewer}>
      {error ? <p style={{ color: 'red' }}>{error}</p> : content}
    </div>
  );
};

export default DocumentViewer;
