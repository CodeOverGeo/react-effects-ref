import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Card from '../Card/Card';

const API_BASE_URL = 'http://deckofcardsapi.com/api/deck';

const Autodeck = () => {
  const [deck, setDeck] = useState(null);
  const [drawn, setDrawn] = useState([]);
  const [drawCard, setDrawCard] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    async function getData() {
      let res = await axios.get(`${API_BASE_URL}/new/shuffle`);
      setDeck(res.data);
    }
    getData();
  }, [setDeck]);

  useEffect(() => {
    async function getCard() {
      let { deck_id } = deck;

      try {
        let drawRes = await axios.get(`${API_BASE_URL}/${deck_id}/draw`);

        if (drawRes.data.remaining === 0) {
          setDrawCard(false);
          throw new Error('no cards remaining');
        }

        const card = drawRes.data.cards[0];

        setDrawn((d) => [
          ...d,
          {
            id: card.code,
            cardName: card.value + ' of ' + card.value,
            image: card.image,
          },
        ]);
      } catch (err) {
        alert(err);
      }
    }
    if (drawCard && !timerRef.current) {
      timerRef.current = setInterval(async () => {
        await getCard();
      }, 1000);
    }

    // Use the reference point for the created interval to clear once all cards have been drawn
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [drawCard, setDrawCard, deck]);

  function toggleDrawCard() {
    return setDrawCard((draw) => !draw);
  }

  function GetDeck(drawn) {
    return drawn.map((c) => <Card key={c.id} name={c.name} image={c.image} />);
  }

  return (
    <div>
      {deck ? (
        <button className="Deck-btn" onClick={toggleDrawCard}>
          {drawCard ? 'STOP' : 'KEEP'} DRAWING
        </button>
      ) : null}
      {GetDeck(drawn)}
    </div>
  );
};

export default Autodeck;
