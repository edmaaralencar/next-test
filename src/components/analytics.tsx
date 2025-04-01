'use client'

import { CheckCircle2, Clock, ListChecks, ListTodo } from 'lucide-react'

import { TaskWithSubTask } from '@/app/page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from '@/components/ui/chart'

interface AnalyticsProps {
  tasks: TaskWithSubTask[]
}

export function Analytics({ tasks }: AnalyticsProps) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(
    (task) => task.status === 'Completo',
  ).length
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'Em Progresso',
  ).length
  const todoTasks = tasks.filter((task) => task.status === 'Para Fazer').length

  const totalSubtasks = tasks.reduce(
    (acc, task) => acc + task.subTasks.length,
    0,
  )
  const completedSubtasks = tasks.reduce(
    (acc, task) =>
      acc + task.subTasks.filter((subtask) => subtask.isCompleted).length,
    0,
  )

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === 'Alta',
  ).length
  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === 'Média',
  ).length
  const lowPriorityTasks = tasks.filter(
    (task) => task.priority === 'Baixa',
  ).length

  const statusData = [
    { name: 'Para Fazer', value: todoTasks },
    { name: 'Em Progresso', value: inProgressTasks },
    { name: 'Completo', value: completedTasks },
  ].filter((item) => item.value > 0)

  const priorityData = [
    { name: 'Alta', value: highPriorityTasks },
    { name: 'Média', value: mediumPriorityTasks },
    { name: 'Baixa', value: lowPriorityTasks },
  ]

  const STATUS_COLORS = {
    'Para Fazer': '#f97316',
    'Em Progresso': '#3b82f6',
    Completo: '#22c55e',
  }

  const PRIORITY_COLORS = {
    Alta: '#ef4444',
    Média: '#f59e0b',
    Baixa: '#10b981',
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Total de Tarefas
            </CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Todas as tarefas no seu ambiente
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Completas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedTasks}
              <span className="text-sm text-muted-foreground ml-2">
                {totalTasks > 0
                  ? `(${Math.round((completedTasks / totalTasks) * 100)}%)`
                  : '(0%)'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tarefas marcadas como completa
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inProgressTasks}
              <span className="text-sm text-muted-foreground ml-2">
                {totalTasks > 0
                  ? `(${Math.round((inProgressTasks / totalTasks) * 100)}%)`
                  : '(0%)'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tarefas atualmente em progresso
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Subtarefas</CardTitle>
            <ListChecks className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedSubtasks}/{totalSubtasks}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Subtarefas completadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Tarefas distribuídas pelo Status</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] w-full p-4">
              {totalTasks > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      animationDuration={800}
                      animationBegin={0}
                    >
                      {statusData.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={
                            STATUS_COLORS[
                              entry.name as keyof typeof STATUS_COLORS
                            ]
                          }
                          stroke="transparent"
                          className="transition-all hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      iconSize={10}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <ListTodo className="h-8 w-8 text-muted-foreground/50" />
                    <p>Sem dados disponíveis.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Tarefas distribuídas pela Prioridade</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full p-4">
              {totalTasks > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={priorityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={8}
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      iconSize={10}
                    />
                    <Bar
                      dataKey="value"
                      name="Tarefas"
                      radius={[4, 4, 0, 0]}
                      animationDuration={1200}
                      animationBegin={0}
                    >
                      {priorityData.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={
                            PRIORITY_COLORS[
                              entry.name as keyof typeof PRIORITY_COLORS
                            ]
                          }
                          className="transition-all hover:opacity-80"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <ListTodo className="h-8 w-8 text-muted-foreground/50" />
                    <p>Sem dado disponível.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
