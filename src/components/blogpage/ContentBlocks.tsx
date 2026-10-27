import type { ContentBlock } from '@/libs/blogs/mongo'

function Heading({
  level,
  text,
}: {
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  text?: string
}) {
  const value = text || ''
  const className = 'text-[#16171A] font-semibold mt-8 mb-3'
  switch (level) {
    case 'h1':
      return <h1 className={`${className} text-[28px]`}>{value}</h1>
    case 'h2':
      return <h2 className={`${className} text-[24px]`}>{value}</h2>
    case 'h3':
      return <h3 className={`${className} text-[22px]`}>{value}</h3>
    case 'h4':
      return <h4 className={`${className} text-[20px]`}>{value}</h4>
    case 'h5':
      return <h5 className={`${className} text-[18px]`}>{value}</h5>
    case 'h6':
      return <h6 className={`${className} text-[16px]`}>{value}</h6>
    default:
      return <h3 className={`${className} text-[22px]`}>{value}</h3>
  }
}

function Block({ block }: { block: ContentBlock }) {
  if (block.type === 'heading') {
    return <Heading level={block.level} text={block.text} />
  }

  if (block.type === 'list') {
    const items = block.items || []
    const ListTag = block.style === 'ol' ? 'ol' : 'ul'
    const listClass =
      block.style === 'ol'
        ? 'list-decimal pl-6 space-y-2 my-4 text-[#16171A]'
        : 'list-disc pl-6 space-y-2 my-4 text-[#16171A]'
    return (
      <ListTag className={listClass}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ListTag>
    )
  }

  return (
    <p className="text-[#16171A] text-[16px] leading-[150%] mb-4">
      {block.text}
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
