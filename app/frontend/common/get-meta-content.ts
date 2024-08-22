import invariant from "tiny-invariant"

export const getMetaContentMaybe = (name: string): string | null => {
  const metaTag = document.querySelector(`meta[name=${name}]`)
  const content = metaTag?.getAttribute("content") ?? null
  return content
}

export const getMetaContent = (name: string) => {
  const content = getMetaContentMaybe(name)
  invariant(content)

  return content
}
