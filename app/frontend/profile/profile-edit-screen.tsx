import { useMutation } from "@apollo/client/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"
import { gql } from "~/__generated__"
import { useViewer } from "~/auth/use-viewer"
import { useFormErrorHandling } from "~/common/error-handling"
import { rootPath, profilePath } from "~/common/paths"
import { TablePageLayout } from "~/layouts/table-page-layout"
import { Button } from "~/ui/button"
import { Form } from "~/ui/form"
import { TextField } from "~/ui/forms/fields/text-field"
import { FormGeneralErrors } from "~/ui/forms/form-general-errors"
import { Section } from "~/ui/section"
import { AvatarUpload } from "./avatar-upload"

const mutation = gql(/* GraphQL */ `
  mutation UpdateProfile($input: ViewerUpdateInput!) {
    viewerUpdate(input: $input) {
      user {
        id
        firstName
        lastName
        ...CachedViewerContext
      }
    }
  }
`)

export const ProfileEditScreen = () => {
  const navigate = useNavigate()

  const { viewer } = useViewer()

  const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: viewer.firstName ?? "",
      lastName: viewer.lastName ?? "",
      email: viewer.email ?? "",
    },
  })

  const { onError } = useFormErrorHandling(form)
  const [exec] = useMutation(mutation, { onError: () => null })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await exec({
      onError,
      variables: {
        input: {
          viewerInput: {
            firstName: values.firstName,
            lastName: values.lastName,
          },
        },
      },
    })

    if (result.error) return

    toast.success("Profile Updated", {
      description: "Your profile has been successfully updated.",
    })
    navigate(rootPath.pattern)
  }

  return (
    <TablePageLayout>
      <Link to={profilePath({})}>
        &larr; <span className="align-text-bottom text-xs font-bold uppercase">Back</span>
      </Link>
      <div className="flex flex-1 flex-col">
        <div className="bottom-1 mb-4 flex items-center justify-between border-b py-4">
          <h1 className="text-2xl">Edit Details</h1>
          {/* <LinkButton to={}>Update Password</LinkButton> */}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormGeneralErrors control={form.control} className="mb-4" />

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-8">
                <Section variant="grayBackground" className="space-y-4 p-0">
                  <TextField control={form.control} name="firstName" label="First Name" required />
                  <TextField control={form.control} name="lastName" label="Last Name" required />
                  <TextField control={form.control} name="email" label="Email address" disabled />
                </Section>
              </div>
              <div>
                <div className="rounded border p-8 pr-12">
                  <AvatarUpload />
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 border-t pt-10">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save &amp; Update
              </Button>
              <Link to={profilePath({})} className="text-sm text-neutral-400">
                Close &amp; Cancel
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </TablePageLayout>
  )
}
