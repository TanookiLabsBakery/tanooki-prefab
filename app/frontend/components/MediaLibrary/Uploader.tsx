import { useMutation } from "@apollo/client/react"
import { ImagePlus, Loader2 } from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { gql } from "~/__generated__"
import { directImageUpload } from "~/common/direct-image-upload"
import { Button } from "~/ui/button"

const MEDIA_ASSET_CREATE_MUTATION = gql(/* GraphQL */ `
  mutation MediaAssetCreate($input: MediaAssetCreateInput!) {
    mediaAssetCreate(input: $input) {
      mediaAsset {
        id
        url
        filename
        contentType
        createdAt
      }
    }
  }
`)

type Props = {
  onUploaded: () => void
}

export const Uploader = ({ onUploaded }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [mediaAssetCreate] = useMutation(MEDIA_ASSET_CREATE_MUTATION, { onError: () => null })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const { signedId } = await directImageUpload(file)

      const result = await mediaAssetCreate({
        variables: { input: { signedId } },
      })

      if (result.error || !result.data) {
        toast.error("Upload failed", { description: "Could not save the file. Please try again." })
        return
      }

      onUploaded()
    } catch {
      toast.error("Upload failed", { description: "Could not upload the file. Please try again." })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ImagePlus className="mr-2 h-4 w-4" />
        )}
        {uploading ? "Uploading…" : "Upload"}
      </Button>
    </div>
  )
}
