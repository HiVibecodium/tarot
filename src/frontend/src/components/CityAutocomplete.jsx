import { useState, useEffect, useRef } from 'react'
import './CityAutocomplete.css'

// Популярные города России (расширенный список)
const RUSSIAN_CITIES = [
  // Крупные города
  { name: 'Москва', timezone: 'Europe/Moscow', lat: 55.7558, lon: 37.6173 },
  { name: 'Санкт-Петербург', timezone: 'Europe/Moscow', lat: 59.9311, lon: 30.3609 },
  { name: 'Новосибирск', timezone: 'Asia/Novosibirsk', lat: 55.0084, lon: 82.9357 },
  { name: 'Екатеринбург', timezone: 'Asia/Yekaterinburg', lat: 56.8389, lon: 60.6057 },
  { name: 'Казань', timezone: 'Europe/Moscow', lat: 55.8304, lon: 49.0661 },
  { name: 'Нижний Новгород', timezone: 'Europe/Moscow', lat: 56.2965, lon: 43.9361 },
  { name: 'Челябинск', timezone: 'Asia/Yekaterinburg', lat: 55.1644, lon: 61.4368 },
  { name: 'Самара', timezone: 'Europe/Samara', lat: 53.1959, lon: 50.1002 },
  { name: 'Омск', timezone: 'Asia/Omsk', lat: 54.9885, lon: 73.3242 },
  { name: 'Ростов-на-Дону', timezone: 'Europe/Moscow', lat: 47.2357, lon: 39.7015 },
  { name: 'Уфа', timezone: 'Asia/Yekaterinburg', lat: 54.7388, lon: 55.9721 },
  { name: 'Красноярск', timezone: 'Asia/Krasnoyarsk', lat: 56.0153, lon: 92.8932 },
  { name: 'Воронеж', timezone: 'Europe/Moscow', lat: 51.6720, lon: 39.1843 },
  { name: 'Пермь', timezone: 'Asia/Yekaterinburg', lat: 58.0105, lon: 56.2502 },
  { name: 'Волгоград', timezone: 'Europe/Volgograd', lat: 48.7080, lon: 44.5133 },
  { name: 'Краснодар', timezone: 'Europe/Moscow', lat: 45.0355, lon: 38.9753 },
  { name: 'Саратов', timezone: 'Europe/Saratov', lat: 51.5924, lon: 45.9606 },
  { name: 'Тюмень', timezone: 'Asia/Yekaterinburg', lat: 57.1530, lon: 65.5343 },
  { name: 'Тольятти', timezone: 'Europe/Samara', lat: 53.5303, lon: 49.3461 },
  { name: 'Ижевск', timezone: 'Europe/Samara', lat: 56.8519, lon: 53.2038 },
  { name: 'Барнаул', timezone: 'Asia/Barnaul', lat: 53.3481, lon: 83.7798 },
  { name: 'Ульяновск', timezone: 'Europe/Ulyanovsk', lat: 54.3142, lon: 48.4031 },
  { name: 'Иркутск', timezone: 'Asia/Irkutsk', lat: 52.2870, lon: 104.3050 },
  { name: 'Хабаровск', timezone: 'Asia/Vladivostok', lat: 48.4827, lon: 135.0838 },
  { name: 'Ярославль', timezone: 'Europe/Moscow', lat: 57.6261, lon: 39.8845 },
  { name: 'Владивосток', timezone: 'Asia/Vladivostok', lat: 43.1056, lon: 131.8735 },
  { name: 'Махачкала', timezone: 'Europe/Moscow', lat: 42.9849, lon: 47.5047 },
  { name: 'Томск', timezone: 'Asia/Tomsk', lat: 56.4977, lon: 84.9744 },
  { name: 'Оренбург', timezone: 'Asia/Yekaterinburg', lat: 51.7727, lon: 55.0988 },
  { name: 'Кемерово', timezone: 'Asia/Novokuznetsk', lat: 55.3547, lon: 86.0872 },
  // Средние города
  { name: 'Новокузнецк', timezone: 'Asia/Novokuznetsk', lat: 53.7557, lon: 87.1099 },
  { name: 'Рязань', timezone: 'Europe/Moscow', lat: 54.6269, lon: 39.6916 },
  { name: 'Астрахань', timezone: 'Europe/Astrakhan', lat: 46.3478, lon: 48.0339 },
  { name: 'Пенза', timezone: 'Europe/Moscow', lat: 53.1959, lon: 45.0183 },
  { name: 'Киров', timezone: 'Europe/Kirov', lat: 58.6035, lon: 49.6680 },
  { name: 'Липецк', timezone: 'Europe/Moscow', lat: 52.6103, lon: 39.5708 },
  { name: 'Чебоксары', timezone: 'Europe/Moscow', lat: 56.1439, lon: 47.2489 },
  { name: 'Калининград', timezone: 'Europe/Kaliningrad', lat: 54.7104, lon: 20.4522 },
  { name: 'Тула', timezone: 'Europe/Moscow', lat: 54.1961, lon: 37.6182 },
  { name: 'Курск', timezone: 'Europe/Moscow', lat: 51.7373, lon: 36.1873 },
  { name: 'Ставрополь', timezone: 'Europe/Moscow', lat: 45.0428, lon: 41.9734 },
  { name: 'Сочи', timezone: 'Europe/Moscow', lat: 43.5855, lon: 39.7231 },
  { name: 'Улан-Удэ', timezone: 'Asia/Irkutsk', lat: 51.8272, lon: 107.6063 },
  { name: 'Тверь', timezone: 'Europe/Moscow', lat: 56.8587, lon: 35.9176 },
  { name: 'Магнитогорск', timezone: 'Asia/Yekaterinburg', lat: 53.4115, lon: 58.9794 },
  { name: 'Иваново', timezone: 'Europe/Moscow', lat: 57.0000, lon: 40.9737 },
  { name: 'Брянск', timezone: 'Europe/Moscow', lat: 53.2521, lon: 34.3717 },
  { name: 'Сургут', timezone: 'Asia/Yekaterinburg', lat: 61.2500, lon: 73.4167 },
  // Ленинградская область
  { name: 'Тосно', timezone: 'Europe/Moscow', lat: 59.5403, lon: 30.8772 },
  { name: 'Гатчина', timezone: 'Europe/Moscow', lat: 59.5761, lon: 30.1286 },
  { name: 'Выборг', timezone: 'Europe/Moscow', lat: 60.7107, lon: 28.7493 },
  { name: 'Всеволожск', timezone: 'Europe/Moscow', lat: 60.0206, lon: 30.6581 },
  { name: 'Колпино', timezone: 'Europe/Moscow', lat: 59.7500, lon: 30.5833 },
  { name: 'Кронштадт', timezone: 'Europe/Moscow', lat: 59.9911, lon: 29.7661 },
  { name: 'Пушкин', timezone: 'Europe/Moscow', lat: 59.7142, lon: 30.3964 },
  { name: 'Петергоф', timezone: 'Europe/Moscow', lat: 59.8847, lon: 29.9086 },
  // Московская область
  { name: 'Подольск', timezone: 'Europe/Moscow', lat: 55.4244, lon: 37.5546 },
  { name: 'Химки', timezone: 'Europe/Moscow', lat: 55.8970, lon: 37.4297 },
  { name: 'Балашиха', timezone: 'Europe/Moscow', lat: 55.8094, lon: 37.9580 },
  { name: 'Мытищи', timezone: 'Europe/Moscow', lat: 55.9116, lon: 37.7648 },
  { name: 'Королёв', timezone: 'Europe/Moscow', lat: 55.9233, lon: 37.8556 },
  { name: 'Люберцы', timezone: 'Europe/Moscow', lat: 55.6758, lon: 37.8939 },
  { name: 'Красногорск', timezone: 'Europe/Moscow', lat: 55.8208, lon: 37.3308 },
  { name: 'Одинцово', timezone: 'Europe/Moscow', lat: 55.6797, lon: 37.2828 },
  // Дополнительные города
  { name: 'Смоленск', timezone: 'Europe/Moscow', lat: 54.7818, lon: 32.0401 },
  { name: 'Калуга', timezone: 'Europe/Moscow', lat: 54.5293, lon: 36.2754 },
  { name: 'Владимир', timezone: 'Europe/Moscow', lat: 56.1366, lon: 40.3966 },
  { name: 'Архангельск', timezone: 'Europe/Moscow', lat: 64.5401, lon: 40.5433 },
  { name: 'Мурманск', timezone: 'Europe/Moscow', lat: 68.9585, lon: 33.0827 },
  { name: 'Якутск', timezone: 'Asia/Yakutsk', lat: 62.0355, lon: 129.6755 },
  { name: 'Владикавказ', timezone: 'Europe/Moscow', lat: 43.0370, lon: 44.6680 },
  { name: 'Севастополь', timezone: 'Europe/Moscow', lat: 44.6167, lon: 33.5167 },
  { name: 'Симферополь', timezone: 'Europe/Simferopol', lat: 44.9521, lon: 34.1024 },
  { name: 'Сыктывкар', timezone: 'Europe/Moscow', lat: 61.6681, lon: 50.8067 },
  { name: 'Петрозаводск', timezone: 'Europe/Moscow', lat: 61.7849, lon: 34.3469 },
  // Дополнительные малые города и райцентры
  { name: 'Белгород', timezone: 'Europe/Moscow', lat: 50.5997, lon: 36.5989 },
  { name: 'Орёл', timezone: 'Europe/Moscow', lat: 52.9651, lon: 36.0785 },
  { name: 'Тамбов', timezone: 'Europe/Moscow', lat: 52.7213, lon: 41.4520 },
  { name: 'Кострома', timezone: 'Europe/Moscow', lat: 57.7665, lon: 40.9265 },
  { name: 'Вологда', timezone: 'Europe/Moscow', lat: 59.2239, lon: 39.8843 },
  { name: 'Череповец', timezone: 'Europe/Moscow', lat: 59.1333, lon: 37.9000 },
  { name: 'Владимир', timezone: 'Europe/Moscow', lat: 56.1366, lon: 40.3966 },
  { name: 'Псков', timezone: 'Europe/Moscow', lat: 57.8136, lon: 28.3496 },
  { name: 'Великий Новгород', timezone: 'Europe/Moscow', lat: 58.5213, lon: 31.2753 },
  { name: 'Сызрань', timezone: 'Europe/Samara', lat: 53.1585, lon: 48.4681 },
  { name: 'Набережные Челны', timezone: 'Europe/Moscow', lat: 55.7430, lon: 52.3977 },
  { name: 'Нижневартовск', timezone: 'Asia/Yekaterinburg', lat: 60.9344, lon: 76.5531 },
  { name: 'Нижнекамск', timezone: 'Europe/Moscow', lat: 55.6367, lon: 51.8206 },
  { name: 'Шахты', timezone: 'Europe/Moscow', lat: 47.7089, lon: 40.2140 },
  { name: 'Таганрог', timezone: 'Europe/Moscow', lat: 47.2362, lon: 38.8969 },
  { name: 'Дзержинск', timezone: 'Europe/Moscow', lat: 56.2389, lon: 43.4624 },
  { name: 'Орск', timezone: 'Asia/Yekaterinburg', lat: 51.2048, lon: 58.6063 },
  { name: 'Ангарск', timezone: 'Asia/Irkutsk', lat: 52.5333, lon: 103.8833 },
  { name: 'Братск', timezone: 'Asia/Irkutsk', lat: 56.1519, lon: 101.6343 },
  { name: 'Бийск', timezone: 'Asia/Barnaul', lat: 52.5333, lon: 85.2167 },
  { name: 'Прокопьевск', timezone: 'Asia/Novokuznetsk', lat: 53.8919, lon: 86.7197 },
  { name: 'Энгельс', timezone: 'Europe/Saratov', lat: 51.4833, lon: 46.1167 },
  { name: 'Балаково', timezone: 'Europe/Saratov', lat: 52.0333, lon: 47.8000 },
  { name: 'Стерлитамак', timezone: 'Asia/Yekaterinburg', lat: 53.6333, lon: 55.9500 },
  { name: 'Армавир', timezone: 'Europe/Moscow', lat: 44.9892, lon: 41.1234 },
  { name: 'Каменск-Уральский', timezone: 'Asia/Yekaterinburg', lat: 56.4167, lon: 61.9333 },
  { name: 'Южно-Сахалинск', timezone: 'Asia/Sakhalin', lat: 46.9589, lon: 142.7386 },
  { name: 'Петропавловск-Камчатский', timezone: 'Asia/Kamchatka', lat: 53.0452, lon: 158.6483 },
  { name: 'Благовещенск', timezone: 'Asia/Yakutsk', lat: 50.2667, lon: 127.5333 },
  { name: 'Волжский', timezone: 'Europe/Volgograd', lat: 48.7854, lon: 44.7759 },
  { name: 'Норильск', timezone: 'Asia/Krasnoyarsk', lat: 69.3535, lon: 88.2027 },
  { name: 'Абакан', timezone: 'Asia/Krasnoyarsk', lat: 53.7154, lon: 91.4291 },
  { name: 'Новороссийск', timezone: 'Europe/Moscow', lat: 44.7239, lon: 37.7686 },
  { name: 'Комсомольск-на-Амуре', timezone: 'Asia/Vladivostok', lat: 50.5500, lon: 137.0167 },
  { name: 'Сергиев Посад', timezone: 'Europe/Moscow', lat: 56.3000, lon: 38.1333 },
  { name: 'Коломна', timezone: 'Europe/Moscow', lat: 55.0794, lon: 38.7783 },
  { name: 'Электросталь', timezone: 'Europe/Moscow', lat: 55.7896, lon: 38.4466 },
  { name: 'Щёлково', timezone: 'Europe/Moscow', lat: 55.9211, lon: 38.0331 },
  { name: 'Орехово-Зуево', timezone: 'Europe/Moscow', lat: 55.8067, lon: 38.9617 },
  { name: 'Серпухов', timezone: 'Europe/Moscow', lat: 54.9156, lon: 37.4106 },
  { name: 'Новочеркасск', timezone: 'Europe/Moscow', lat: 47.4208, lon: 40.0936 },
  { name: 'Ессентуки', timezone: 'Europe/Moscow', lat: 44.0444, lon: 42.8597 },
  { name: 'Пятигорск', timezone: 'Europe/Moscow', lat: 44.0486, lon: 43.0594 },
  { name: 'Кисловодск', timezone: 'Europe/Moscow', lat: 43.9083, lon: 42.7197 },
  { name: 'Минеральные Воды', timezone: 'Europe/Moscow', lat: 44.2111, lon: 43.1361 },
  { name: 'Находка', timezone: 'Asia/Vladivostok', lat: 42.8167, lon: 132.8833 },
  { name: 'Уссурийск', timezone: 'Asia/Vladivostok', lat: 43.8017, lon: 131.9483 },
  { name: 'Березники', timezone: 'Asia/Yekaterinburg', lat: 59.4089, lon: 56.8200 },
  { name: 'Салават', timezone: 'Asia/Yekaterinburg', lat: 53.3611, lon: 55.9278 },
  { name: 'Нефтекамск', timezone: 'Asia/Yekaterinburg', lat: 56.0886, lon: 54.2669 },
  { name: 'Нефтеюганск', timezone: 'Asia/Yekaterinburg', lat: 61.0989, lon: 72.6036 },
  { name: 'Первоуральск', timezone: 'Asia/Yekaterinburg', lat: 56.9081, lon: 59.9442 },
  { name: 'Октябрьский', timezone: 'Asia/Yekaterinburg', lat: 54.4811, lon: 53.4714 },
  { name: 'Ачинск', timezone: 'Asia/Krasnoyarsk', lat: 56.2694, lon: 90.4989 },
  { name: 'Северодвинск', timezone: 'Europe/Moscow', lat: 64.5636, lon: 39.8303 },
  { name: 'Каспийск', timezone: 'Europe/Moscow', lat: 42.8817, lon: 47.6386 },
  { name: 'Нальчик', timezone: 'Europe/Moscow', lat: 43.4981, lon: 43.6189 },
  { name: 'Черкесск', timezone: 'Europe/Moscow', lat: 44.2233, lon: 42.0578 },
  { name: 'Майкоп', timezone: 'Europe/Moscow', lat: 44.6098, lon: 40.1006 },
  { name: 'Элиста', timezone: 'Europe/Moscow', lat: 46.3083, lon: 44.2556 },
  { name: 'Грозный', timezone: 'Europe/Moscow', lat: 43.3181, lon: 45.6986 },
  { name: 'Назрань', timezone: 'Europe/Moscow', lat: 43.2261, lon: 44.7731 },
  { name: 'Магас', timezone: 'Europe/Moscow', lat: 43.1653, lon: 44.8081 },
  { name: 'Анапа', timezone: 'Europe/Moscow', lat: 44.8950, lon: 37.3167 },
  { name: 'Геленджик', timezone: 'Europe/Moscow', lat: 44.5606, lon: 38.0769 },
  { name: 'Туапсе', timezone: 'Europe/Moscow', lat: 44.1067, lon: 39.0778 },
  { name: 'Армавир', timezone: 'Europe/Moscow', lat: 44.9892, lon: 41.1234 },
  { name: 'Невинномысск', timezone: 'Europe/Moscow', lat: 44.6333, lon: 41.9417 }
]

function CityAutocomplete({ value, onChange, onCitySelect }) {
  const [inputValue, setInputValue] = useState(value || '')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    onChange(val)

    if (val.length >= 2) {
      const filtered = RUSSIAN_CITIES.filter(city =>
        city.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelectCity = (city) => {
    setInputValue(city.name)
    onChange(city.name)
    setShowSuggestions(false)

    // Pass city data to parent
    if (onCitySelect) {
      onCitySelect({
        city: city.name,
        latitude: city.lat,
        longitude: city.lon,
        timezone: city.timezone
      })
    }
  }

  return (
    <div className="city-autocomplete" ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
        placeholder="Начните вводить название..."
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="city-suggestions">
          {suggestions.map((city, idx) => (
            <div
              key={idx}
              className="city-suggestion-item"
              onClick={() => handleSelectCity(city)}
            >
              <span className="city-name">{city.name}</span>
              <span className="city-timezone">{city.timezone}</span>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="city-suggestions">
          <div className="no-suggestions">
            <p>Город "{inputValue}" не найден в списке.</p>
            <p className="manual-hint">
              💡 Можно ввести вручную - координаты будут приблизительными.
              Или выберите ближайший крупный город для точного расчёта.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CityAutocomplete
