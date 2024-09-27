// components/InputForm.js
import React, { useState } from 'react';

function InputForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (!category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(title, author, category);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? 'error' : ''}
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>
      <div className="form-group">
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={errors.author ? 'error' : ''}
        />
        {errors.author && <span className="error-message">{errors.author}</span>}
      </div>
      <div className="form-group">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={errors.category ? 'error' : ''}
        >
          <option value="">Select category</option>
          <option value="film">Film or TV Series</option>
          <option value="music">Musical Work</option>
          <option value="literature">Novel or Short Story Collection</option>
          <option value="visual_art">Visual Art/Painting</option>
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>
      <button type="submit">Analyze</button>
    </form>
  );
}

export default InputForm;