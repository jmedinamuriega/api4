import React, { useState } from 'react';

const CommentForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form fields
    if (!name.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, name: 'Name is required' }));
      return;
    }
    if (!email.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, email: 'Email is required' }));
      return;
    }
    if (!comment.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, comment: 'Comment is required' }));
      return;
    }
    // Handle form submission logic here
    console.log('Submitting comment:', { name, email, comment });
    // Reset form fields and errors after submission
    setName('');
    setEmail('');
    setComment('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'nameError' : ''}
        />
        {errors.name && <span id="nameError">{errors.name}</span>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'emailError' : ''}
        />
        {errors.email && <span id="emailError">{errors.email}</span>}
      </div>
      <div>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-invalid={errors.comment ? 'true' : 'false'}
          aria-describedby={errors.comment ? 'commentError' : ''}
        />
        {errors.comment && <span id="commentError">{errors.comment}</span>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default CommentForm;
