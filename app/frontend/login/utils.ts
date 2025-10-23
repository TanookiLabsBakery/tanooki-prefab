export const updateCsrfTag = (csrfToken: string) => {
  const metaTag = document.querySelector('meta[name="csrf-token"]')
  if (metaTag) {
    metaTag.setAttribute("content", csrfToken)
  } else {
    console.warn("attempted to update CSRF but did not find a meta tag")
  }
}
