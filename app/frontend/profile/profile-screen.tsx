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
import Text from "~/ui/typography"
import { useToast } from "~/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { rootPath } from "~/common/paths"

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

export const ProfileScreen = () => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const { viewer } = useViewer()

  const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      firstName: viewer.firstName ?? "",
      lastName: viewer.lastName ?? "",
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
            ...values,
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
      <div className="flex flex-1 flex-col">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-[330px,650px] gap-8">
              <div>
                <Text variant="default" className="mb-4">
                  Profile picture
                </Text>
              </div>
              <div className="space-y-8">
                <Section variant="grayBackground" className="space-y-4">
                  <div>
                    <Text className="text-foreground">*</Text> <Text>Required Fields</Text>
                  </div>

                  <TextField control={form.control} name="firstName" label="First Name*" required />
                  <TextField control={form.control} name="lastName" label="Last Name*" required />
                </Section>

                <div className="border-gray-d0 mt-4 space-y-4 border-t pt-10">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="block w-full"
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </TablePageLayout>
  )
}
