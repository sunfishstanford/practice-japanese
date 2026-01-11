import React, { useState } from 'react';
import { hiragana, katakana, phrases, vocabulary } from '../data';
import './Browse.css';

function Browse() {
  const [activeCategory, setActiveCategory] = useState('hiragana');

  const categories = [
    { id: 'hiragana', name: 'Hiragana', data: hiragana },
    { id: 'katakana', name: 'Katakana', data: katakana },
    { id: 'phrases', name: 'Phrases', data: phrases },
    { id: 'vocabulary', name: 'Vocabulary', data: vocabulary }
  ];

  const currentData = categories.find(cat => cat.id === activeCategory)?.data || [];

  // Organize kana into rows based on vowel sounds
  const organizeKanaIntoRows = (kanaData) => {
    const rows = [];
    let currentRow = [];

    kanaData.forEach((item, index) => {
      currentRow.push(item);

      // Check if we should start a new row
      // Regular rows: every 5 characters
      // Special handling for ya/yu/yo and wa/wo/n
      const romaji = item.romaji;

      if (currentRow.length === 5) {
        // Regular 5-character row (a, ka, sa, ta, na, ha, ma, ra)
        rows.push([...currentRow]);
        currentRow = [];
      } else if (romaji === 'yo' || romaji === 'n') {
        // End of ya/yu/yo row or wa/wo/n row
        rows.push([...currentRow]);
        currentRow = [];
      }
    });

    // Add any remaining characters
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const renderKanaRows = (kanaData) => {
    const rows = organizeKanaIntoRows(kanaData);

    return (
      <div className="kana-rows">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="kana-row">
            {row.map((item, itemIndex) => (
              <div key={itemIndex} className="kana-cell">
                <div className="kana-japanese">{item.japanese}</div>
                <div className="kana-romaji">{item.romaji}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderListItems = (data) => {
    return (
      <div className="browse-list">
        {data.map((item, index) => (
          <div key={index} className="browse-item">
            <div className="browse-japanese">{item.japanese}</div>
            <div className="browse-details">
              <div className="browse-romaji">{item.romaji}</div>
              <div className="browse-english">{item.english}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const isKanaCategory = activeCategory === 'hiragana' || activeCategory === 'katakana';

  return (
    <div className="browse-container">
      <h2>Browse & Learn</h2>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
            <span className="count">({category.data.length})</span>
          </button>
        ))}
      </div>

      {isKanaCategory ? renderKanaRows(currentData) : renderListItems(currentData)}
    </div>
  );
}

export default Browse;
