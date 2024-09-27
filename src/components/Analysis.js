// components/Analysis.js
import React from 'react';

function Analysis({ data, onReset }) {
  const handleDownload = () => {
    const content = `
Title: ${data.title}
Author: ${data.author}
Category: ${data.category}

Analysis:
${data.content}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title}_analysis.txt`;
    a.click();
  };

  const handleShare = () => {
    const shareText = `Check out this analysis of "${data.title}" by ${data.author} on Meta Surfer!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: 'Meta Surfer Analysis',
        text: shareText,
        url: shareUrl,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    }
  };

  const renderContent = () => {
    const paragraphs = data.content.split('\n\n');
    return paragraphs.map((paragraph, index) => {
      const [title, ...content] = paragraph.split('\n');
      return (
        <div key={index} className="analysis-section">
          <h3>{title}</h3>
          <p>{content.join('\n')}</p>
        </div>
      );
    });
  };

  return (
    <div className="analysis">
      <h2>{data.title} by {data.author}</h2>
      <p><strong>Category:</strong> {data.category}</p>
      <div className="analysis-content">
        {renderContent()}
      </div>
      <div className="button-group">
        <button onClick={handleDownload}>Download as Text</button>
        <button onClick={handleShare}>Share Analysis</button>
        <button onClick={onReset}>New Analysis</button>
      </div>
    </div>
  );
}

export default Analysis;