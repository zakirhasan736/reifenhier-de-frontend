'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGetTyreFiltersQuery } from '@/store/api/filterApi';
import CustomSelect from '@/components/elements/inputs/CustomCategorySelect';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface FilterOption {
  name: string;
  count?: number;
}
interface FilterResponse {
  categories: FilterOption[];
  widths: FilterOption[];
  heights: FilterOption[];
  diameters: FilterOption[];
  lastIndexes: FilterOption[];
  wetGrips: FilterOption[];
  fuelClasses: FilterOption[];
  noises: FilterOption[];
}

const FilterForm = () => {
  const router = useRouter();

  const [category, setCategory] = useState('Sommerreifen');
  const [width, setWidth] = useState('205');
  const [height, setHeight] = useState('55');
  const [diameter, setDiameter] = useState('16');
  const [lastIndex, setLastIndex] = useState('');
  const [wetGrip, setWetGrip] = useState('');
  const [fuelClass, setFuelClass] = useState('');
  const [noise, setNoise] = useState('');
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data = {} as FilterResponse } = useGetTyreFiltersQuery({
    category,
    width,
    height,
    diameter,
    lastIndex,
    wetGrip,
    fuelClass,
    noise,
  });

  /* ---------------- helpers ---------------- */
  const toNumber = (v: string) => {
    const s = String(v ?? '')
      .replace(',', '.')
      .trim();
    return /^[0-9]+(\.[0-9]+)?$/.test(s) ? parseFloat(s) : NaN;
  };

  // numeric: large -> small
  const sortNumericDesc = (arr: FilterOption[] = []): FilterOption[] =>
    [...arr]
      .filter(o => o?.name != null && String(o.name).trim() !== '')
      .sort((a, b) => {
        const na = toNumber(String(a.name));
        const nb = toNumber(String(b.name));
        const aNum = !Number.isNaN(na);
        const bNum = !Number.isNaN(nb);
        if (aNum && bNum) return nb - na;
        if (aNum && !bNum) return -1;
        if (!aNum && bNum) return 1;
        return String(a.name).localeCompare(String(b.name), 'de', {
          sensitivity: 'base',
        });
      });

  // alphabetic: A -> Z
  const sortAlphaAsc = (arr: FilterOption[] = []): FilterOption[] =>
    [...arr]
      .filter(o => {
        const n = String(o?.name ?? '').trim();
        return n !== '' && n.toLowerCase() !== 'unbekannt' && n !== '0';
      })
      .sort((a, b) =>
        String(a.name).localeCompare(String(b.name), 'de', {
          sensitivity: 'base',
        })
      );

  const handleSearch = () => {
    if (
      !category &&
      !width &&
      !height &&
      !diameter &&
      !lastIndex &&
      !wetGrip &&
      !fuelClass &&
      !noise
    ) {
      toast.error('Bitte wählen Sie mindestens ein Filterfeld aus.');
      return;
    }

    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (width) params.set('width', width);
    if (height) params.set('height', height);
    if (diameter) params.set('diameter', diameter);
    if (lastIndex) params.set('lastIndex', lastIndex);
    if (wetGrip) params.set('wetGrip', wetGrip);
    if (fuelClass) params.set('fuelClass', fuelClass);
    if (noise) params.set('noise', noise);

    router.push(`/products?${params.toString()}`);
  };

  // speed + load helpers (unchanged)
  const SPEED_INDEXES: { code: string; kmh: number | string }[] = [
    { code: 'A8', kmh: 40 },
    { code: 'B', kmh: 50 },
    { code: 'C', kmh: 60 },
    { code: 'D', kmh: 65 },
    { code: 'E', kmh: 70 },
    { code: 'F', kmh: 80 },
    { code: 'G', kmh: 90 },
    { code: 'J', kmh: 100 },
    { code: 'K', kmh: 110 },
    { code: 'L', kmh: 120 },
    { code: 'M', kmh: 130 },
    { code: 'N', kmh: 140 },
    { code: 'P', kmh: 150 },
    { code: 'Q', kmh: 160 },
    { code: 'R', kmh: 170 },
    { code: 'S', kmh: 180 },
    { code: 'T', kmh: 190 },
    { code: 'U', kmh: 200 },
    { code: 'H', kmh: 210 },
    { code: '(V)', kmh: '>210' },
    { code: 'V', kmh: 240 },
    { code: '(W)', kmh: '>240' },
    { code: 'W', kmh: 270 },
    { code: 'Y', kmh: 300 },
    { code: '(Y)', kmh: '>300' },
    { code: 'ZR', kmh: '>240' },
  ];

  const LOAD_INDEX_KG: Record<number, number> = {
    70: 335,
    71: 345,
    72: 355,
    73: 365,
    74: 375,
    75: 387,
    76: 400,
    77: 412,
    78: 425,
    79: 437,
    80: 450,
    81: 462,
    82: 475,
    83: 487,
    84: 500,
    85: 515,
    86: 530,
    87: 545,
    88: 560,
    89: 580,
    90: 600,
    91: 615,
    92: 630,
    93: 650,
    94: 670,
    95: 690,
    96: 710,
    97: 730,
    98: 750,
    99: 775,
    100: 800,
    101: 825,
    102: 850,
    103: 875,
    104: 900,
    105: 925,
    106: 950,
    107: 975,
    108: 1000,
    109: 1030,
    110: 1060,
    111: 1090,
    112: 1120,
    113: 1150,
    114: 1180,
    115: 1215,
    116: 1250,
    117: 1285,
    118: 1320,
    119: 1360,
    120: 1400,
    121: 1450,
    122: 1500,
  };

  const getLoadKg = (li?: string) => {
    const n = Number(li);
    return Number.isFinite(n) && LOAD_INDEX_KG[n as keyof typeof LOAD_INDEX_KG]
      ? LOAD_INDEX_KG[n as keyof typeof LOAD_INDEX_KG]
      : undefined;
  };

  // const openDialogById = (id: string) => {
  //   (document.getElementById(id) as HTMLDialogElement | null)?.showModal();
  // };

  return (
    <div className="tyres-search-main-content max-w-[978px] w-full relative mx-auto">
      <div className="lg:h-[207px] h-[260px] md:block hidden w-full" />
      <div className="tyres-search-content md:absolute flex flex-col top-0 left-0 w-full bg-mono-0 md:px-[30px] px-4 py-4 md:py-6 rounded-[10px]">
        <div className="lg:pb-8 pb-14 relative">
          <div className="tyre-search-box relative lg:flex-row flex-col flex items-end gap-5 justify-between w-full">
            <div className="tyre-type-area w-full relative  z-150">
              <div className="max-sm:flex-wrap tyre-type-top-filter-area flex w-full items-end justify-between gap-x-4 lg:gap-y-5 gap-y-4">
                <CustomSelect
                  label="Reifentyp"
                  value={category}
                  onChange={setCategory} // ⬅️ no cascading resets
                  className="categories-select"
                  options={sortAlphaAsc(data.categories || [])}
                  placeholder="Auswählen..."
                />

                <CustomSelect
                  label="Breite"
                  value={width}
                  onChange={setWidth}
                  className="brand-select"
                  options={sortNumericDesc(data.widths || [])}
                  placeholder="Auswählen..."
                />

                <CustomSelect
                  label="Höhe"
                  value={height}
                  onChange={setHeight}
                  className="height-select"
                  options={sortNumericDesc(data.heights || [])}
                  placeholder="Auswählen..."
                />

                <CustomSelect
                  label="Durchmesser (Zoll)"
                  value={diameter}
                  onChange={setDiameter}
                  options={sortNumericDesc(data.diameters || [])}
                  className="diameter-select"
                  placeholder="Auswählen..."
                />
              </div>

              {showMoreFilters && (
                <div className="tyre-type-bottom-filter-area w-full gap-x-4 lg:gap-y-5 gap-y-4 mt-4 md:mt-5 grid grid-cols-2 md:grid-cols-4">
                  <CustomSelect
                    label="Lastindex"
                    value={lastIndex}
                    onChange={setLastIndex}
                    options={sortNumericDesc(data.lastIndexes || [])}
                    placeholder="Auswählen..."
                    className="lastindex-select"
                  />

                  <CustomSelect
                    label="Nasshaftung"
                    value={wetGrip}
                    onChange={setWetGrip}
                    options={sortAlphaAsc(data.wetGrips || [])}
                    placeholder="Auswählen..."
                    className="wetgrid-select"
                  />

                  <CustomSelect
                    label="Kraftstoffeffizienz"
                    value={fuelClass}
                    onChange={setFuelClass}
                    options={sortAlphaAsc(data.fuelClasses || [])}
                    className="fuelclass-select"
                    placeholder="Auswählen..."
                  />

                  <CustomSelect
                    label="Rollgeräusch in dB"
                    value={noise}
                    onChange={setNoise}
                    options={sortNumericDesc(data.noises || [])}
                    className="noise-select"
                    placeholder="Auswählen..."
                  />
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="md:max-w-[170px] flex items-center justify-center md:gap-[10px] gap-2 max-w-[139px] md:text-[16px] text-[12px] font-medium font-primary text-left relative w-full border text-mono-0 bg-primary-100 rounded-[6px] hover:opacity-85 transition ease !border-primary-100 cursor-pointer py-2 px-3"
            >
              Reifen suchen{' '}
              <Image
                src="/images/icons/search-normal.svg"
                alt="suchen"
                loading="lazy"
                width={16}
                height={16}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowMoreFilters(prev => !prev)}
            className="filter-type-view-more-button cursor-pointer text-primary-100 mt-5 text-[14px] text-left font-secondary inline-block font-normal leading-[120%] z-90 lg:relative lg:bottom-0 lg:left-0 absolute bottom-20 left-0 max-sm:left-0"
          >
            {showMoreFilters ? 'Weniger Filter' : 'Weitere Filteroptionen'}
          </button>
        </div>
        <div className="tyre-model-image bottom-0 left-0 right-0 mx-auto absolute hidden md:flex flex-col items-center pl-0 justify-center">
          <div
            className={`tyre-filter-lists flex items-center pl-0 pt-1 justify-center gap-1 bg-transparent absolute h-9 max-w-42 rounded-tr-full rounded-tl-full w-full ${
              width && height && diameter
                ? '-rotate-28 -top-[32px]'
                : width && height && !diameter
                ? '-rotate-26 -top-[28px]'
                : width && !height && !diameter
                ? '-rotate-22 -top-[20px]'
                : !width && !height && !diameter
                ? '-rotate-29 -top-[28px]'
                : (width && height) || diameter
                ? '-rotate-28 -top-[34px]'
                : '-rotate-33 -top-[34px]'
            }`}
          >
            <div className="filter-item opacity-80 max-w-[47px] relative -top-1 width font-bold text-[20px] text-mono-0 font-secondary">
              {width || '*'}
            </div>
            <div className="filter-item relative top-0 opacity-80 slash font-bold text-[18px] text-mono-0 font-secondary">
              /
            </div>
            <div className="filter-item opacity-80 h-[33px] relative top-[7px] height font-bold text-[20px] text-mono-0 font-secondary">
              {height || '*'}
            </div>
            <div
              className={`filter-item relative opacity-80 h-[33px] diameter font-bold text-[20px] text-mono-0 font-secondary ${
                (width && height) || diameter ? 'top-[28px]' : 'top-[17px]'
              }`}
            >
              {diameter ? `R${diameter}` : '*'}
            </div>
          </div>

          <Image
            src="/images/wmremove-transformed.png"
            alt="Reifenmodell"
            fetchPriority="high"
            width={340}
            height={85}
            objectFit="cover"
          />
        </div>

        {/* <button
          className="cursor-pointer md:text-right max-w[235px] ml-auto text-center underline text-primary-100 mt-5 text-sm lg:text-[14px] font-secondary inline-block font-normal leading-[120%] z-50 lg:relative lg:bottom-0 lg:left-0 absolute md:bottom-10 bottom-6 md:left-5 left-0 right-0"
          onClick={() => openDialogById('tyre_size_modal')}
        >
          Wo finde ich die Reifen-Größen?
        </button> */}

        <dialog id="tyre_size_modal" className="modal">
          <div className="modal-box max-w-3xl bg-white">
            <form method="dialog">
              <button className="btn btn-sm btn-circle w-full max-w-10 min-w-10 h-full min-h-10 !border !border-1-[#16171a] max-h-10 btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            {/* Title */}
            <h3 className="font-bold text-lg mb-3" style={{ color: '#16171a' }}>
              Welche Reifengröße passt zu meinem Fahrzeug?
            </h3>
            <p className="first-text-desc text-sm">
              Die richtige Reifengröße für Ihren Reifenkauf bei reifen.com
              können Sie ganz einfach selbst ermitteln. Auf den an Ihrem
              Fahrzeug montierten Reifen stehen alle notwendigen Informationen,
              die Sie benötigen.
            </p>
            <Image
              src="/images/details-about-tyres-varient.jpg"
              alt="model image"
              width={981}
              height={597}
            />
            {/* Current dynamic selection */}
            <div className="mb-4 mt-6">
              <div className="text-sm mb-1" style={{ color: '#89898b' }}>
                Aktuelle Auswahl
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2 py-1 rounded bg-mono-100 text-sm font-medium"
                  style={{ color: '#ffffff' }}
                >
                  {width || '*'} / {height || '*'}{' '}
                  {diameter ? `R${diameter}` : 'R*'}
                </span>
                {lastIndex && (
                  <span
                    className="px-2 py-1 rounded bg-mono-100 text-sm font-medium"
                    style={{ color: '#ffffff' }}
                  >
                    LI {lastIndex}
                    {getLoadKg(lastIndex)
                      ? ` (${getLoadKg(lastIndex)} kg)`
                      : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Paragraph */}
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: '#89898b' }}
            >
              Die vollständige Reifengröße steht seitlich auf dem Reifen,
              z.&nbsp;B.{' '}
              <strong style={{ color: '#16171a' }}>205/55 R16 91H</strong>:
              <br />
              <span className="inline-block mt-1">
                <strong style={{ color: '#16171a' }}>205</strong> = Breite (mm)
                · <strong style={{ color: '#16171a' }}>55</strong> = Verhältnis
                Höhe/Breite (%) ·{' '}
                <strong style={{ color: '#16171a' }}>R16</strong> =
                Felgendurchmesser (Zoll) ·
                <strong style={{ color: '#16171a' }}> 91</strong> = Lastindex ·{' '}
                <strong style={{ color: '#16171a' }}>H</strong> =
                Geschwindigkeitsindex
              </span>
            </p>

            {/* Speed index list */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2" style={{ color: '#16171a' }}>
                Geschwindigkeitsindex (max. km/h)
              </h4>
              <div
                className="grid grid-cols-4 md:grid-cols-6 gap-2 text-sm"
                style={{ color: '#89898b' }}
              >
                {SPEED_INDEXES.map(({ code, kmh }) => (
                  <div
                    key={code}
                    className="border rounded px-2 py-1 flex items-center justify-between"
                    title={`Max. Geschwindigkeit: ${kmh} km/h`}
                  >
                    <span className="font-medium" style={{ color: '#16171a' }}>
                      {code}
                    </span>
                    <span className="opacity-70">{kmh}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: '#89898b' }}>
                Hinweis: Ein <em>höherer</em> Geschwindigkeitsindex als in den
                Fahrzeugpapieren angegeben ist zulässig.
              </p>
            </div>

            {/* Load index list with highlight */}
            <div className="mb-2">
              <h4 className="font-semibold mb-2" style={{ color: '#16171a' }}>
                Lastindex (zulässige Tragfähigkeit pro Reifen)
              </h4>
              <div
                className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm"
                style={{ color: '#89898b' }}
              >
                {Object.entries(LOAD_INDEX_KG).map(([idx, kg]) => {
                  const isActive = Number(lastIndex) === Number(idx);
                  return (
                    <div
                      key={idx}
                      className={`border rounded px-2 py-1 text-center ${
                        isActive
                          ? 'bg-primary-100 text-white border-primary-100'
                          : ''
                      }`}
                      style={!isActive ? { color: '#89898b' } : undefined}
                    >
                      <div
                        className="font-medium"
                        style={!isActive ? { color: '#16171a' } : undefined}
                      >
                        LI {idx}
                      </div>
                      <div className="opacity-80">{kg} kg</div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs mt-2" style={{ color: '#89898b' }}>
                Hinweis: Ein <em>höherer</em> Lastindex als gefordert ist
                ebenfalls zulässig.
              </p>
            </div>

            <div className="mt-4 text-xs" style={{ color: '#89898b' }}>
              Tipp: Sommer- und Winterreifen können unterschiedliche Größen
              haben. Prüfe die Reifenseitenwand der jeweiligen Saison.
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default FilterForm;