import { useViewer } from "~/auth/use-viewer"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { gql } from "~/__generated__"
import { Section } from "~/ui/section"
import { useSafeMutation } from "~/common/use-safe-mutation"
import { useValidationErrors } from "~/common/use-validation-errors"
import { TextField } from "~/fields/text-field"
import { TablePageLayout } from "~/layouts/table-page-layout"
import { Button } from "~/ui/button"
import { Form } from "~/ui/form"
import { useToast } from "~/ui/use-toast"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { rootPath, profilePath } from "~/common/paths"
import { AvatarUpload } from "./avatar-upload"

const mutation = gql(/* GraphQL */ `
  mutation UpdateProfile($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      user {
        id
        firstName
        lastName
      }
    }
  }
`)

export const ProfileEditScreen = () => {
  const { toast } = useToast()
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

  const [exec, mutationResult] = useSafeMutation(mutation)
  useValidationErrors(form.setError, mutationResult)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const result = await exec({
      variables: {
        input: {
          id: viewer.id,
          userInput: {
            firstName: values.firstName,
            lastName: values.lastName,
          },
        },
      },
    })

    if (!result.errors) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      navigate(rootPath({}))
    }
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
                  <AvatarUpload userId={viewer.id} />
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
              {/* <div className="flex flex-1 justify-end">
                <Link to={profilePath({})} className="text-sm text-neutral-400">
                  Request account removal
                </Link>
              </div> */}
            </div>
          </form>
        </Form>
      </div>
    </TablePageLayout>
  )
}
