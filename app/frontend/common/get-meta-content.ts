import invariant from "tiny-invariant"

export const getMetaContentMaybe = (name: string) => {
  const metaTag = document.querySelector(`meta[name=${name}]`)
  invariant(metaTag, `missing ${name} meta tag`)
  const content = metaTag.getAttribute("content")

  return content
}

export const getMetaContent = (name: string) => {
  const content = getMetaContentMaybe(name)
  invariant(content)

  return content
}
