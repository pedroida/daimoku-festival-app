import { CalendarDays, Clock,Eye, Users } from "lucide-react"
import { useEffect, useState } from 'react'
import { Bar, BarChart,CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { toast } from 'sonner'

import { AppHeader } from '~/components/common/Header'
import { RegisterDaimokuModal } from "~/components/common/RegisterDaimokuModal"
import { ButtonComponent } from '~/components/ui/button/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart/chart"
import { Checkbox } from '~/components/ui/checkbox/Checkbox'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '~/components/ui/context-menu/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog/Dialog'
import { Divider } from '~/components/ui/divider/Divider'
import { Input } from '~/components/ui/input/Input'
import { Label } from '~/components/ui/label/Label'
import { BasePrompt, Modal } from '~/components/ui/modal'
import { Progress } from "~/components/ui/progress/progress"
import { SegmentTab } from '~/components/ui/segment-tab/SegmentTab'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select/Select'
import { Slider } from '~/components/ui/slider/Slider'
import { Switch } from '~/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip/Tooltip'

  // Simulated data for daily practice (October 2025 - April 2026)
  const generateDailyData = () => {
    const data: any[] = []
    const startDate = new Date(2025, 9, 1) // October 1, 2025
    const endDate = new Date(2026, 3, 30) // April 30, 2026
  
    const currentDate = new Date(startDate)
    let cumulativeHours = 0
  
    while (currentDate <= endDate) {
      const dailyHours = Math.random() * 200 + 50 // Random hours between 50-250
      cumulativeHours += dailyHours
  
      data.push({
        date: currentDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }),
        hours: Math.round(dailyHours),
        cumulative: Math.round(cumulativeHours),
      })
  
      currentDate.setDate(currentDate.getDate() + 1)
    }
  
    return data
  }
  
  const dailyData = generateDailyData()
  
  // Current progress (simulated)
  const objectives = [
    {
      title: "Horas de Daimoku",
      current: dailyData.at(-1).cumulative,
      target: 30000,
      icon: Clock,
      color: "hsl(var(--chart-4))",
    },
    {
      title: "Objetivos do Festival",
      current: 127,
      target: 150,
      icon: CalendarDays,
      color: "hsl(var(--chart-1))",
    },
    {
      title: "Figurantes e Apoios",
      current: 245,
      target: 300,
      icon: Users,
      color: "hsl(var(--chart-2))",
    },
    {
      title: "Espectadores",
      current: 198,
      target: 300,
      icon: Eye,
      color: "hsl(var(--chart-3))",
    },
  ]
  
  // Weekly summary for bar chart
  const weeklyData = [
    { week: "Sem 1", hours: 1250 },
    { week: "Sem 2", hours: 1420 },
    { week: "Sem 3", hours: 1680 },
    { week: "Sem 4", hours: 1890 },
    { week: "Sem 5", hours: 1560 },
    { week: "Sem 6", hours: 1730 },
  ]

