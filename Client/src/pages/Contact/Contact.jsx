import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setMessage({ 
        text: 'Thank you for your message! We will get back to you soon.', 
        type: 'success' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 2000);
  };

  const clearMessage = () => {
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Get in Touch</h1>
          <p className="hero-subtitle">We're here to help and answer any questions you might have</p>
        </div>
      </div>

      <div className="contact-content">
        {/* Contact Information */}
        <section className="contact-section info-section">
          <div className="section-header">
            <h2>📞 Contact Information</h2>
            <p>Reach out to us through any of these channels</p>
          </div>
          <div className="contact-info-grid">
            <div className="info-card">
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>info@palestineaid.org</p>
              <p className="info-description">For general inquiries and support</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📱</div>
              <h3>Phone</h3>
              <p>+970 59 123 4567</p>
              <p className="info-description">Available Monday-Friday, 9AM-6PM</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>Al-Masri Street, Gaza City</p>
              <p className="info-description">Palestine</p>
            </div>
            <div className="info-card">
              <div className="info-icon">💬</div>
              <h3>WhatsApp</h3>
              <p>+970 59 123 4567</p>
              <p className="info-description">For urgent matters and quick responses</p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-section form-section">
          <div className="section-header">
            <h2>✍️ Send us a Message</h2>
            <p>Fill out the form below and we'll get back to you as soon as possible</p>
          </div>
          <div className="form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="What is this regarding?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows="6"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="contact-section faq-section">
          <div className="section-header">
            <h2>❓ Frequently Asked Questions</h2>
            <p>Find answers to common questions about our services</p>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I request aid?</h3>
              <p>You can request aid by creating an account and submitting a detailed request through our platform. Our team will review and approve legitimate requests.</p>
            </div>
            <div className="faq-item">
              <h3>How long does it take to receive aid?</h3>
              <p>Response times vary based on urgency and availability. Urgent requests are typically processed within 24 hours, while standard requests may take 3-5 business days.</p>
            </div>
            <div className="faq-item">
              <h3>What types of aid do you provide?</h3>
              <p>We provide various types of aid including medical supplies, food, clothing, shelter materials, and other essential items based on community needs.</p>
            </div>
            <div className="faq-item">
              <h3>How can I donate?</h3>
              <p>You can donate through our secure online platform. We accept various payment methods and provide detailed tracking of how your donation is used.</p>
            </div>
            <div className="faq-item">
              <h3>Is my donation secure?</h3>
              <p>Yes, we use industry-standard security measures to protect all transactions and personal information. Your data is encrypted and secure.</p>
            </div>
            <div className="faq-item">
              <h3>Can I track my donation?</h3>
              <p>Absolutely! We provide real-time tracking of aid distribution and regular updates on how your donation is making an impact in the community.</p>
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section className="contact-section hours-section">
          <div className="section-header">
            <h2>🕒 Office Hours</h2>
            <p>When you can reach our team</p>
          </div>
          <div className="hours-container">
            <div className="hours-card">
              <div className="day-row">
                <span className="day">Monday - Friday</span>
                <span className="time">9:00 AM - 6:00 PM</span>
              </div>
              <div className="day-row">
                <span className="day">Saturday</span>
                <span className="time">10:00 AM - 4:00 PM</span>
              </div>
              <div className="day-row">
                <span className="day">Sunday</span>
                <span className="time">Closed</span>
              </div>
              <div className="emergency-notice">
                <p>🚨 Emergency requests are handled 24/7</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="contact-section social-section">
          <div className="section-header">
            <h2>📱 Follow Us</h2>
            <p>Stay connected and updated with our latest activities</p>
          </div>
          <div className="social-grid">
            <a href="#" className="social-card facebook">
              <div className="social-icon">📘</div>
              <h3>Facebook</h3>
              <p>@PalestineAid</p>
            </a>
            <a href="#" className="social-card twitter">
              <div className="social-icon">🐦</div>
              <h3>Twitter</h3>
              <p>@PalestineAid</p>
            </a>
            <a href="#" className="social-card instagram">
              <div className="social-icon">📷</div>
              <h3>Instagram</h3>
              <p>@palestineaid</p>
            </a>
            <a href="#" className="social-card linkedin">
              <div className="social-icon">💼</div>
              <h3>LinkedIn</h3>
              <p>Palestine Aid Organization</p>
            </a>
          </div>
        </section>
      </div>

      {/* Message Toast */}
      {message.text && (
        <div className={`message-toast ${message.type}`}>
          <span className="message-text">{message.text}</span>
          <button className="message-close" onClick={clearMessage}>×</button>
        </div>
      )}
    </div>
  );
};

export default Contact; 