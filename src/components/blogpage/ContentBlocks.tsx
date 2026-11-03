import Link from 'next/link'
import type { ReactNode } from 'react'
import type { ContentBlock } from '@/libs/blogs/mongo'
import TyrePriceCalculator from '@/components/blogpage/TyrePriceCalculator'
import { headingId } from '@/libs/blogs/format'

/**
 * Inline links in blog text: "[205/55 R16 Reifen](/reifen/205-55-r16)".
 * Only internal paths ("/…") become links — no HTML is ever injected, so
 * blog text stays XSS-safe while articles can link to landing pages.
 */
function RichText({ text }: { text?: string }) {
  const value = text || ''
  const parts: ReactNode[] = []
  const rx = /\[([^\]]+)\]\((\/[^)\s]*)\)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = rx.exec(value))) {
    if (m.index > last) parts.push(value.slice(last, m.index))
    parts.push(
      <Link key={m.index} href={m[2]} className="text-primary-100 underline underline-offset-2">
        {m[1]}
      </Link>
    )
    last = m.index + m[0].length
  }
  if (last < value.length) parts.push(value.slice(last))
  return <>{parts}</>
}

function Heading({
  level,
  text,
}: {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text?: string
}) {
  const value = text || ''
  const className = 'text-[#16171A] font-semibold leading-[1.3] scroll-mt-28'
  switch (level) {
    case 'h1':
      // the page title is the h1 — an h1 inside the article renders as h2
      return <h2 id={headingId(value)} className={`${className} text-[24px] md:text-[28px] mt-10 mb-3`}>{value}</h2>
    case 'h2':
      return <h2 id={headingId(value)} className={`${className} text-[22px] md:text-[26px] mt-10 mb-3`}>{value}</h2>
    case 'h3':
      return <h3 className={`${className} text-[19px] md:text-[21px] mt-8 mb-2`}>{value}</h3>
    case 'h4':
      return <h4 className={`${className} text-[18px] mt-6 mb-2`}>{value}</h4>
    case 'h5':
      return <h5 className={`${className} text-[17px] mt-6 mb-2`}>{value}</h5>
    case 'h6':
      return <h6 className={`${className} text-[16px] mt-6 mb-2`}>{value}</h6>
    default:
      return <h3 className={`${className} text-[19px] md:text-[21px] mt-8 mb-2`}>{value}</h3>
  }
}

function Block({ block }: { block: ContentBlock }) {
  if (block.type === 'heading') {
    return <Heading level={block.level} text={block.text} />
  }

  if (block.type === 'widget') {
    if (block.widget === 'reifen-preisrechner') return <TyrePriceCalculator />
    return null
  }

  if (block.type === 'list') {
    const items = block.items || []
    const ListTag = block.style === 'ol' ? 'ol' : 'ul'
    const listClass =
      block.style === 'ol'
        ? 'article-list list-decimal pl-6 space-y-2 my-5 text-[#2B2D33] marker:text-primary-100 marker:font-semibold'
        : 'article-list list-disc pl-6 space-y-2 my-5 text-[#2B2D33] marker:text-primary-100'
    return (
      <ListTag className={listClass}>
        {items.map((item, i) => (
          <li key={i}>
            <RichText text={item} />
          </li>
        ))}
      </ListTag>
    )
  }

  return (
    <p className="article-p">
      <RichText text={block.text} />
    </p>
  )
}

export default function ContentBlocks({
  groups,
}: {
  groups?: ContentBlock[][]
}) {
  if (!Array.isArray(groups) || groups.length === 0) return null

  return (
    <div className="blog-details-content-block">
      {groups.map((group, gi) => (
        <div key={gi} className="mb-2">
          {(group || []).map((block, bi) => (
            <Block key={bi} block={block} />
          ))}
        </div>
      ))}
    </div>
  )
}
