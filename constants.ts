import { CelestialBody } from './types';

// Updated reliable texture source
const TEXTURE_PATH = "https://raw.githubusercontent.com/gle58/solar-system-threejs/main/public/textures";

// High-res galaxy background (ESO/NASA source or reliable GitHub mirror)
export const DEFAULT_BACKGROUND_URL = "https://upload.wikimedia.org/wikipedia/commons/8/89/ESO_-_Milky_Way.jpg";

// Valid Base64 Texture for Saturn's Ring (Gradient from transparent to white to transparent)
const SATURN_RING_TEXTURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAABCAYAAAA5120lAAAANUlEQVR42u3OsQ0AAAjDPPv/nHABExVxwqXbu6HWFwAAAAAAAAAAAADgJwAAAAAAAH4BAgAAKDQCNd6pfWMAAAAASUVORK5CYII=";

export const INITIAL_BODIES: CelestialBody[] = [
  {
    name: "Sun",
    nameRu: "Солнце",
    type: "star",
    radius: 12,
    distance: 0,
    speed: 0,
    color: "#FDB813",
    textureUrl: `${TEXTURE_PATH}/sun.jpg`,
    description: "Центральная звезда Солнечной системы. Состоит в основном из водорода и гелия."
  },
  {
    name: "Mercury",
    nameRu: "Меркурий",
    type: "planet",
    radius: 1.5,
    distance: 20,
    speed: 4.1,
    color: "#B5A7A7",
    textureUrl: `${TEXTURE_PATH}/mercury.jpg`,
    description: "Самая маленькая планета Солнечной системы, ближайшая к Солнцу."
  },
  {
    name: "Venus",
    nameRu: "Венера",
    type: "planet",
    radius: 3.8,
    distance: 30,
    speed: 1.6,
    color: "#E6DBD1",
    textureUrl: `${TEXTURE_PATH}/venus.jpg`,
    description: "Вторая планета от Солнца. Имеет плотную атмосферу из углекислого газа."
  },
  {
    name: "Earth",
    nameRu: "Земля",
    type: "planet",
    radius: 4,
    distance: 45,
    speed: 1,
    color: "#2D3B6E",
    textureUrl: `${TEXTURE_PATH}/earth.jpg`,
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
        textureUrl: `${TEXTURE_PATH}/moon.jpg`,
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
    color: "#C1440E",
    textureUrl: `${TEXTURE_PATH}/mars.jpg`,
    description: "Четвертая планета от Солнца, «Красная планета».",
    moons: [
      {
        name: "Phobos",
        nameRu: "Фобос",
        type: "moon",
        radius: 0.4,
        distance: 3.5,
        speed: 3,
        color: "#78716c",
        description: "Один из двух спутников Марса."
      },
      {
        name: "Deimos",
        nameRu: "Деймос",
        type: "moon",
        radius: 0.3,
        distance: 5,
        speed: 2,
        color: "#a8a29e",
        description: "Меньший и наиболее удалённый спутник Марса."
      }
    ]
  },
  {
    name: "Vesta",
    nameRu: "Веста",
    type: "asteroid",
    radius: 0.5,
    distance: 68,
    speed: 0.4,
    color: "#888888",
    description: "Крупнейший яркий астероид главного пояса. Единственный астероид, видимый невооруженным глазом."
  },
  {
    name: "Pallas",
    nameRu: "Паллада",
    type: "asteroid",
    radius: 0.5,
    distance: 72,
    speed: 0.38,
    color: "#4B5D69",
    description: "Третий по величине объект в поясе астероидов. Богата силикатами."
  },
  {
    name: "Ceres",
    nameRu: "Церера",
    type: "dwarf",
    radius: 0.9,
    distance: 76,
    speed: 0.35,
    color: "#aaa",
    textureUrl: `${TEXTURE_PATH}/ceres.jpg`,
    description: "Самая близкая к нам карликовая планета в поясе астероидов. На ней обнаружены криовулканы."
  },
  {
    name: "Hygiea",
    nameRu: "Гигея",
    type: "asteroid",
    radius: 0.45,
    distance: 82,
    speed: 0.32,
    color: "#383838",
    description: "Четвертый по величине объект пояса астероидов. Состоит из углеродистых материалов."
  },
  {
    name: "Jupiter",
    nameRu: "Юпитер",
    type: "planet",
    radius: 9,
    distance: 90,
    speed: 0.08,
    color: "#BCAFB2",
    textureUrl: `${TEXTURE_PATH}/jupiter.jpg`,
    description: "Крупнейшая планета Солнечной системы, газовый гигант.",
    moons: [
      { name: "Io", nameRu: "Ио", type: "moon", radius: 0.8, distance: 13, speed: 2.5, color: "#fcd34d", description: "Вулканически активный спутник." },
      { name: "Europa", nameRu: "Европа", type: "moon", radius: 0.7, distance: 15, speed: 2.0, color: "#bfdbfe", description: "Спутник с подледным океаном." },
      { name: "Ganymede", nameRu: "Ганимед", type: "moon", radius: 1.2, distance: 18, speed: 1.5, color: "#9ca3af", description: "Крупнейший спутник в Солнечной системе." },
      { name: "Callisto", nameRu: "Каллисто", type: "moon", radius: 1.1, distance: 22, speed: 1.0, color: "#6b7280", description: "Много кратеров, древняя поверхность." }
    ]
  },
  {
    name: "Saturn",
    nameRu: "Сатурн",
    type: "planet",
    radius: 8,
    distance: 130,
    speed: 0.03,
    color: "#EAD6B8",
    textureUrl: `${TEXTURE_PATH}/saturn.jpg`,
    ringConfig: {
      innerRadius: 10,
      outerRadius: 18,
      textureUrl: SATURN_RING_TEXTURE,
      rotation: [-Math.PI / 2.5, 0, 0]
    },
    description: "Шестая планета, известная своей впечатляющей системой колец.",
    moons: [
      { name: "Titan", nameRu: "Титан", type: "moon", radius: 1.5, distance: 24, speed: 1.2, color: "#fbbf24", description: "Крупнейший спутник Сатурна." }
    ]
  },
  {
    name: "Uranus",
    nameRu: "Уран",
    type: "planet",
    radius: 6,
    distance: 170,
    speed: 0.01,
    color: "#D1F3F5",
    textureUrl: `${TEXTURE_PATH}/uranus.jpg`,
    ringConfig: {
      innerRadius: 7,
      outerRadius: 10,
      color: "#ffffff",
      rotation: [0, 0, Math.PI / 2]
    },
    description: "Седьмая планета. Ледяной гигант, самая холодная планетарная атмосфера.",
    moons: [
      { name: "Titania", nameRu: "Титания", type: "moon", radius: 0.7, distance: 12, speed: 2, color: "#e5e7eb", description: "Крупнейший спутник Урана." }
    ]
  },
  {
    name: "Neptune",
    nameRu: "Нептун",
    type: "planet",
    radius: 5.8,
    distance: 210,
    speed: 0.006,
    color: "#5B5DDF",
    textureUrl: `${TEXTURE_PATH}/neptune.jpg`,
    description: "Восьмая и самая дальняя планета. Синие ветры и ледяные штормы.",
    moons: [
      { name: "Triton", nameRu: "Тритон", type: "moon", radius: 0.9, distance: 10, speed: -1.5, color: "#fca5a5", description: "Крупный спутник с ретроградной орбитой." }
    ]
  },
  {
    name: "Orcus",
    nameRu: "Орк",
    type: "dwarf",
    radius: 0.8,
    distance: 245,
    speed: 0.0041,
    color: "#8C8C8C",
    description: "Крупный транснептуновый объект, называемый «анти-Плутоном» из-за схожей орбиты.",
    moons: [
        { name: "Vanth", nameRu: "Вант", type: "moon", radius: 0.3, distance: 3, speed: 1.1, color: "#7a7a7a", description: "Спутник Орка." }
    ]
  },
  {
    name: "Pluto",
    nameRu: "Плутон",
    type: "dwarf",
    radius: 1.2,
    distance: 250,
    speed: 0.004,
    color: "#968570",
    textureUrl: `${TEXTURE_PATH}/pluto.jpg`,
    description: "Карликовая планета в поясе Койпера.",
    moons: [
      { name: "Charon", nameRu: "Харон", type: "moon", radius: 0.6, distance: 3, speed: 1, color: "#9ca3af", description: "Крупнейший спутник Плутона." }
    ]
  },
  {
    name: "Haumea",
    nameRu: "Хаумеа",
    type: "dwarf",
    radius: 1.1,
    distance: 270,
    speed: 0.0035,
    color: "#e3e3e3",
    textureUrl: `${TEXTURE_PATH}/haumea.jpg`,
    description: "Карликовая планета необычной вытянутой формы из-за быстрого вращения.",
    moons: [
       { name: "Hi'iaka", nameRu: "Хииака", type: "moon", radius: 0.3, distance: 4, speed: 1.5, color: "#ccc", description: "Спутник Хаумеа." }
    ]
  },
  {
    name: "Makemake",
    nameRu: "Макемаке",
    type: "dwarf",
    radius: 1.15,
    distance: 295,
    speed: 0.003,
    color: "#cf9a74",
    textureUrl: `${TEXTURE_PATH}/makemake.jpg`,
    description: "Третья по величине карликовая планета. Покрыта метановым льдом."
  },
  {
    name: "Eris",
    nameRu: "Эрида",
    type: "dwarf",
    radius: 1.25,
    distance: 340,
    speed: 0.002,
    color: "#ffffff",
    textureUrl: `${TEXTURE_PATH}/eris.jpg`,
    description: "Самая массивная карликовая планета, расположенная в рассеянном диске.",
    moons: [
        { name: "Dysnomia", nameRu: "Дисномия", type: "moon", radius: 0.4, distance: 5, speed: 1.2, color: "#bbb", description: "Спутник Эриды." }
    ]
  },
  {
    name: "Sedna",
    nameRu: "Седна",
    type: "dwarf",
    radius: 1.0,
    distance: 400,
    speed: 0.001,
    color: "#8B0000",
    description: "Транснептуновый объект с очень вытянутой орбитой. Один из самых красных объектов Солнечной системы."
  }
];