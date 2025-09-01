// src/pages/SecurityPage.tsx
import React from "react";
import { Link } from "react-router-dom";

const SecurityPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-slate-900 px-6">
      <div className="bg-white dark:bg-slate-800 shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          🔐 Security, GDPR & Terms
        </h1>

        <div className="space-y-10 text-gray-700 dark:text-gray-200 leading-relaxed">
          {/* Security */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p>
              We take the protection of your personal information seriously. All user data is
              stored on secure servers and protected with industry-standard practices. 
              Specifically:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                🔑 <strong>Password Security:</strong> Passwords are hashed using{" "}
                <code>bcrypt</code> and never stored in plain text.
              </li>
              <li>
                🔒 <strong>Data in Transit:</strong> All communication between your browser and
                our servers is encrypted with HTTPS/TLS.
              </li>
              <li>
                📦 <strong>Data at Rest:</strong> Sensitive data is stored securely in
                encrypted databases.
              </li>
              <li>
                🛡️ <strong>Authentication:</strong> We use secure JWT tokens to protect account
                access and prevent unauthorized use.
              </li>
              <li>
                🔍 <strong>Monitoring:</strong> Suspicious activity and failed login attempts
                are monitored to help prevent misuse.
              </li>
            </ul>
          </section>

          {/* GDPR */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Your GDPR Rights</h2>
            <p>
              As a user in the UK or EU, you are protected under the{" "}
              <em>General Data Protection Regulation (GDPR)</em>. This gives you full control
              over your data. You are entitled to the following rights:
            </p>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>
                📄 <strong>Right of Access:</strong> Request a copy of the personal data we
                hold about you.
              </li>
              <li>
                ✏️ <strong>Right to Rectification:</strong> Update or correct inaccurate or
                incomplete personal data.
              </li>
              <li>
                ❌ <strong>Right to Erasure:</strong> Request deletion of your account and all
                associated data (“Right to be Forgotten”).
              </li>
              <li>
                ⏸️ <strong>Right to Restrict Processing:</strong> Ask us to pause the use of
                your data while issues are investigated.
              </li>
              <li>
                🔄 <strong>Right to Data Portability:</strong> Receive your data in a
                machine-readable format for use elsewhere.
              </li>
              <li>
                🚫 <strong>Right to Object:</strong> Object to certain types of processing,
                such as marketing or research.
              </li>
            </ul>
            <p className="mt-2">
              You can exercise these rights at any time by updating your{" "}
              <Link to="/settings" className="text-blue-600 hover:underline">
                account settings
              </Link>{" "}
              or contacting us directly.
            </p>
          </section>

          {/* Terms & Conditions */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Terms & Conditions</h2>
            <p className="mb-3">
              By using this platform, you agree to the following terms of service:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>
                ✅ <strong>Account Responsibility:</strong> You are responsible for keeping
                your login details secure and must not share your account.
              </li>
              <li>
                🚫 <strong>Acceptable Use:</strong> You must not misuse the platform (e.g.
                attempting to hack, disrupt, or exploit the service).
              </li>
              <li>
                🔐 <strong>Data Use:</strong> Your data will only be used for prediction,
                research, and personalization. We do <u>not</u> sell your data to third
                parties.
              </li>
              <li>
                📝 <strong>Content Accuracy:</strong> While we aim for accurate predictions,
                results are for informational purposes only and not guarantees.
              </li>
              <li>
                ⚖️ <strong>Service Limitation:</strong> The platform is provided “as-is.”
                We cannot be held responsible for losses, errors, or misuse.
              </li>
              <li>
                🛑 <strong>Account Suspension:</strong> We reserve the right to suspend or
                terminate accounts that violate these terms.
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact & Support</h2>
            <p>
              If you have any questions about your data, GDPR rights, or our terms, please
              contact us at:
            </p>
            <p className="mt-2">
              📧{" "}
              <a
                href="mailto:privacy@electionpredictor.com"
                className="text-blue-600 hover:underline"
              >
                contactus@Votelytics.co.uk
              </a>
            </p>
          </section>
        </div>

        {/* Back button */}
        <div className="mt-10 text-center">
          <Link
            to="/settings"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Back to Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
