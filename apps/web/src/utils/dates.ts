import { formatDistanceToNowStrict } from 'date-fns'

export function diffForHumans(date: Date | string) {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
  })
}
