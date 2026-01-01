import { CelestialBody, QuizQuestion, Tour } from './types';

export const TOURS: Tour[] = [
  { id: 'rocky', name: 'Каменные планеты', targets: ['Mercury', 'Venus', 'Earth', 'Mars'] },
  { id: 'giants', name: 'Газовые гиганты', targets: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'] },
  { id: 'moons', name: 'Крупнейшие спутники', targets: ['Moon', 'Io', 'Europa', 'Titan'] }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { question: "Какая планета самая горячая?", options: ["Меркурий", "Венера", "Марс", "Юпитер"], correct: 1 },
  { question: "Самая высокая гора Олимп находится на...", options: ["Земле", "Луне", "Марсе", "Венере"], correct: 2 },
  { question: "Какая планета вращается 'на боку'?", options: ["Сатурн", "Уран", "Нептун", "Плутон"], correct: 1 },
  { question: "Крупнейший спутник Юпитера?", options: ["Ио", "Европа", "Каллисто", "Ганимед"], correct: 3 }
];

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
    temperature: "5500°C",
    composition: ["Водород", "Гелий"],
    interestingFacts: [
      "Свету нужно 8 минут, чтобы достичь Земли.",
      "99.8% массы системы — это Солнце.",
      "Оно превращает 600 млн тонн водорода в гелий каждую секунду.",
      "Солнце — это идеальный газовый шар."
    ],
    description: "Центральная звезда, дарующая жизнь."
  },
  {
    name: "Mercury",
    nameRu: "Меркурий",
    type: "planet",
    radius: 1.5,
    realRadius: 2439,
    distance: 22,
    speed: 4.1,
    color: "#8C7853",
    mass: "3.285 × 10²³ кг",
    temperature: "-180°C до 430°C",
    orbitalPeriod: "88 дней",
    description: "Ближайшая и самая маленькая планета.",
    interestingFacts: ["Самый быстрый на орбите.", "Дни дольше годов."]
  },
  {
    name: "Venus",
    nameRu: "Венера",
    type: "planet",
    radius: 3.8,
    realRadius: 6051,
    distance: 35,
    speed: 1.6,
    color: "#FFC649",
    temperature: "465°C",
    description: "Раскаленная 'сестра' Земли.",
    interestingFacts: ["Вращается в обратную сторону.", "Облака из серной кислоты."]
  },
  {
    name: "Earth",
    nameRu: "Земля",
    type: "planet",
    radius: 4,
    realRadius: 6371,
    distance: 50,
    speed: 1,
    color: "#4169E1",
    mass: "5.972 × 10²⁴ кг",
    composition: ["Азот", "Кислород"],
    description: "Наш дом, единственная планета с жидкой водой на поверхности.",
    explorationHistory: [{ year: "1961", mission: "Восток-1", detail: "Гагарин в космосе" }],
    interestingFacts: ["71% поверхности — океаны.", "Единственная планета с тектоникой плит."],
    moons: [{ name: "Moon", nameRu: "Луна", type: "moon", radius: 1, realRadius: 1737, distance: 8, speed: 2, color: "#D1D5DB", description: "Спутник Земли." }]
  },
  {
    name: "Mars",
    nameRu: "Марс",
    type: "planet",
    radius: 2.1,
    realRadius: 3389,
    distance: 65,
    speed: 0.53,
    color: "#CD5C5C",
    temperature: "-63°C",
    description: "Красная планета, цель человечества.",
    explorationHistory: [{ year: "2021", mission: "Perseverance", detail: "Поиск следов жизни" }],
    interestingFacts: ["Здесь находится гора Олимп.", "Небо здесь розовое."]
  },
  {
    name: "Jupiter",
    nameRu: "Юпитер",
    type: "planet",
    radius: 9,
    realRadius: 69911,
    distance: 100,
    speed: 0.08,
    color: "#C88B3A",
    description: "Король планет, газовый гигант.",
    moons: [
      { name: "Io", nameRu: "Ио", type: "moon", radius: 0.8, realRadius: 1821, distance: 13, speed: 2.5, color: "#fcd34d", description: "Вулканический мир." },
      { name: "Europa", nameRu: "Европа", type: "moon", radius: 0.7, realRadius: 1560, distance: 16, speed: 2.0, color: "#bfdbfe", description: "Ледяной океан." }
    ]
  },
  {
    name: "Saturn",
    nameRu: "Сатурн",
    type: "planet",
    radius: 8,
    realRadius: 58232,
    distance: 145,
    speed: 0.03,
    color: "#FAD5A5",
    ringConfig: { innerRadius: 10, outerRadius: 19, color: "#d4c3a1", hasGaps: true },
    description: "Властелин колец.",
    moons: [{ name: "Titan", nameRu: "Титан", type: "moon", radius: 1.3, realRadius: 2575, distance: 26, speed: 1.2, color: "#fbbf24", description: "Мир с метановыми реками." }]
  }
];
