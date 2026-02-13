import { DirectUpload } from "@rails/activestorage"
import { Blob } from "rails__activestorage"
import invariant from "tiny-invariant"
import { AppConfig } from "./app-config"

export const directImageUpload = async (image: FileList[number]): Promise<any> => {
  const data = await uploadFile(image)
  return { signedId: data.signed_id }
}

const directUploadsUrl = AppConfig.direct_uploads_url

const uploadFile = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const upload = new DirectUpload(file, directUploadsUrl)

    upload.create((error, blob) => {
      if (error) {
        reject(error)
      } else if (blob) {
        resolve(blob)
      } else {
        invariant("expected error or blob")
      }
    })
  })
}
