import React from 'react';
import './Card.css';

function Card({ cardName, image }) {
  return <img className="Card" alt={cardName} src={image} />;
}

export default Card;
