import React from "react";
import styles from "./privacypolicy.module.scss";

const PrivacyPolicy = () => {
    return (
        <div className={styles.privacyPolicy}>
            <h1>Privacy Policy</h1>
            <p>
                This Privacy Policy explains how we collect, use, and protect
                your information when you use our application. By accessing or
                using our application, you agree to the terms of this Privacy
                Policy.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul>
                <li>
                    Personal information you provide directly (e.g., name,
                    email).
                </li>
                <li>
                    Usage data, such as pages viewed and interactions within the
                    app.
                </li>
                <li>
                    Device information, such as browser type and operating
                    system.
                </li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
                <li>Provide and improve our application services.</li>
                <li>Respond to your inquiries and support requests.</li>
                <li>Ensure security and prevent fraudulent activities.</li>
            </ul>

            <h2>3. Sharing Your Information</h2>
            <p>
                We do not share your personal information with third parties,
                except as required by law or to protect our legal rights.
            </p>

            <h2>4. Security</h2>
            <p>
                We take reasonable steps to protect your information, but no
                method of transmission or storage is 100% secure.
            </p>

            <h2>5. Changes to This Privacy Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. Changes
                will be posted on this page with an updated "last modified"
                date.
            </p>

            <h2>6. Contact Us</h2>
            <p>
                If you have any questions or concerns about this Privacy Policy,
                please contact us at{" "}
                <a href="mailto:hamzagorcevic100@gmail.com">
                    hamzagorcevic100@gmail.com
                </a>
                .
            </p>
        </div>
    );
};

export default PrivacyPolicy;
