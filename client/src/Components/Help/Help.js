import React, { useState } from 'react';
import './Help.css';

const faqData = [
  {
    category: 'Account Help',
    items: [
      {
        q: 'How do I change my password?',
        a: 'Go to the Profile page and click Reset Password. Follow the prompts to update your account credentials.'
      },
      {
        q: 'Why do I need to make a profile or connect my Spotify account?',
        a: 'In order to create a playlist on Spotify you need to connect your Spotify account. Creating a profile on this site is for extra security and personalization.'
      },
      {
        q: 'I can’t log in',
        a: 'Check your credentials or contact support if the issue continues.'
      }
    ]
  },
  {
    category: 'Playlists & Downloads',
    items: [
      {
        q: 'How do I download playlists?',
        a: 'Connect Spotify from your user profile, add songs from movies to a playlist, then click the button "Import playlist on Spotify"'
      },
      {
        q: 'Why is my playlist missing?',
        a: 'Try refreshing your Spotify connection (disconnect and then reconnect) then try importing the playlist again.'
      },
      {
        q: 'Why are songs not showing up for a movie?',
        a: 'This website relies on Wikipedia’s database, so not all movies will have a track list corresponding to them if there is not currently a wiki page for them.'
      }
    ]
  },
  {
    category: 'New Features (Recently added or Soon to Come)',
    items: [
      {
        q: 'Random Password Generator',
        a: 'Users have the ability to generate a secure password when signing up for an account. Make sure to save your password somewhere so you don’t forget it.'
      }, 
      {
        q: 'Bookmarks',
        a: 'Users can bookmark movies and view their saved bookmarks in the Profile > My Bookmarks tab. This feature is especially helpful if you frequently use songs from specific movies.'
      },
    ]
  }
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <span>{open ? '−' : '+'}</span>
      </button>

      {open && <div className="faq-answer">{a}</div>}
    </div>
  );
}

function Help() {
  const [search, setSearch] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issue: "",
  });

  // Success message state
  const [responseMessage, setResponseMessage] = useState("");

  const filteredSections = faqData
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.q.toLowerCase().includes(search.toLowerCase()) ||
          item.a.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:4000/api/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // Show success message on page
      setResponseMessage(data.message);

      // Clear form after submit
      setFormData({
        name: "",
        email: "",
        issue: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage("Something went wrong.");
    }
  };

  return (
    <div className="help-page">
      <h1>Help FAQs</h1>

      {filteredSections.map((section) => (
        <div key={section.category}>
          <h2>{section.category}</h2>

          {section.items.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      ))}

      <section className="contact-section">
        <div className="contact-card">
          <h2>Still need help?</h2>
          <p>Send us a message and we’ll get back to you.</p>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <input
                type="email"
                name="email"
                placeholder="Email for reply"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <textarea
                name="issue"
                placeholder="Describe your issue..."
                rows="5"
                value={formData.issue}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit">
              Send Message
            </button>
          </form>

          {/* Success message appears here */}
          {responseMessage && (
            <p className="feedback-message">
              {responseMessage}
            </p>
          )}

          <div className="contact-info">
            <p>
              <strong>Name:</strong> Mei Tate
            </p>
            <p>
              <strong>Email:</strong>{" "}
              your.email@example.com
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Help;