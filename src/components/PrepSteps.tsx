interface Props {
  steps: string[]
}

// Une ligne courte sans ponctuation de phrase est traitée comme un intertitre
// (ex: "Café", "Crème", "Assemblage") plutôt que comme une étape numérotée.
function isHeading(line: string): boolean {
  const words = line.split(/\s+/).length
  const hasSentencePunct = /[.!?:,;]/.test(line)
  return words <= 2 && !hasSentencePunct
}

/** Étapes de préparation : intertitres en sous-titres, étapes numérotées. */
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
              className="pt-2 font-display text-lg font-semibold text-terracotta first:pt-0"
            >
              {line}
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