export const Component = () => {
  const [starCount, setStarCount] = useState(42)
  const [isStarred, setIsStarred] = useState(false)
  const [likesCount, setLikesCount] = useState(127)
  const [isLiked, setIsLiked] = useState(false)
  const [showNotifications, setShowNotifications] = useState(true)
  const [autoSave, setAutoSave] = useState(false)

  const [enableSound, setEnableSound] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isRegisterDaimokuModalOpen, setIsRegisterDaimokuModalOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const targetDate = new Date(2026, 3, 30, 23, 59, 59) // April 30, 2026, 23:59:59
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 1000)

    return () => clearInterval(interval)
  }, [])


  const handleStar = () => {
    setIsStarred(!isStarred)
    setStarCount((prev) => (isStarred ? prev - 1 : prev + 1))
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleContextAction = (_action: string) => {
    // You can add actual functionality here
  }

  const handlePromptDemo = () => {
    Modal.present(BasePrompt, {
      title: 'Delete Item',
      description:
        'This action cannot be undone. Are you sure you want to delete this item?',
      variant: 'danger',
      onConfirmText: 'Delete',
      onCancelText: 'Cancel',
      onConfirm: () => {
        toast.success('Item deleted!')
      },
      onCancel: () => {
        toast.error('Delete cancelled')
      },
    })
  }

  const tabItems = [
    {
      value: 'overview',
      label: 'Overview',
      icon: <i className="i-mingcute-home-4-line w-4 h-4" />,
    },
    {
      value: 'components',
      label: 'Components',
      icon: <i className="i-mingcute-grid-line w-4 h-4" />,
    },
    {
      value: 'settings',
      label: 'Settings',
      icon: <i className="i-mingcute-settings-3-line w-4 h-4" />,
    },
  ]

  return (
    <div className="min-h-screen transition-colors bg-background text-text">
      {/* Navigation */}
      <AppHeader />

      <div className="max-w-6xl mx-auto px-6">
      <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Gráfico de Daimoku</h1>
          <p className="text-muted-foreground">01 de outubro de 2025 a 30 de abril de 2026</p>
          <p className="text-sm text-muted-foreground italic">Esperança - O ritmo que rege a sinfonia para a paz</p>
        </div>

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tempo até o Festival</CardTitle>
            <CardDescription>Contagem regressiva para o encerramento do período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-4 shadow-sm">
                <div className="text-4xl font-bold text-primary">{timeRemaining.days}</div>
                <div className="text-sm text-muted-foreground">Dias</div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-4 shadow-sm">
                <div className="text-4xl font-bold text-primary">{timeRemaining.hours}</div>
                <div className="text-sm text-muted-foreground">Horas</div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-4 shadow-sm">
                <div className="text-4xl font-bold text-primary">{timeRemaining.minutes}</div>
                <div className="text-sm text-muted-foreground">Minutos</div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-4 shadow-sm">
                <div className="text-4xl font-bold text-primary">{timeRemaining.seconds}</div>
                <div className="text-sm text-muted-foreground">Segundos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectives Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {objectives.map((objective) => {
            const Icon = objective.icon
            const percentage = Math.round((objective.current / objective.target) * 100)

            return (
              <Card key={objective.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{objective.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{objective.current.toLocaleString("pt-BR")}</div>
                    <p className="text-xs text-muted-foreground">
                      de {objective.target.toLocaleString("pt-BR")} ({percentage}%)
                    </p>
                    <Progress
                      value={percentage}
                      className="h-2"
                      style={{
                        // @ts-ignore
                        "--progress-background": objective.color,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center w-full">
          <ButtonComponent variant="primary" className="w-full h-12" onClick={() => setIsRegisterDaimokuModalOpen(true)}>
            Registrar Daimoku
          </ButtonComponent>
          <RegisterDaimokuModal
            isOpen={isRegisterDaimokuModalOpen}
            setIsOpen={setIsRegisterDaimokuModalOpen}
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Cumulative Hours Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Progresso Acumulado</CardTitle>
              <CardDescription>Horas de Daimoku ao longo do período</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  cumulative: {
                    label: "Horas Acumuladas",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData.filter((_, i) => i % 7 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <ChartTooltip content={<ChartTooltipContent payload={dailyData.filter((_, i) => i % 7 === 0)} label="Horas Acumuladas" />} />
                    <Line
                      type="monotone"
                      dataKey="cumulative"
                      stroke="var(--color-cumulative)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weekly Hours Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Horas Semanais</CardTitle>
              <CardDescription>Distribuição de horas por semana</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  hours: {
                    label: "Horas",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                    <ChartTooltip content={<ChartTooltipContent payload={weeklyData} label="Horas" />} />
                    <Bar dataKey="hours" fill="var(--color-hours)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Objetivo Individual</CardTitle>
            <CardDescription>
              1 hora diária de Daimoku - Nam-myoho-renge-kyo como base para minha vitória pessoal e o total sucesso do
              Festival
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dias Completos</p>
                <p className="text-2xl font-bold">142</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Média Diária</p>
                <p className="text-2xl font-bold">
                  {Math.round(dailyData.at(-1).cumulative / dailyData.length)} horas
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Dias Restantes</p>
                <p className="text-2xl font-bold">{Math.max(0, 213 - dailyData.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

        {/* Interactive Demo */}
        <section className="py-16 border-t border-border">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-text mb-4">
              Interactive Components
            </h2>
            <p className="text-text-secondary">
              Try out the included UI components - from basic forms to advanced
              interactions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="p-8 border border-border rounded-xl bg-material-thin">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Button Examples */}
                <div>
                  <h3 className="font-medium text-text mb-4">
                    Button Variants
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <ButtonComponent variant="primary">Primary</ButtonComponent>
                      <ButtonComponent variant="secondary">Secondary</ButtonComponent>
                      <ButtonComponent variant="ghost">Ghost</ButtonComponent>
                    </div>
                    <div className="flex gap-3">
                      <ButtonComponent variant="primary" isLoading>
                        Loading
                      </ButtonComponent>
                      <ButtonComponent variant="destructive">Destructive</ButtonComponent>
                    </div>
                  </div>
                </div>

                {/* Interactive Elements */}
                <div>
                  <h3 className="font-medium text-text mb-4">
                    Interactive Elements
                  </h3>
                  <div className="flex items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger>
                        <button
                          type="button"
                          onClick={handleStar}
                          className={`
                            p-2 border border-border rounded-lg transition-all size-10
                            ${
                              isStarred
                                ? 'bg-yellow/10 border-yellow text-yellow'
                                : 'hover:border-border/70 text-placeholder-text hover:text-text bg-fill'
                            }
                          `}
                        >
                          <i
                            className={`i-mingcute-star-line w-4 h-4 ${isStarred ? 'text-yellow-400' : ''}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>
                          <span>{isStarred ? 'Unstar' : 'Star'}</span>{' '}
                          <span>({starCount})</span>
                        </span>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={handleLike}
                          className={`
                            p-2 border border-border rounded-lg transition-all size-10
                            ${
                              isLiked
                                ? 'bg-red/10 border-red text-red'
                                : 'hover:border-border/70 text-placeholder-text hover:text-text bg-fill'
                            }
                          `}
                        >
                          <i
                            className={`i-mingcute-heart-line w-4 h-4 ${isLiked ? 'text-red-400' : ''}`}
                          />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>
                          <span>{isLiked ? 'Unlike' : 'Like'}</span>{' '}
                          <span>({likesCount})</span>
                        </span>
                      </TooltipContent>
                    </Tooltip>

                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          'https://github.com/innei-template/smart-webapp-template',
                          '_blank',
                        )
                      }
                      className="p-2 border size-10 border-border rounded-lg hover:border-border/70 text-placeholder-text hover:text-text transition-all bg-fill hover:bg-fill-secondary"
                    >
                      <i className="i-mingcute-github-line w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Components */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-medium text-text mb-4">Form Components</h3>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Input Examples */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text">
                      Input Fields
                    </h4>
                    <Input placeholder="Default input" />
                    <Input type="search" placeholder="Search input" />
                    <Input type="password" placeholder="Password input" />
                    <Input placeholder="Disabled input" disabled />
                  </div>

                  {/* Select Examples */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text">
                      Select Dropdown
                    </h4>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                        <SelectItem value="option4" disabled>
                          Option 4 (Disabled)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Divider className="my-8" />

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Checkbox Examples */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text">
                      Checkboxes
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox defaultChecked />
                        <span className="text-sm text-text">
                          Checked by default
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox />
                        <span className="text-sm text-text">
                          Unchecked option
                        </span>
                      </label>
                      <label className="flex items-center gap-3 cursor-not-allowed opacity-50">
                        <Checkbox disabled />
                        <span className="text-sm text-text">
                          Disabled checkbox
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Slider Examples */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-text">Sliders</h4>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-placeholder-text mb-2">
                          Primary Slider
                        </label>
                        <Slider
                          defaultValue={[50]}
                          max={100}
                          step={1}
                          variant="primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-placeholder-text mb-2">
                          Secondary Slider
                        </label>
                        <Slider
                          defaultValue={[25]}
                          max={100}
                          step={1}
                          variant="secondary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* New Components Demo */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-medium text-text mb-6">New Components</h3>

                <div className="space-y-8">
                  {/* Dialog and Modal Examples */}
                  <div>
                    <h4 className="text-sm font-medium text-text mb-4">
                      Dialog & Modal System
                    </h4>
                    <div className="flex gap-3 flex-wrap">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <ButtonComponent variant="secondary">Open Dialog</ButtonComponent>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Example Dialog</DialogTitle>
                            <DialogDescription>
                              This is a customizable dialog component with
                              smooth animations.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm text-text-secondary">
                              Dialogs support custom animation directions and
                              spring physics for natural movement.
                            </p>
                          </div>
                          <DialogFooter>
                            <ButtonComponent variant="primary">Confirm</ButtonComponent>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <ButtonComponent variant="destructive" onClick={handlePromptDemo}>
                        Show Prompt
                      </ButtonComponent>
                    </div>
                  </div>

                  {/* Switch Examples */}
                  <div>
                    <h4 className="text-sm font-medium text-text mb-4">
                      Switch Components
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sound-switch">Enable Sound</Label>
                          <p className="text-sm text-text-secondary">
                            Play sound effects
                          </p>
                        </div>
                        <Switch
                          id="sound-switch"
                          checked={enableSound}
                          onCheckedChange={setEnableSound}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SegmentTab Example */}
                  <div>
                    <h4 className="text-sm font-medium text-text mb-4">
                      Segment Tab Control
                    </h4>
                    <div className="space-y-4">
                      <SegmentTab
                        items={tabItems}
                        value={selectedTab}
                        onChange={setSelectedTab}
                      />
                      <div className="p-4 bg-fill/30 rounded-lg border border-border">
                        <div className="text-sm text-text">
                          {selectedTab === 'overview' && (
                            <div>
                              <h5 className="font-medium mb-2">
                                Overview Content
                              </h5>
                              <p className="text-text-secondary">
                                This shows the overview section with general
                                information.
                              </p>
                            </div>
                          )}
                          {selectedTab === 'components' && (
                            <div>
                              <h5 className="font-medium mb-2">
                                Components Content
                              </h5>
                              <p className="text-text-secondary">
                                Here you can find all available UI components
                                and their usage examples.
                              </p>
                            </div>
                          )}
                          {selectedTab === 'settings' && (
                            <div>
                              <h5 className="font-medium mb-2">
                                Settings Content
                              </h5>
                              <p className="text-text-secondary">
                                Configure your application preferences and
                                options here.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Context Menu Demo */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-medium text-text mb-4">Context Menu</h3>
                <p className="text-sm text-placeholder-text mb-4">
                  Right-click on the card below to see the context menu in
                  action
                </p>

                <ContextMenu>
                  <ContextMenuTrigger>
                    <div className="p-6 border-2 border-dashed border-border rounded-lg hover:border-border/70 transition-colors cursor-pointer bg-fill/20 hover:bg-fill/40">
                      <div className="text-center">
                        <i className="i-mingcute-settings-3-line w-8 h-8 text-placeholder-text mx-auto mb-2" />
                        <p className="text-sm font-medium text-text">
                          Right-click me!
                        </p>
                        <p className="text-xs text-placeholder-text mt-1">
                          Try the context menu functionality
                        </p>
                      </div>
                    </div>
                  </ContextMenuTrigger>

                  <ContextMenuContent className="w-56">
                    <ContextMenuLabel>Actions</ContextMenuLabel>
                    <ContextMenuSeparator />

                    <ContextMenuItem
                      onClick={() => handleContextAction('copy')}
                    >
                      <i className="i-mingcute-copy-2-line w-4 h-4 mr-2" />
                      Copy
                    </ContextMenuItem>

                    <ContextMenuItem
                      onClick={() => handleContextAction('edit')}
                    >
                      <i className="i-mingcute-edit-line w-4 h-4 mr-2" />
                      Edit
                    </ContextMenuItem>

                    <ContextMenuItem
                      onClick={() => handleContextAction('share')}
                    >
                      <i className="i-mingcute-share-forward-line w-4 h-4 mr-2" />
                      Share
                    </ContextMenuItem>

                    <ContextMenuItem
                      onClick={() => handleContextAction('download')}
                    >
                      <i className="i-mingcute-download-2-line w-4 h-4 mr-2" />
                      Download
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuLabel>Preferences</ContextMenuLabel>

                    <ContextMenuCheckboxItem
                      checked={showNotifications}
                      onCheckedChange={setShowNotifications}
                    >
                      Show notifications
                    </ContextMenuCheckboxItem>

                    <ContextMenuCheckboxItem
                      checked={autoSave}
                      onCheckedChange={setAutoSave}
                    >
                      Auto-save changes
                    </ContextMenuCheckboxItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem
                      onClick={() => handleContextAction('delete')}
                      className="text-red focus:text-red"
                    >
                      <i className="i-mingcute-delete-2-line w-4 h-4 mr-2" />
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-text mb-4">
              Quick Start
            </h2>
            <p className="text-text-secondary mb-8">
              Get up and running in less than a minute
            </p>

            <div className="p-3 bg-material-opaque rounded-xl text-left border border-border">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red rounded-full" />
                  <div className="w-3 h-3 bg-yellow rounded-full" />
                  <div className="w-3 h-3 bg-green rounded-full" />
                </div>
                <span className="text-placeholder-text text-sm font-mono">
                  Terminal
                </span>
              </div>
              <div className="font-mono text-sm space-y-2">
                <div className="text-placeholder-text"># Clone and install</div>
                <div className="text-green">pnpm install</div>
                <div className="text-placeholder-text mt-4">
                  # Start development server
                </div>
                <div className="text-green">pnpm dev</div>
                <div className="text-placeholder-text mt-4">
                  # Build for production
                </div>
                <div className="text-green">pnpm build</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
