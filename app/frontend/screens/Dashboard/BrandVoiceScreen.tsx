import { useMutation, useQuery } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { gql } from "~/__generated__"
import { useFormErrorHandling } from "~/common/error-handling"
import { useDocumentTitle } from "~/common/use-document-title"
import { Button } from "~/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/ui/form"
import { FormGeneralErrors } from "~/ui/forms/form-general-errors"
import { GraphqlError } from "~/ui/graphql-error"
import { Input } from "~/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/ui/select"
import { Skeleton } from "~/ui/skeleton"
import { Textarea } from "~/ui/textarea"

const BRAND_VOICE_SETTINGS_QUERY = gql(/* GraphQL */ `
  query BrandVoiceSettings {
    viewer {
      id
      organization {
        id
        brandVoiceGuidelines
      }
    }
  }
`)

const UPDATE_BRAND_VOICE_MUTATION = gql(/* GraphQL */ `
  mutation UpdateBrandVoice($input: OrganizationUpdateBrandVoiceInput!) {
    organizationUpdateBrandVoice(input: $input) {
      organization {
        id
        brandVoiceGuidelines
      }
    }
  }
`)

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "casual", label: "Casual" },
  { value: "authoritative", label: "Authoritative" },
  { value: "inspirational", label: "Inspirational" },
  { value: "educational", label: "Educational" },
  { value: "playful", label: "Playful" },
  { value: "empathetic", label: "Empathetic" },
]

type BrandVoiceData = {
  tone?: string
  messagingPillars?: string[]
  wordsToAvoid?: string[]
  approvedHashtagSets?: string[]
}

const parseGuidelines = (raw: string | null | undefined): BrandVoiceData => {
  if (!raw) return {}
  try {
    return JSON.parse(raw) as BrandVoiceData
  } catch {
    return {}
  }
}

const toLines = (arr: string[] | undefined): string => (arr ?? []).join("\n")

const fromLines = (text: string): string[] =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)

const toCommaSeparated = (arr: string[] | undefined): string => (arr ?? []).join(", ")

const fromCommaSeparated = (text: string): string[] =>
  text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)

const formSchema = z.object({
  tone: z.string(),
  messagingPillars: z.string(),
  wordsToAvoid: z.string(),
  approvedHashtagSets: z.string(),
})

export const BrandVoiceScreen = () => {
  useDocumentTitle("Brand Voice Settings")

  const { data, loading, error } = useQuery(BRAND_VOICE_SETTINGS_QUERY)
  const [exec] = useMutation(UPDATE_BRAND_VOICE_MUTATION, { onError: () => null })

  const guidelines = parseGuidelines(data?.viewer?.organization?.brandVoiceGuidelines)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      tone: guidelines.tone ?? "",
      messagingPillars: toLines(guidelines.messagingPillars),
      wordsToAvoid: toCommaSeparated(guidelines.wordsToAvoid),
      approvedHashtagSets: toCommaSeparated(guidelines.approvedHashtagSets),
    },
  })

  const { onError } = useFormErrorHandling(form)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await exec({
      onError,
      variables: {
        input: {
          brandVoiceInput: {
            tone: values.tone || null,
            messagingPillars: fromLines(values.messagingPillars),
            wordsToAvoid: fromCommaSeparated(values.wordsToAvoid),
            approvedHashtagSets: fromCommaSeparated(values.approvedHashtagSets),
          },
        },
      },
    })

    if (result.error) return

    toast.success("Brand voice settings saved")
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <GraphqlError error={error} />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Brand Voice</h1>
        <p className="text-muted-foreground">
          Define how your brand communicates across social channels.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Voice Settings</CardTitle>
          <CardDescription>
            These settings guide AI-generated content to match your brand&apos;s tone and style.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormGeneralErrors control={form.control} />

              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || undefined}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone…" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TONE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="messagingPillars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Messaging Pillars</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter each pillar on a new line…"
                        className="min-h-[100px] resize-none"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">One pillar per line.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wordsToAvoid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Words to Avoid</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="spam, cheap, limited time offer" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Comma-separated words or phrases to exclude from your content.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="approvedHashtagSets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Approved Hashtag Sets</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="#tech #innovation, #sustainability #green" />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Comma-separated sets of hashtags approved for use in posts.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving…" : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
