'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGetTyreFiltersQuery } from '@/store/api/filterApi'
import CustomSelect from '@/components/elements/inputs/CustomCategorySelect'
import toast from 'react-hot-toast'

interface FilterOption {
  name: string
}

interface FilterResponse {
  kategories?: FilterOption[]
  widths?: FilterOption[]
  heights?: FilterOption[]
  diameters?: FilterOption[]
}

const DEFAULT_KATEGORIES: FilterOption[] = [
  { name: 'Sommerreifen' },
  { name: 'Winterreifen' },
  { name: 'Ganzjahresreifen' },
]

const DEFAULT_WIDTHS = ['195', '205', '215', '225', '235', '245'].map(name => ({
  name,
}))
const DEFAULT_HEIGHTS = ['40', '45', '50', '55', '60', '65'].map(name => ({
  name,
}))
const DEFAULT_DIAMETERS = ['15', '16', '17', '18', '19'].map(name => ({
  name,
}))

export default function BlogTyreCalculator() {
  const router = useRouter()
  const [kategorie, setKategorie] = useState('Sommerreifen')
  const [width, setWidth] = useState('205')
  const [height, setHeight] = useState('55')
  const [diameter, setDiameter] = useState('16')

  const { data = {} as FilterResponse } = useGetTyreFiltersQuery({
    kategorie,
    width,
    height,
    diameter,
    lastIndex: '',
    wetGrip: '',
    fuelClass: '',
    noise: '',
  })

  const kategories = data.kategories?.length
    ? data.kategories
    : DEFAULT_KATEGORIES
  const widths = data.widths?.length ? data.widths : DEFAULT_WIDTHS
  const heights = data.heights?.length ? data.heights : DEFAULT_HEIGHTS
  const diameters = data.diameters?.length ? data.diameters : DEFAULT_DIAMETERS

  const handleSearch = () => {
    if (!kategorie && !width && !height && !diameter) {
      toast.error('Bitte wählen Sie mindestens ein Filterfeld aus.')
      return
    }
    const params = new URLSearchParams()
    if (kategorie) params.set('kategorie', kategorie)
    if (width) params.set('width', width)
    if (height) params.set('height', height)
    if (diameter) params.set('diameter', diameter)
    router.push(`/produkte?${params.toString()}`)
  }

  return (
    <aside className="my-8 rounded-[10px] border border-border-100 bg-[#F7F8FA] p-5 md:p-6">
      <h2 className="text-[20px] md:text-[22px] font-semibold text-[#16171A] mb-1">
        Reifenrechner: Größe wählen, Modelle und Preise vergleichen
      </h2>
      <p className="text-[14px] text-[#404042] mb-5">
        Geben Sie Breite, Höhe und Felgendurchmesser ein – z.&nbsp;B.{' '}
        <strong>205/55 R16</strong>. Anschließend vergleichen Sie Marken,
        Modelle und Händlerpreise in Sekunden.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <CustomSelect
          label="Saison"
          options={kategories}
          value={kategorie}
          onChange={setKategorie}
          placeholder="Saison"
        />
        <CustomSelect
          label="Breite"
          options={widths}
          value={width}
          onChange={setWidth}
          placeholder="z. B. 205"
        />
        <CustomSelect
          label="Höhe"
          options={heights}
          value={height}
          onChange={setHeight}
          placeholder="z. B. 55"
        />
        <CustomSelect
          label="Zoll"
          options={diameters}
          value={diameter}
          onChange={setDiameter}
          placeholder="z. B. 16"
        />
      </div>
      <button
        type="button"
        onClick={handleSearch}
        className="mt-5 w-full md:w-auto rounded-full bg-primary-100 text-white font-semibold px-8 py-3 hover:bg-primary-90 transition"
      >
        Preise und Modelle vergleichen
      </button>
    </aside>
  )
}
