import React, { useCallback, useRef, useState } from "react"
import { gql } from "~/__generated__"
import { useViewer } from "~/auth/use-viewer"
import { directImageUpload } from "~/common/direct-image-upload"
import { useSafeMutation } from "~/common/use-safe-mutation"
import { Button } from "~/ui/button"
import { useToast } from "~/ui/use-toast"
import { UserAvatar } from "~/users/user-avatar"

const viewerUpdateAvatarMutation = gql(/* GraphQL */ `
  mutation ViewerUpdate($input: ViewerUpdateInput!) {
    viewerUpdate(input: $input) {
      user {
        id
        avatarThumbUrl
      }
    }
  }
`)

export const AvatarUpload = () => {
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { viewer } = useViewer()
  const { toast } = useToast()

  const [runViewerUpdate] = useSafeMutation(viewerUpdateAvatarMutation)

  const onFileSelect = useCallback(
    async (file: File) => {
      setIsSaving(true)

      const { signedId } = await directImageUpload(file)

      const { errors } = await runViewerUpdate({
        variables: {
          input: {
            viewerInput: {},
            avatarSignedId: signedId,
          },
        },
      })

      if (errors) {
        toast({
          title: "Failed to save avatar",
          variant: "destructive",
        })
      }

      setIsSaving(false)
    },
    [runViewerUpdate, toast]
  )

  const removeAvatar = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    try {
      const { errors } = await runViewerUpdate({
        variables: {
          input: {
            viewerInput: {},
            removeAvatar: true,
          },
        },
      })

      if (errors) {
        toast({
          title: "Failed to remove avatar",
          variant: "destructive",
        })
      }
    } catch {
      toast({
        title: "Error removing avatar",
        variant: "destructive",
      })
    }
  }

  const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const cta = viewer.avatarThumbUrl ? "Change Photo" : "Choose Photo"

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg, image/png"
        onChange={(event) => {
          if (event.target.files && event.target.files.length > 0) {
            onFileSelect(event.target.files[0])
          }
        }}
      />
      <div className="flex items-center gap-5">
        <UserAvatar user={viewer} className="h-24 w-24" />
        <Button onClick={onClick}>{isSaving ? "Saving …" : cta}</Button>
        <span className="flex-1" />
        {viewer.avatarThumbUrl && (
          <button className="text-xs text-destructive" onClick={removeAvatar}>
            Remove
          </button>
        )}
      </div>
    </>
  )
}
