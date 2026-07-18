import { useState } from 'react';
import {
  CATEGORIES,
  LAYER_ORDER,
  WARDROBE_ITEMS,
  BASE_SCENE,
  BASE_SCENE_ASPECT,
} from '../data/wardrobeConfig';

// Oda arka planı (giyinme odası sahnesi). Karakter kutusu bu sahnenin
// içine, aşağıdaki ROOM_CHARACTER_SLOT ile belirtilen konum/boyutta
// yerleştiriliyor.
const ROOM_BACKGROUND = '/assets/scenes/dressing_room.png';
const ROOM_ASPECT = 887 / 1774;
const ROOM_CHARACTER_SLOT = { top: 15, left: 50, width: 47 };

const CATEGORY_ICON = {
  hair: '💇',
  top: '👕',
  bottom: '👖',
  accessory: '💍',
};

// Kategorilerin varsayılan katman (z-index) sırası - sayı ne kadar büyükse
// o kadar üstte görünür.
const CATEGORY_Z_BASE = {
  bottom: 20,
  top: 30,
  hair: 40,
  accessory: 50,
};

function getEffectiveZ(item, category) {
  if (typeof item.zIndex === 'number') return item.zIndex;
  return CATEGORY_Z_BASE[category] ?? 0;
}

// Bir item ya tek görsel ({image, transform}) ya da çoklu katman
// ({layers: [{image, transform, label?}, ...]}) olabilir - örn. sol/sağ
// ayakkabı gibi bağımsız hizalanması gereken parçalar için.
function getItemLayers(item) {
  if (item.layers) return item.layers;
  return [{ image: item.image, transform: item.transform }];
}

export default function AyberkGiydirme() {
  const [equipped, setEquipped] = useState({
    hair: null,
    top: null,
    bottom: null,
    accessory: [],
  });
  const [activeTab, setActiveTab] = useState('hair');

  function toggleItem(category, itemId) {
    setEquipped((prev) => {
      if (category === 'accessory') {
        const already = prev.accessory.includes(itemId);
        return {
          ...prev,
          accessory: already
            ? prev.accessory.filter((id) => id !== itemId)
            : [...prev.accessory, itemId],
        };
      }
      return {
        ...prev,
        [category]: prev[category] === itemId ? null : itemId,
      };
    });
  }

  function isEquipped(category, itemId) {
    if (category === 'accessory') return equipped.accessory.includes(itemId);
    return equipped[category] === itemId;
  }

  // Aktif tüm parçaları topla, her birine kategorisini ve efektif
  // z-index'ini etiketleyip küçükten büyüğe sırala (küçük = altta).
  const activeItems = LAYER_ORDER.flatMap((category) => {
    let items;
    if (category === 'accessory') {
      items = equipped.accessory
        .map((id) => WARDROBE_ITEMS.accessory.find((i) => i.id === id))
        .filter(Boolean);
    } else {
      const id = equipped[category];
      if (!id) return [];
      const item = WARDROBE_ITEMS[category].find((i) => i.id === id);
      items = item ? [item] : [];
    }
    return items.map((item) => ({ item, z: getEffectiveZ(item, category) }));
  }).sort((a, b) => a.z - b.z).map((entry) => entry.item);

  return (
    <section id="giydirme" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <p className="font-mono text-xs text-electric-blue mb-3">• MİNİ OYUN</p>
      <h2 className="font-display font-extrabold text-2xl md:text-3xl mb-4 text-on-surface">
        Ayberk <span className="text-electric-blue">Giydirmece</span>
      </h2>
      <p className="font-body text-sm mb-8 text-on-surface-variant">
        Ayberk'i tepeden tırnağa kendi tarzına göre giydir! Saç, üst, alt ve aksesuar kategorilerinden istediğin kadar parçayı bir araya getirip kendi kombinini yarat — <strong>hepsini aynı anda giyebilirsin</strong>.
      </p>

      <div className="border-2 border-electric-blue bg-deep-navy/80 p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Karakter sahnesi: dış katman = oda arka planı, iç katman = karakter+kıyafet kutusu */}
          <div className="flex-shrink-0 mx-auto">
            <div
              className="relative border border-electric-blue overflow-hidden"
              style={{
                width: 'min(60vw, 260px)',
                aspectRatio: `${ROOM_ASPECT}`,
              }}
            >
              {/* Oda arka planı */}
              <img
                src={ROOM_BACKGROUND}
                alt="Giyinme odası"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />

              {/* Karakter + kıyafet kutusu - odanın içinde, boş koridora yerleşiyor */}
              <div
                className="absolute"
                style={{
                  top: `${ROOM_CHARACTER_SLOT.top}%`,
                  left: `${ROOM_CHARACTER_SLOT.left}%`,
                  width: `${ROOM_CHARACTER_SLOT.width}%`,
                  aspectRatio: `${BASE_SCENE_ASPECT}`,
                  transform: 'translateX(-50%)',
                }}
              >
                <img
                  src={BASE_SCENE}
                  alt="Ayberk"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />
                {activeItems.map((item) => {
                  const layers = getItemLayers(item);
                  return layers.map((layer, idx) => (
                    <img
                      key={`${item.id}-${idx}`}
                      src={layer.image}
                      alt={item.name}
                      className="absolute pointer-events-none select-none"
                      draggable={false}
                      style={{
                        top: `${layer.transform.top}%`,
                        left: `${layer.transform.left}%`,
                        width: `${layer.transform.width}%`,
                        transform: 'translateX(-50%)',
                      }}
                    />
                  ));
                })}
              </div>
            </div>
          </div>

          {/* Kontrol paneli */}
          <div className="flex-1 min-w-0">
            {/* Kategori sekmeleri */}
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  className={`font-mono flex items-center gap-2 px-4 py-2 text-xs whitespace-nowrap transition-colors border ${
                    activeTab === cat.key
                      ? 'bg-electric-blue border-electric-blue text-deep-navy'
                      : 'border-electric-blue/40 text-on-surface-variant hover:border-electric-blue'
                  }`}
                >
                  <span>{CATEGORY_ICON[cat.key]}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Parça ızgarası */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {WARDROBE_ITEMS[activeTab].map((item) => {
                const active = isEquipped(activeTab, item.id);
                const thumbLayers = getItemLayers(item);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(activeTab, item.id)}
                    className={`relative aspect-square border p-2 flex items-center justify-center gap-0.5 bg-deep-navy transition-colors ${
                      active
                        ? 'border-electric-blue'
                        : 'border-electric-blue/30 hover:border-electric-blue/70'
                    }`}
                    title={item.name}
                  >
                    {thumbLayers.map((layer, idx) => (
                      <img
                        key={idx}
                        src={layer.image}
                        alt={item.name}
                        className="max-w-[45%] max-h-full object-contain"
                        draggable={false}
                      />
                    ))}
                    {active && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-electric-blue text-deep-navy text-[10px] font-mono flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {equipped.hair === null &&
              equipped.top === null &&
              equipped.bottom === null &&
              equipped.accessory.length === 0 && (
                <p className="font-mono text-xs text-on-surface-variant mt-4">
                  Bir kategori seç ve kıyafetlere dokun, üzerine giyilsin.
                </p>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}