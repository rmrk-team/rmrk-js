import React from 'react';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
  return <></>;
}

export { Skeleton };
