// Extension Popup Logic
const API_URL = 'http://localhost:4000/api';

document.addEventListener('DOMContentLoaded', () => {
  const getGuidanceBtn = document.getElementById('get-guidance');
  const startDiv = document.getElementById('start');
  const loadingDiv = document.getElementById('loading');
  const resultDiv = document.getElementById('result');

  getGuidanceBtn.addEventListener('click', async () => {
    // Show loading
    startDiv.style.display = 'none';
    loadingDiv.style.display = 'block';

    try {
      // Get random card
      const cardsResponse = await fetch(`${API_URL}/cards`);
      const cardsData = await cardsResponse.json();
      const cards = cardsData.data || [];

      if (cards.length === 0) {
        throw new Error('No cards available');
      }

      // Select random card
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      const isReversed = Math.random() < 0.3;
      const orientation = isReversed ? 'reversed' : 'upright';

      // Get interpretation
      const interpretations = randomCard.interpretations?.purchase?.[orientation] ||
                              randomCard.interpretations?.daily?.[orientation] ||
                              ['Нет интерпретации'];
      const interpretation = interpretations[Math.floor(Math.random() * interpretations.length)];

      // Display result
      loadingDiv.style.display = 'none';
      resultDiv.style.display = 'block';

      document.getElementById('card-name').textContent =
        `${randomCard.name}${isReversed ? ' (Перевёрнута)' : ''}`;
      document.getElementById('interpretation').textContent = interpretation;

      // Simple recommendation based on reversed
      const recommendation = isReversed ?
        '⚠️ Возможно, стоит подождать с этой покупкой.' :
        '✅ Карта показывает благоприятное время для покупки.';

      document.getElementById('recommendation').textContent = recommendation;

    } catch (error) {
      console.error('Error:', error);
      loadingDiv.style.display = 'none';
      startDiv.style.display = 'block';
      alert('Ошибка получения совета. Проверьте подключение к серверу.');
    }
  });
});
