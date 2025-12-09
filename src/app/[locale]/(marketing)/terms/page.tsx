export default function PrivacyPolicy() {
  return (
    <div className="prose mx-auto max-w-4xl px-4 py-12">
      <h1>Privacy Policy</h1>
      <p>
        <strong>Last updated:</strong>
        {new Date().toLocaleDateString()}
      </p>

      <h2>Information We Collect</h2>
      <p>We collect information you provide when creating an account and using our calculator...</p>

      <h2>How We Use Your Information</h2>
      <p>We use your information to provide and improve our services...</p>

      <h2>Cookies and Tracking</h2>
      <p>We use cookies for analytics and advertising...</p>

      <h2>Third-Party Services</h2>
      <ul>
        <li>Stripe for payment processing</li>
        <li>Google AdSense for advertising</li>
        <li>Amazon Associates and Home Depot affiliate programs</li>
      </ul>

      <h2>Contact Us</h2>
      <p>Email: privacy@poolpumpcalculator.com</p>
    </div>
  );
}
