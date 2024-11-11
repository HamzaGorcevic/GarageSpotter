import React from "react";
import styles from "./documentDetailsModal.module.scss";

export const DocumentDetailsModal = ({
    documentFile,
    setShowDocumentModal,
}) => {
    console.log(documentFile);
    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button
                    className={styles.closeButton}
                    onClick={() => setShowDocumentModal("")}
                >
                    &times;
                </button>
                <h2>Document Preview</h2>
                {documentFile ? (
                    <iframe
                        src={documentFile}
                        title="Document Preview"
                        className={styles.documentFrame}
                        frameBorder="0"
                        allowFullScreen
                    />
                ) : (
                    <p>No document available.</p>
                )}
            </div>
        </div>
    );
};
