import { Card, CardContent, CardHeader, CardTitle } from "~/ui/card"

type Props = {
  label: string
  value: number
  icon: React.ReactNode
}

export const StatsCard = ({ label, value, icon }: Props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <span className="text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  )
}
