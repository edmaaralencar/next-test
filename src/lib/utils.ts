import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'Alta':
      return 'text-red-500 border-red-500'
    case 'Média':
      return 'text-amber-500 border-amber-500'
    case 'Baixa':
      return 'text-emerald-500 border-emerald-500'
    default:
      return ''
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Para Fazer':
      return 'text-orange-500 border-orange-500'
    case 'Em Progresso':
      return 'text-blue-500 border-blue-500'
    case 'Completo':
      return 'text-green-500 border-green-500'
    default:
      return ''
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}
