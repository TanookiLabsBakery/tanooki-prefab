import { Activity, Clock, Users, Zap } from "lucide-react"
import { useViewer } from "~/auth/use-viewer"
import { useDocumentTitle } from "~/common/use-document-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/ui/card"

const stats = [
  { title: "Active Users", value: "0", description: "Total registered users", icon: Users },
  { title: "Sessions", value: "0", description: "Active sessions today", icon: Activity },
  { title: "Uptime", value: "100%", description: "System availability", icon: Clock },
  { title: "Performance", value: "Fast", description: "Average response time", icon: Zap },
]

export const DashboardScreen = () => {
  const { viewer } = useViewer()
  useDocumentTitle("Dashboard")

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {viewer.firstName}</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your application.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <CardDescription>{stat.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and events.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No activity yet. Start building your application to see activity here.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Customize this dashboard to show the actions most relevant to your users.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
