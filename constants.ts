import { CelestialBody } from './types';

export const INITIAL_BODIES: CelestialBody[] = [
  {
    name: "Sun",
    nameRu: "Солнце",
    type: "star",
    radius: 12,
    distance: 0,
    speed: 0,
    color: "#FDB813",
    description: "Центральная звезда Солнечной системы. Состоит в основном из водорода и гелия."
  },
  {
    name: "Mercury",
    nameRu: "Меркурий",
    type: "planet",
    radius: 1.5,
    distance: 20,
    speed: 4.1,
    color: "#8C7853",
    description: "Самая маленькая планета Солнечной системы, ближайшая к Солнцу."
  },
  {
    name: "Venus",
    nameRu: "Венера",
    type: "planet",
    radius: 3.8,
    distance: 30,
    speed: 1.6,
    color: "#FFC649",
    description: "Вторая планета от Солнца. Имеет плотную атмосферу из углекислого газа."
  },
  {
    name: "Earth",
    nameRu: "Земля",
    type: "planet",
    radius: 4,
    distance: 45,
    speed: 1,
    color: "#4169E1",
    description: "Наш дом. Единственное известное тело во Вселенной, населенное живыми организмами.",
    moons: [
      {
        name: "Moon",
        nameRu: "Луна",
        type: "moon",
        radius: 1,
        distance: 8,
        speed: 2,
        color: "#D1D5DB",
        description: "Единственный естественный спутник Земли."
      }
    ]
  },
  {
    name: "Mars",
    nameRu: "Марс",
    type: "planet",
    radius: 2.1,
    distance: 60,
    speed: 0.53,
    color: "#CD5C5C",
    description: "Четвертая планета от Солнца, «Красная планета»."
  },
  {
    name: "Ceres",
    nameRu: "Церера",
    type: "dwarf",
    radius: 0.9,
    distance: 76,
    speed: 0.35,
    color: "#aaa",
    description: "Самая близкая к нам карликовая планета в поясе астероидов."
  },
  {
    name: "Jupiter",
    nameRu: "Юпитер",
    type: "planet",
    radius: 9,
    distance: 95,
    speed: 0.08,
    color: "#C88B3A",
    description: "Крупнейшая планета Солнечной системы, газовый гигант."
  },
  {
    name: "Saturn",
    nameRu: "Сатурн",
    type: "planet",
    radius: 8,
    distance: 135,
    speed: 0.03,
    color: "#FAD5A5",
    ringConfig: {
      innerRadius: 10,
      outerRadius: 18,
      color: "#d4c3a1",
      rotation: [-Math.PI / 2.5, 0, 0]
    },
    description: "Шестая планета, известная своей впечатляющей системой колец."
  },
  {
    name: "Uranus",
    nameRu: "Уран",
    type: "planet",
    radius: 6,
    distance: 175,
    speed: 0.01,
    color: "#4FD0E5",
    ringConfig: {
      innerRadius: 7,
      outerRadius: 10,
      color: "#b0e0e6",
      rotation: [0, 0, Math.PI / 2]
    },
    description: "Седьмая планета. Ледяной гигант."
  },
  {
    name: "Neptune",
    nameRu: "Нептун",
    type: "planet",
    radius: 5.8,
    distance: 210,
    speed: 0.006,
    color: "#4166F5",
    description: "Восьмая и самая дальняя планета."
  },
  {
    name: "Pluto",
    nameRu: "Плутон",
    type: "dwarf",
    radius: 1.2,
    distance: 240,
    speed: 0.004,
    color: "#968570",
    description: "Карликовая планета в поясе Койпера."
  }
];
