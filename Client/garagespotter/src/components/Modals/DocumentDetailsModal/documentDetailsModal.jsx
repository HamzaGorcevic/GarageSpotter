import React from "react";
import styles from "./documentDetailsModal.module.scss";
import { Download } from "lucide-react";

const DocumentDetailsModal = ({
    documentFile,
    setShowDocumentModal,
    documentName = "Document",
}) => {
    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            setShowDocumentModal(false);
        }
    };

    React.useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = documentFile;
        link.download = documentName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getPreviewUrl = () => {
        // Use Google Docs Viewer for preview
        return `https://docs.google.com/viewer?url=${encodeURIComponent(
            documentFile
        )}&embedded=true`;
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button
                    className={styles.closeButton}
                    onClick={() => setShowDocumentModal(false)}
                >
                    &times;
                </button>
                <div className={styles.modalHeader}>
                    <h2>{documentName}</h2>
                    <button
                        onClick={handleDownload}
                        className={styles.downloadButton}
                        title="Download document"
                    >
                        <Download size={20} />
                        Download
                    </button>
                </div>
                {documentFile ? (
                    <div className={styles.previewContainer}>
                        <iframe
                            src={getPreviewUrl()}
                            title="Document Preview"
                            className={styles.documentFrame}
                            frameBorder="0"
                            allowFullScreen
                        />
                        {/* Fallback message if preview fails to load */}
                        <div className={styles.fallbackMessage}>
                            <p>
                                If the preview doesn't load, you can download
                                the document directly.
                            </p>
                            <button
                                onClick={handleDownload}
                                className={styles.downloadButtonLarge}
                            >
                                <Download size={24} />
                                Download Document
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className={styles.noDocument}>No document available.</p>
                )}
            </div>
        </div>
    );
};

export default DocumentDetailsModal;
