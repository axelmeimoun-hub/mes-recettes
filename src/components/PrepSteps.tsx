interface Props {
  steps: string[]
}

// Convention : une ligne qui commence par "#" est un intertitre.
// Le "#" (et les espaces qui suivent) ne sont pas affichés.
function isHeading(line: string): boolean {
  return line.trimStart().startsWith('#')
}

function headingText(line: string): string {
  return line.trimStart().replace(/^#+\s*/, '')
}

/** Étapes de préparation : intertitres (#) en sous-titres, étapes numérotées. */
export function PrepSteps({ steps }: Props) {
  if (steps.length === 0) return null

  let counter = 0
  return (
    <div className="space-y-4">
      {steps.map((line, i) => {
        if (isHeading(line)) {
          return (
            <h3
              key={i}
              className="pt-7 font-display text-lg font-semibold text-terracotta first:pt-0"
            >
              {headingText(line)}
            </h3>
          )
        }
        counter += 1
        const n = counter
        return (
          <div key={i} className="flex gap-4">
            <span className="tabular grid h-9 w-9 shrink-0 place-items-center rounded-full bg-terracotta/15 font-display text-lg font-semibold text-terracotta">
              {n}
            </span>
            <p className="pt-1 leading-relaxed">{line}</p>
          </div>
        )
      })}
    </div>
  )
}
