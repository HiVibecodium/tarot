export const ZODIAC_INTERPRETATIONS = {
  'Овен': {
    sun: 'Вы - прирождённый лидер и первопроходец. Ваша энергия Огня делает вас активным, смелым и инициативным. В раскладах Таро обращайте внимание на карты действия - они ваша сила!',
    moon: 'Луна в Овне делает ваши эмоции импульсивными и прямыми. Вы быстро загораетесь, но и быстро остываете.',
    rising: 'Вы производите впечатление энергичного, уверенного человека. Окружающие видят вашу силу и решительность.'
  },
  'Телец': {
    sun: 'Вы цените стабильность, комфорт и материальную безопасность. Элемент Земли даёт вам практичность и упорство. Карты Пентаклей особенно важны для вас!',
    moon: 'Луна в Тельце делает вас эмоционально стабильным и верным. Вы цените постоянство в чувствах.',
    rising: 'Вы кажетесь спокойным, надёжным и приятным. Люди тянутся к вашей стабильности.'
  },
  // Добавьте остальные знаки...
};

export function getFullSunSignInterpretation(sign) {
  return ZODIAC_INTERPRETATIONS[sign]?.sun || 'Ваш знак дарит вам уникальные качества и силу.';
}

export function getMoonSignInterpretation(sign) {
  return ZODIAC_INTERPRETATIONS[sign]?.moon || 'Ваша Луна влияет на ваш эмоциональный мир.';
}

export function getRisingSignInterpretation(sign) {
  return ZODIAC_INTERPRETATIONS[sign]?.rising || 'Ваш восходящий знак формирует первое впечатление о вас.';
}

export function getCombinedInterpretation(profile) {
  const sun = profile.sunSign?.sign;
  const moon = profile.moonSign?.sign;
  const rising = profile.risingSign?.sign;

  let text = `Ваша комбинация `;
  
  if (sun) text += `Солнца в ${sun}`;
  if (moon) text += `, Луны в ${moon}`;
  if (rising) text += ` и Восходящего в ${rising}`;
  
  text += ` создаёт уникальную личность. `;

  if (sun && moon) {
    text += `Рациональное (${sun}) и эмоциональное (${moon}) в вас гармонично дополняют друг друга. `;
  }

  text += `Используйте эти знания при интерпретации раскладов Таро - они помогут глубже понять послания карт!`;

  return text;
}
