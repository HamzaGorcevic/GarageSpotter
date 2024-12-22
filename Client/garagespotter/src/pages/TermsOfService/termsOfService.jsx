import React from "react";

const TermsOfService = () => {
    return (
        <div
            style={{
                padding: "50px",
                fontFamily: "Arial, sans-serif",
                color: "#333",
            }}
        >
            <h1>Terms of Service</h1>
            <p>
                By using this application, you agree to the following terms and
                conditions. Please read them carefully before accessing or using
                our services.
            </p>

            <h2>1. Use of Services</h2>
            <p>
                You must use this application in compliance with all applicable
                laws and regulations. You agree not to:
            </p>
            <ul>
                <li>Use the application for any unlawful purpose.</li>
                <li>
                    Interfere with or disrupt the functionality of the
                    application.
                </li>
                <li>
                    Attempt to gain unauthorized access to any part of the
                    application.
                </li>
            </ul>

            <h2>2. Account Responsibility</h2>
            <p>
                If the application requires account creation, you are
                responsible for maintaining the confidentiality of your account
                credentials and for all activities under your account.
            </p>

            <h2>3. Limitation of Liability</h2>
            <p>
                We are not responsible for any damages or losses resulting from
                your use of this application. Use it at your own risk.
            </p>

            <h2>4. Modifications to the Service</h2>
            <p>
                We reserve the right to modify or discontinue the application,
                temporarily or permanently, without notice.
            </p>

            <h2>5. Termination</h2>
            <p>
                We reserve the right to terminate or suspend access to the
                application for any reason, including violation of these terms.
            </p>

            <h2>6. Changes to Terms</h2>
            <p>
                These terms may be updated from time to time. Continued use of
                the application signifies your acceptance of any changes.
            </p>

            <h2>7. Contact Us</h2>
            <p>
                If you have any questions about these Terms of Service, contact
                us at{" "}
                <a href="mailto:hamzagorcevic100@gmail.com">
                    hamzagorcevic100@gmail.com
                </a>
                .
            </p>
        </div>
    );
};

export default TermsOfService;
