# Rider-Waite Tarot Card Images Setup

## Sources for Public Domain Images

### Option 1: Wikipedia Commons (Recommended)
1. Visit: https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck
2. Download all 78 cards
3. Rename according to the mapping below

### Option 2: Sacred Texts
1. Visit: https://www.sacred-texts.com/tarot/pkt/
2. Download card images (public domain)

### Option 3: Tarot.com Free Resources
1. Check their free Rider-Waite deck resources

## File Naming Convention

Place images in the following structure:

```
src/frontend/public/images/cards/
├── major/
│   ├── 00-fool.jpg
│   ├── 01-magician.jpg
│   └── ... (22 cards)
├── wands/
│   ├── ace.jpg
│   ├── 02.jpg
│   └── ... (14 cards)
├── cups/ (14 cards)
├── swords/ (14 cards)
└── pentacles/ (14 cards)
```

## Card Mapping

### MAJOR
- 00.jpg → The Fool
- 01.jpg → The Magician
- 02.jpg → The High Priestess
- 03.jpg → The Empress
- 04.jpg → The Emperor
- 05.jpg → The Hierophant
- 06.jpg → The Lovers
- 07.jpg → The Chariot
- 08.jpg → Strength
- 09.jpg → The Hermit
- 10.jpg → Wheel of Fortune
- 11.jpg → Justice
- 12.jpg → The Hanged Man
- 13.jpg → Death
- 14.jpg → Temperance
- 15.jpg → The Devil
- 16.jpg → The Tower
- 17.jpg → The Star
- 18.jpg → The Moon
- 19.jpg → The Sun
- 20.jpg → Judgement
- 21.jpg → The World

### WANDS
- ace.jpg → Ace of Wands
- 02.jpg → Two of Wands
- 03.jpg → Three of Wands
- 04.jpg → Four of Wands
- 05.jpg → Five of Wands
- 06.jpg → Six of Wands
- 07.jpg → Seven of Wands
- 08.jpg → Eight of Wands
- 09.jpg → Nine of Wands
- 10.jpg → Ten of Wands
- page.jpg → Page of Wands
- knight.jpg → Knight of Wands
- queen.jpg → Queen of Wands
- king.jpg → King of Wands

### CUPS
- ace.jpg → Ace of Cups
- 02.jpg → Two of Cups
- 03.jpg → Three of Cups
- 04.jpg → Four of Cups
- 05.jpg → Five of Cups
- 06.jpg → Six of Cups
- 07.jpg → Seven of Cups
- 08.jpg → Eight of Cups
- 09.jpg → Nine of Cups
- 10.jpg → Ten of Cups
- page.jpg → Page of Cups
- knight.jpg → Knight of Cups
- queen.jpg → Queen of Cups
- king.jpg → King of Cups

### SWORDS
- ace.jpg → Ace of Swords
- 02.jpg → Two of Swords
- 03.jpg → Three of Swords
- 04.jpg → Four of Swords
- 05.jpg → Five of Swords
- 06.jpg → Six of Swords
- 07.jpg → Seven of Swords
- 08.jpg → Eight of Swords
- 09.jpg → Nine of Swords
- 10.jpg → Ten of Swords
- page.jpg → Page of Swords
- knight.jpg → Knight of Swords
- queen.jpg → Queen of Swords
- king.jpg → King of Swords

### PENTACLES
- ace.jpg → Ace of Pentacles
- 02.jpg → Two of Pentacles
- 03.jpg → Three of Pentacles
- 04.jpg → Four of Pentacles
- 05.jpg → Five of Pentacles
- 06.jpg → Six of Pentacles
- 07.jpg → Seven of Pentacles
- 08.jpg → Eight of Pentacles
- 09.jpg → Nine of Pentacles
- 10.jpg → Ten of Pentacles
- page.jpg → Page of Pentacles
- knight.jpg → Knight of Pentacles
- queen.jpg → Queen of Pentacles
- king.jpg → King of Pentacles

## After Downloading

1. Place all images in correct folders
2. Run optimization script:
   ```bash
   node scripts/optimize-card-images.js
   ```

3. Images will be optimized to WebP format

## Alternative: Use Placeholder Generator

If you can't find images immediately, you can generate colored placeholders:
```bash
node scripts/generate-placeholder-images.js
```

This will create colored placeholder images for testing.
