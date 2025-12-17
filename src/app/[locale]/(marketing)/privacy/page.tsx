export default function PrivacyPolicy() {
  return (
    <div className="prose mx-auto max-w-4xl px-4 py-12">
      <h1>Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong>
        {' '}
        {new Date().toLocaleDateString()}
      </p>

      <h2>Introduction</h2>
      <p>
        Welcome to Pool Pump Calculator ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website and use our services.
      </p>

      <h2>Information We Collect</h2>
      <h3>1. Personal Data</h3>
      <p>
        When you create an account, we collect information through our authentication provider, Clerk, which may include:
      </p>
      <ul>
        <li>Email address</li>
        <li>Name (if provided)</li>
        <li>Profile picture (if provided)</li>
      </ul>

      <h3>2. Calculator and Usage Data</h3>
      <p>
        To provide our services, we process information you input into our calculator, such as:
      </p>
      <ul>
        <li>Pool dimensions and volume</li>
        <li>Current pump specifications</li>
        <li>Local electricity rates</li>
        <li>Operating schedules</li>
      </ul>

      <h3>3. Payment Information</h3>
      <p>
        For premium subscriptions, payments are processed securely through Stripe. We do not store your full credit card details on our servers. Stripe provides us with limited information such as the last four digits of your card and subscription status.
      </p>

      <h2>How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Provide and maintain our calculator services.</li>
        <li>Personalize your experience and save your calculations.</li>
        <li>Process payments for premium features.</li>
        <li>Communicate with you regarding your account or updates.</li>
        <li>Improve our website and analyze usage patterns.</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>We work with several third-party providers to enhance our services:</p>
      <ul>
        <li>
          <strong>Clerk:</strong>
          {' '}
          For secure user authentication and account management.
        </li>
        <li>
          <strong>Stripe:</strong>
          {' '}
          For secure payment processing and subscription management.
        </li>
        <li>
          <strong>Google AdSense:</strong>
          {' '}
          To display relevant advertisements to free users.
        </li>
        <li>
          <strong>Amazon Associates & Home Depot:</strong>
          {' '}
          As part of our affiliate programs to recommend products.
        </li>
      </ul>

      <h2>Cookie Policy</h2>
      <p>
        We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
      </p>
      <p>
        You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
      </p>

      <h2>GDPR and CCPA Compliance</h2>
      <p>
        Depending on your location, you may have the following rights regarding your personal data:
      </p>
      <ul>
        <li>The right to access, update, or delete the information we have on you.</li>
        <li>The right of rectification (to have your information corrected).</li>
        <li>The right to object to our processing of your personal data.</li>
        <li>The right of data portability.</li>
      </ul>

      <h2>Security of Your Data</h2>
      <p>
        The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.
      </p>

      <h2>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us:</p>
      <p>Email: privacy@poolpumpcalculator.com</p>
    </div>
  );
}
