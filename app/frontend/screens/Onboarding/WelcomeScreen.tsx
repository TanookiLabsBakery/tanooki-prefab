import { useViewer } from "~/auth/use-viewer"
import { useDocumentTitle } from "~/common/use-document-title"
import { OnboardingWizard } from "~/components/Onboarding/OnboardingWizard"

export const WelcomeScreen = () => {
  const { viewer } = useViewer()
  useDocumentTitle("Welcome")

  return <OnboardingWizard firstName={viewer.firstName} />
}
