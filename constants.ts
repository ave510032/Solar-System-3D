import { CelestialBody } from './types';

export const INITIAL_BODIES: CelestialBody[] = [
  {
    name: "Sun",
    nameRu: "Солнце",
    type: "star",
    radius: 14,
    realRadius: 696340,
    distance: 0,
    speed: 0,
    color: "#FDB813",
    mass: "1.989 × 10³⁰ кг",
    gravity: "274 м/с²",
    rotationPeriod: "25-35 дней",
    temperature: "5500°C (поверхность), 15 млн°C (ядро)",
    composition: ["Водород (73%)", "Гелий (25%)", "Кислород", "Углерод"],
    interestingFacts: [
      "Солнце составляет 99.8% всей массы Солнечной системы.",
      "Свету требуется 8 минут и 20 секунд, чтобы достичь Земли.",
      "Внутри Солнца может поместиться около 1.3 миллиона планет Земля.",
      "Солнце — почти идеальная сфера."
    ],
    description: "Центральная звезда нашей системы, желтый карлик главной последовательности."
  },
  {
    name: "Mercury",
    nameRu: "Меркурий",
    type: "planet",
    radius: 1.5,
    realRadius: 2439,
    distance: 22,
    realDistance: "57.9",
    speed: 4.1,
    mass: "3.285 × 10²³ кг",
    gravity: "3.7 м/с²",
    rotationPeriod: "58.6 дней",
    orbitalPeriod: "88 дней",
    temperature: "-180°C до 430°C",
    composition: ["Железо", "Никель", "Силикаты"],
    interestingFacts: [
      "Меркурий — самая быстрая планета в системе.",
      "Несмотря на близость к Солнцу, он не самый горячий.",
      "У планеты есть хвост, похожий на кометный.",
      "Год на Меркурии короче, чем его день."
    ],
    color: "#8C7853",
    description: "Самая маленькая планета и ближайшая к Солнцу."
  },
  {
    name: "Venus",
    nameRu: "Венера",
    type: "planet",
    radius: 3.8,
    realRadius: 6051,
    distance: 35,
    realDistance: "108.2",
    speed: 1.6,
    mass: "4.867 × 10²⁴ кг",
    gravity: "8.87 м/с²",
    rotationPeriod: "243 дня (ретроградное)",
    orbitalPeriod: "225 дней",
    temperature: "465°C стабильно",
    composition: ["Углекислый газ", "Азот", "Облака серной кислоты"],
    interestingFacts: [
      "Венера вращается в обратную сторону по сравнению с другими планетами.",
      "Это самая горячая планета в Солнечной системе.",
      "Атмосферное давление в 90 раз выше земного.",
      "Ее часто называют 'Сестрой Земли' из-за схожих размеров."
    ],
    color: "#FFC649",
    description: "Вторая планета от Солнца, адское место с мощным парниковым эффектом."
  },
  {
    name: "Earth",
    nameRu: "Земля",
    type: "planet",
    radius: 4,
    realRadius: 6371,
    distance: 50,
    realDistance: "149.6",
    speed: 1,
    mass: "5.972 × 10²⁴ кг",
    gravity: "9.81 м/с²",
    rotationPeriod: "23.9 часа",
    orbitalPeriod: "365.25 дней",
    temperature: "-89°C до 58°C",
    composition: ["Азот (78%)", "Кислород (21%)", "Аргон"],
    interestingFacts: [
      "Земля — единственное известное место во Вселенной с жизнью.",
      "Около 71% поверхности покрыто водой.",
      "Она защищена магнитным полем от солнечного ветра.",
      "Единственная планета, чье название не происходит от греко-римских богов."
    ],
    color: "#4169E1",
    description: "Наш родной дом, колыбель человечества.",
    moons: [
      {
        name: "Moon",
        nameRu: "Луна",
        type: "moon",
        radius: 1,
        realRadius: 1737,
        distance: 8,
        speed: 2,
        color: "#D1D5DB",
        description: "Единственный спутник Земли."
      }
    ]
  },
  {
    name: "Mars",
    nameRu: "Марс",
    type: "planet",
    radius: 2.1,
    realRadius: 3389,
    distance: 65,
    realDistance: "227.9",
    speed: 0.53,
    mass: "6.39 × 10²³ кг",
    gravity: "3.71 м/с²",
    rotationPeriod: "24.6 часа",
    orbitalPeriod: "687 дней",
    temperature: "-153°C до 20°C",
    composition: ["Углекислый газ", "Аргон", "Азот"],
    interestingFacts: [
      "На Марсе находится самая высокая гора в системе — Олимп (21 км).",
      "У Марса два маленьких спутника: Фобос и Деймос.",
      "Марс имеет красный цвет из-за оксида железа (ржавчины) в пыли.",
      "На Марсе бывают самые масштабные пылевые бури."
    ],
    color: "#CD5C5C",
    description: "Четвертая планета, цель будущей колонизации."
  },
  {
    name: "Jupiter",
    nameRu: "Юпитер",
    type: "planet",
    radius: 9,
    realRadius: 69911,
    distance: 100,
    realDistance: "778.5",
    speed: 0.08,
    mass: "1.898 × 10²⁷ кг",
    gravity: "24.79 м/с²",
    rotationPeriod: "9.9 часа",
    orbitalPeriod: "11.86 лет",
    temperature: "-110°C",
    composition: ["Водород", "Гелий", "Метан", "Аммиак"],
    interestingFacts: [
      "Юпитер в 318 раз тяжелее Земли.",
      "Большое Красное Пятно — это гигантский шторм, существующий сотни лет.",
      "У Юпитера есть слабые кольца.",
      "Это 'пылесос' системы, защищающий Землю от астероидов."
    ],
    color: "#C88B3A",
    description: "Король планет, газовый гигант огромных размеров.",
    moons: [
      { name: "Io", nameRu: "Ио", type: "moon", radius: 0.8, realRadius: 1821, distance: 13, speed: 2.5, color: "#fcd34d", description: "Самый вулканический мир." },
      { name: "Europa", nameRu: "Европа", type: "moon", radius: 0.7, realRadius: 1560, distance: 16, speed: 2.0, color: "#bfdbfe", description: "Мир подледного океана." },
      { name: "Ganymede", nameRu: "Ганимед", type: "moon", radius: 1.2, realRadius: 2634, distance: 19, speed: 1.5, color: "#9ca3af", description: "Крупнейший спутник системы." },
      { name: "Callisto", nameRu: "Каллисто", type: "moon", radius: 1.1, realRadius: 2410, distance: 22, speed: 1.0, color: "#6b7280", description: "Мир древних кратеров." }
    ]
  },
  {
    name: "Saturn",
    nameRu: "Сатурн",
    type: "planet",
    radius: 8,
    realRadius: 58232,
    distance: 145,
    realDistance: "1433.5",
    speed: 0.03,
    mass: "5.683 × 10²⁶ кг",
    gravity: "10.44 м/с²",
    rotationPeriod: "10.7 часа",
    orbitalPeriod: "29.45 лет",
    temperature: "-140°C",
    composition: ["Водород", "Гелий"],
    interestingFacts: [
      "Кольца Сатурна состоят в основном из кусков льда.",
      "Сатурн мог бы плавать в воде, так как его плотность меньше плотности воды.",
      "На северном полюсе планеты есть странный шестиугольный шторм.",
      "Скорость ветра может достигать 1800 км/ч."
    ],
    color: "#FAD5A5",
    ringConfig: {
      innerRadius: 10,
      outerRadius: 19,
      color: "#d4c3a1",
      rotation: [-Math.PI / 2.5, 0.05, 0],
      hasGaps: true
    },
    description: "Жемчужина системы, великолепная окольцованная планета.",
    moons: [
      { name: "Mimas", nameRu: "Мимас", type: "moon", radius: 0.4, realRadius: 198, distance: 10, speed: 3.5, color: "#888", description: "Похож на Звезду Смерти." },
      { name: "Enceladus", nameRu: "Энцелад", type: "moon", radius: 0.5, realRadius: 252, distance: 12, speed: 3.0, color: "#ffffff", description: "Ледяной мир с гейзерами." },
      { name: "Titan", nameRu: "Титан", type: "moon", radius: 1.3, realRadius: 2575, distance: 26, speed: 1.2, color: "#fbbf24", description: "Спутник с плотной атмосферой." }
    ]
  },
  {
    name: "Uranus",
    nameRu: "Уран",
    type: "planet",
    radius: 6,
    realRadius: 25362,
    distance: 185,
    realDistance: "2872.5",
    speed: 0.01,
    mass: "8.681 × 10²⁵ кг",
    gravity: "8.69 м/с²",
    rotationPeriod: "17.2 часа (на боку)",
    orbitalPeriod: "84 года",
    temperature: "-224°C (минимум)",
    composition: ["Лед", "Вода", "Аммиак", "Метан"],
    interestingFacts: [
      "Уран вращается 'на боку' — его ось наклонена на 98 градусов.",
      "Это самая холодная планета в Солнечной системе.",
      "У планеты есть 13 известных колец.",
      "Цвет планеты обусловлен поглощением красного света метаном."
    ],
    color: "#4FD0E5",
    ringConfig: {
      innerRadius: 7,
      outerRadius: 10,
      color: "#b0e0e6",
      rotation: [Math.PI / 2, 0, 0]
    },
    description: "Ледяной гигант, катящийся по своей орбите."
  },
  {
    name: "Neptune",
    nameRu: "Нептун",
    type: "planet",
    radius: 5.8,
    realRadius: 24622,
    distance: 220,
    realDistance: "4495.1",
    speed: 0.006,
    mass: "1.024 × 10²⁶ кг",
    gravity: "11.15 м/с²",
    rotationPeriod: "16.1 часа",
    orbitalPeriod: "164.8 лет",
    temperature: "-201°C",
    composition: ["Водород", "Гелий", "Метан"],
    interestingFacts: [
      "Нептун был первой планетой, открытой с помощью математических расчетов.",
      "На Нептуне дуют самые сильные ветры в системе (до 2100 км/ч).",
      "У него есть 'Большое Темное Пятно', похожее на пятно Юпитера.",
      "Тритон — его крупнейший спутник, вращается в обратную сторону."
    ],
    color: "#4166F5",
    description: "Далекий синий гигант, царство ветров.",
    moons: [
      { name: "Triton", nameRu: "Тритон", type: "moon", radius: 0.8, realRadius: 1353, distance: 10, speed: 2.0, color: "#fca5a5", description: "Захваченный объект из пояса Койпера." }
    ]
  },
  {
    name: "Pluto",
    nameRu: "Плутон",
    type: "dwarf",
    radius: 1.2,
    realRadius: 1188,
    distance: 250,
    realDistance: "5906.4",
    speed: 0.004,
    orbitalPeriod: "248 лет",
    temperature: "-225°C",
    interestingFacts: [
      "Плутон меньше нашей Луны.",
      "У Плутона есть сердцевидная область, называемая Равниной Спутника.",
      "Иногда Плутон находится ближе к Солнцу, чем Нептун.",
      "Пять известных спутников."
    ],
    color: "#968570",
    description: "Самая известная карликовая планета, холодный мир на краю системы."
  }
];