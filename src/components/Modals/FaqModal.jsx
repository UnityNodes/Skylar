import React, { useState } from 'react';
import './FaqModal.css';

const FaqModal = ({ onClose }) => {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqData = [
    {
      question: "How does the chest opening system work?",
      answer: "The system allows users to open chests containing LINA tokens. Each chest has a random set of rewards, including a different number of LINA tokens. You can choose the number of chests to open and receive rewards depending on the result."
    },
    {
      question: "How do I get $LINA tokens?",
      answer: "To get $LINA tokens, use the Faucet so you can open a chest."
    },
    {
      question: "What is the probability of receiving rewards?",
      answer: "The rewards in the chests are distributed randomly. Each chest has a specified chance of dropping different rewards."
    },
    {
      question: "Is there a leaderboard?",
      answer: "Yes, certain tournaments will be held on the website where leaderboards will be present!"
    },
    {
      question: "Can $LINA tokens be withdrawn?",
      answer: "Currently, it is not possible to withdraw $LINA tokens on the test network."
    }
  ];

  return (
    <div className="faq-modal-overlay" onClick={onClose}>
      <div className="faq-modal" onClick={(e) => e.stopPropagation()}>
        <div className="faq-header">
          <h1>FAQ</h1>
          <button className="faq-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="faq-content">
          {faqData.map((item, index) => (
            <div key={index} className={`faq-item ${openItems[index] ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleItem(index)}>
                <span>{item.question}</span>
                <span className="faq-arrow">▼</span>
              </div>
              {openItems[index] && (
                <div className="faq-answer">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqModal;