import { useState } from 'react';
import styles from './Form.module.css';

export default function Form() {
  const [formData, setFormData] = useState({
    location: '',
    firstName: '',
    lastName: '',
    email: '',
    modelsLink: '',
    instagramLink: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log("Server response:", responseData);

      if (response.ok) {
        alert('Form submitted successfully!');
        setFormData({
          location: '',
          firstName: '',
          lastName: '',
          email: '',
          modelsLink: '',
          instagramLink: '',
        });
      } else {
        alert(`Error: ${responseData.error || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error submitting form: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <select
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a location</option>
          <option value="London">London</option>
          <option value="Milan">Milan</option>
          <option value="Paris">Paris</option>
          <option value="Paris">New York</option>
        </select>
      </div>
      <div>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          placeholder="First Name"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          placeholder="Last Name"
        />
      </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email"
        />
        <input
          type="url"
          name="modelsLink"
          value={formData.modelsLink}
          onChange={handleChange}
          placeholder="Models.com Link"
        />

        <input
          type="url"
          name="instagramLink"
          value={formData.instagramLink}
          onChange={handleChange}
          placeholder="Instagram Profile Link"
        />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
