// Ayberk Giydirme - Gardırop Config
// Bu dosya, sitedeki kaydırıcılarla ayarladığın konum/ölçek değerleriyle
// otomatik oluşturuldu. src/data/wardrobeConfig.js'in üzerine yaz.
//
// NOT: acc_shoes_black ve acc_shoes_white artık "layers" (çoklu katman)
// kullanıyor - sol ve sağ ayakkabı ayrı görsel + ayrı transform olarak
// tanımlı, böylece ikisini birbirinden bağımsız hizalayabiliyoruz.
// Bunun çalışması için AyberkGiydirme.jsx'in de güncellenmiş halini
// kullanman gerekiyor (aynı pakette geldi).

export const CATEGORIES = [
  {
    "key": "hair",
    "label": "Saç",
    "icon": "hair"
  },
  {
    "key": "top",
    "label": "Üst",
    "icon": "top"
  },
  {
    "key": "bottom",
    "label": "Alt",
    "icon": "bottom"
  },
  {
    "key": "accessory",
    "label": "Aksesuar",
    "icon": "accessory"
  }
];

export const LAYER_ORDER = [
  "bottom",
  "top",
  "hair",
  "accessory"
];

export const WARDROBE_ITEMS = {
  "hair": [
    {
      "id": "hair_curly",
      "name": "Kıvırcık Saç (Sarı Uçlu)",
      "image": "/assets/character/hair/hair_curly.png",
      "transform": { "top": 0, "left": 50, "width": 46 }
    },
    {
      "id": "hat_black",
      "name": "Siyah Şapka",
      "image": "/assets/character/hair/hat_black.png",
      "transform": { "top": 0, "left": 50, "width": 40 }
    }
  ],
  "top": [
    {
      "id": "top_black_basic",
      "name": "Siyah Basic Tişört",
      "image": "/assets/character/top/top_black_basic.png",
      "transform": { "top": 17.3, "left": 50, "width": 91.8 }
    },
    {
      "id": "top_white_tank",
      "name": "Beyaz Atlet",
      "zIndex": 22,
      "image": "/assets/character/top/top_white_tank.png",
      "transform": { "top": 18.3, "left": 50, "width": 54 }
    },
    {
      "id": "top_fein_mesh",
      "name": "Fileli Üst",
      "zIndex": 22,
      "image": "/assets/character/top/top_fein_mesh.png",
      "transform": { "top": 17.7, "left": 50, "width": 101.2 }
    },
    {
      "id": "top_denim_jacket",
      "name": "Kot Ceket",
      "image": "/assets/character/top/top_denim_jacket.png",
      "transform": { "top": 16.1, "left": 50, "width": 98.3 }
    },
    {
      "id": "top_black_jacket",
      "name": "Siyah Ceket",
      "image": "/assets/character/top/top_black_jacket.png",
      "transform": { "top": 15.6, "left": 48.7, "width": 99.4 }
    },
    {
      "id": "top_leather_vest",
      "name": "Deri Yelek",
      "image": "/assets/character/top/top_leather_vest.png",
      "transform": { "top": 16.6, "left": 50, "width": 65.8 }
    },
    {
      "id": "top_shirt_scarf",
      "name": "Atkılı Gömlek",
      "image": "/assets/character/top/top_shirt_scarf.png",
      "transform": { "top": 16.2, "left": 50, "width": 103.2 }
    },
    {
      "id": "top_green_shirt",
      "name": "Yeşil Gömlek",
      "image": "/assets/character/top/top_green_shirt.png",
      "transform": { "top": 15.9, "left": 49, "width": 99.8 }
    }
  ],
  "bottom": [
    {
      "id": "bottom_denim_cargo",
      "name": "Kot Kargo Pantolon",
      "image": "/assets/character/bottom/bottom_denim_cargo.png",
      "transform": { "top": 42.8, "left": 50, "width": 76 }
    },
    {
      "id": "bottom_black_chain",
      "name": "Zincirli Siyah Pantolon",
      "image": "/assets/character/bottom/bottom_black_chain.png",
      "transform": { "top": 42.4, "left": 50, "width": 80.4 }
    },
    {
      "id": "bottom_dark_wide",
      "name": "Gri Eşofman",
      "image": "/assets/character/bottom/bottom_dark_wide.png",
      "transform": { "top": 39.4, "left": 50, "width": 72.1 }
    },
    {
      "id": "bottom_gray_sweat",
      "name": "Yeşil Eşofman",
      "image": "/assets/character/bottom/bottom_gray_sweat.png",
      "transform": { "top": 40.4, "left": 50, "width": 85.3 }
    },
    {
      "id": "bottom_white_wide",
      "name": "Beyaz Bol Pantolon",
      "image": "/assets/character/bottom/bottom_white_wide.png",
      "transform": { "top": 42.2, "left": 50, "width": 82.7 }
    }
  ],
  "accessory": [
    {
      "id": "acc_sunglasses",
      "name": "Güneş Gözlüğü",
      "image": "/assets/character/accessory/acc_sunglasses.png",
      "transform": { "top": 8.8, "left": 50, "width": 29.3 }
    },
    {
      "id": "acc_belt",
      "name": "Kemer",
      "zIndex": 25,
      "image": "/assets/character/accessory/acc_belt.png",
      "transform": { "top": 41.2, "left": 50, "width": 55.7 }
    },
    {
      "id": "acc_mate",
      "name": "Mate Çayı",
      "image": "/assets/character/accessory/acc_mate.png",
      "transform": { "top": 47, "left": 85.4, "width": 28.4 }
    },
    {
      "id": "acc_shoes_black",
      "name": "Siyah Spor Ayakkabı",
      "zIndex": 10,
      "layers": [
        {
          "label": "Sol",
          "image": "/assets/character/accessory/acc_shoe_black_left.png",
          "transform": { "top": 94, "left": 38, "width": 18 }
        },
        {
          "label": "Sağ",
          "image": "/assets/character/accessory/acc_shoe_black_right.png",
          "transform": { "top": 94, "left": 62, "width": 18 }
        }
      ]
    },
    {
      "id": "acc_shoes_white",
      "name": "Beyaz Spor Ayakkabı",
      "zIndex": 10,
      "layers": [
        {
          "label": "Sol",
          "image": "/assets/character/accessory/acc_shoe_white_left.png",
          "transform": { "top": 93, "left": 38, "width": 18 }
        },
        {
          "label": "Sağ",
          "image": "/assets/character/accessory/acc_shoe_white_right.png",
          "transform": { "top": 93, "left": 62, "width": 18 }
        }
      ]
    }
  ]
};

export const BASE_SCENE = "/assets/character/base_character.png";
export const BASE_SCENE_ASPECT = 0.34080717488789236;