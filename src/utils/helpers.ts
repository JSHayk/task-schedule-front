export function getStatusColor(statusName: string): string {
    const colors: Record<string, string> = {
        'TODO': 'bg-gray-400',
        'IN_PROGRESS': 'bg-blue-500',
        'DONE': 'bg-green-500',
        'CANCELLED': 'bg-red-500'
    }
    return colors[statusName] || 'bg-gray-400'
}

export function formatStatusName(statusName: string): string {
    return statusName.replace('_', ' ')
}

export function pluralize(count: number, singular: string, plural?: string): string {
    return count === 1 ? singular : (plural || `${singular}s`)
}

export function getTodayDate(): string {
    return new Date().toISOString().split('T')[0] || ''
}
export function formatShortDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
