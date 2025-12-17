export default function TermsOfService() {
  return (
    <div className="prose mx-auto max-w-4xl px-4 py-12">
      <h1>Terms of Service</h1>
      <p>
        <strong>Last updated:</strong>
        {' '}
        {new Date().toLocaleDateString()}
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Pool Pump Calculator ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Pool Pump Calculator provides tools and information to help pool owners estimate energy costs and optimize pump runtime. All calculations provided are estimates based on user input and general data. We do not guarantee the accuracy of these estimates.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. We reserve the right to terminate accounts that violate our terms.
      </p>

      <h2>4. Subscriptions and Payments</h2>
      <p>
        We offer premium features through paid subscriptions.
      </p>
      <ul>
        <li>Payments are processed securely via Stripe.</li>
        <li>Subscriptions automatically renew unless cancelled.</li>
        <li>You can cancel your subscription at any time through your account settings.</li>
        <li>Refunds are handled on a case-by-case basis in accordance with our refund policy.</li>
      </ul>

      <h2>5. Affiliate Disclosure</h2>
      <p>
        The Service contains affiliate links to products on third-party websites like Amazon and Home Depot. We may earn a commission if you purchase products through these links. This does not affect the price you pay.
      </p>

      <h2>6. Intellectual Property</h2>
      <p>
        The content, design, and software of the Service are the property of Pool Pump Calculator and are protected by intellectual property laws. You may not reproduce or distribute any part of the Service without our express written permission.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        Pool Pump Calculator is provided "as is" without any warranties. We are not liable for any damages arising from your use of the Service, including but not limited to incorrect calculations, equipment damage, or financial loss.
      </p>

      <h2>8. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. We will notify users of any significant changes by updating the "Last updated" date at the top of this page.
      </p>

      <h2>9. Contact Information</h2>
      <p>
        If you have any questions about these Terms, please contact us at support@poolpumpcalculator.com.
      </p>
    </div>
  );
}
