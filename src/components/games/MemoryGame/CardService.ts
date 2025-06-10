
export class CardService {
  private emojiSets = {
    animals: ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🦁', '🐯', '🐸', '🐵', '🐮', '🐷', '🐹', '🐨', '🦔', '🦝', '🐺', '🐴', '🦄', '🐧'],
    food: ['🍎', '🍌', '🍇', '🍓', '🍑', '🍊', '🥝', '🍍', '🥭', '🍒', '🍕', '🍔', '🌭', '🍟', '🍗', '🥐', '🍰', '🧁', '🍪', '🍩'],
    nature: ['🌸', '🌺', '🌻', '🌷', '🌹', '🌾', '🌿', '🍀', '🌳', '🌲', '🍄', '🌵', '🌴', '🐝', '🦋', '🐞', '🌟', '⭐', '🌙', '☀️'],
    objects: ['⚽', '🏀', '🎾', '🎯', '🎮', '🎸', '🎹', '🎨', '📚', '✏️', '🖍️', '🎁', '🎈', '🎊', '🎉', '🏆', '🎪', '🎭', '🎨', '🔮'],
    transportation: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛴', '🚲', '🛹', '🚁', '✈️']
  };

  generateCards(difficulty: 'easy' | 'medium' | 'hard', theme: 'mixed' | 'animals' | 'food' | 'nature' | 'objects' | 'transportation') {
    const counts = { easy: 6, medium: 8, hard: 10 };
    const count = counts[difficulty];
    
    let availableEmojis: string[];
    
    if (theme === 'mixed') {
      availableEmojis = [
        ...this.emojiSets.animals.slice(0, 5),
        ...this.emojiSets.food.slice(0, 5),
        ...this.emojiSets.nature.slice(0, 5),
        ...this.emojiSets.objects.slice(0, 5)
      ];
    } else {
      availableEmojis = this.emojiSets[theme];
    }

    // Shuffle and select required number of emojis
    const shuffled = availableEmojis.sort(() => Math.random() - 0.5);
    const selectedEmojis = shuffled.slice(0, count);
    
    // Create pairs and shuffle positions
    const gameCards = [...selectedEmojis, ...selectedEmojis].map((emoji, index) => ({
      id: index,
      value: emoji,
      isFlipped: false,
      isMatched: false
    }));
    
    // Shuffle card positions
    return gameCards.sort(() => Math.random() - 0.5);
  }

  getThemes() {
    return [
      { value: 'mixed', label: '🎯 Mixed', description: 'All categories' },
      { value: 'animals', label: '🐻 Animals', description: 'Cute creatures' },
      { value: 'food', label: '🍎 Food', description: 'Tasty treats' },
      { value: 'nature', label: '🌸 Nature', description: 'Beautiful nature' },
      { value: 'objects', label: '⚽ Objects', description: 'Fun items' },
      { value: 'transportation', label: '🚗 Transport', description: 'Vehicles' }
    ];
  }
}
