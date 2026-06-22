import { useQuery } from "@apollo/client/react"
import { CheckCircle2, FileImage } from "lucide-react"
import { gql } from "~/__generated__"
import { cn } from "~/common/cn"
import { Button } from "~/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog"
import { GraphqlError } from "~/ui/graphql-error"
import { Uploader } from "./Uploader"

const MEDIA_ASSETS_QUERY = gql(/* GraphQL */ `
  query MediaAssets {
    viewer {
      id
      mediaAssets {
        id
        url
        filename
        contentType
        createdAt
      }
    }
  }
`)

export type MediaAssetItem = {
  id: string
  url: string | null | undefined
  filename: string
  contentType: string | null | undefined
}

type Props = {
  selectedId?: string | null
  onSelect: (asset: MediaAssetItem) => void
  children: React.ReactNode
}

export const MediaLibrary = ({ selectedId, onSelect, children }: Props) => {
  const { data, loading, error, refetch } = useQuery(MEDIA_ASSETS_QUERY)

  const assets = data?.viewer?.mediaAssets ?? []

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>
            Upload images and videos, then select one to attach to your post.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end">
          <Uploader onUploaded={() => refetch()} />
        </div>

        {error && <GraphqlError error={error} />}

        {loading && (
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-md bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!loading && assets.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
            <FileImage className="h-10 w-10" />
            <p className="text-sm">No media uploaded yet. Upload your first file above.</p>
          </div>
        )}

        {!loading && assets.length > 0 && (
          <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto pr-1">
            {assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-md border-2 bg-muted transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  selectedId === asset.id
                    ? "border-primary"
                    : "border-transparent hover:border-muted-foreground/40"
                )}
                onClick={() =>
                  onSelect({
                    id: asset.id,
                    url: asset.url,
                    filename: asset.filename,
                    contentType: asset.contentType,
                  })
                }
                title={asset.filename}
              >
                {asset.url ? (
                  <img
                    src={asset.url}
                    alt={asset.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileImage className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                {selectedId === asset.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {selectedId && (
          <div className="flex justify-end border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onSelect({
                  id: "",
                  url: null,
                  filename: "",
                  contentType: null,
                })
              }
            >
              Clear selection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
