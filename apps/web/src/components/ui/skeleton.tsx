import { cn } from '@/lib/utils'

function Skeleton({
  className,
  isLoading = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { isLoading?: boolean }) {
  return (
    <div
      className={cn(
        { 'animate-pulse': isLoading },
        ' rounded-md bg-muted',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
