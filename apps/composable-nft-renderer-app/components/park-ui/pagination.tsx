import {
  Pagination as ArkPagination,
  type PaginationProps as ArkPaginationProps,
} from '@ark-ui/react/pagination';
import { Button } from 'components/park-ui/button';
import { IconButton } from 'components/park-ui/icon-button';
import { forwardRef } from 'react';
import { type PaginationVariantProps, pagination } from 'styled-system/recipes';

export interface PaginationProps
  extends ArkPaginationProps,
    PaginationVariantProps {}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (props, ref) => {
    const [variantProps, localProps] = pagination.splitVariantProps(props);
    const styles = pagination(variantProps);

    return (
      <ArkPagination.Root ref={ref} className={styles.root} {...localProps}>
        {({ pages }) => (
          <>
            <ArkPagination.PrevTrigger className={styles.prevTrigger} asChild>
              <IconButton variant="ghost" aria-label="Next Page">
                <ChevronLeftIcon />
              </IconButton>
            </ArkPagination.PrevTrigger>
            {pages.map((page, index) =>
              page.type === 'page' ? (
                <ArkPagination.Item
                  className={styles.item}
                  key={`${page.value}-${index}`}
                  {...page}
                  asChild
                >
                  <Button variant="outline">{page.value}</Button>
                </ArkPagination.Item>
              ) : (
                <ArkPagination.Ellipsis
                  className={styles.ellipsis}
                  key={'pagination-ellipsis-more'}
                  index={index}
                >
                  &#8230;
                </ArkPagination.Ellipsis>
              ),
            )}
            <ArkPagination.NextTrigger className={styles.nextTrigger} asChild>
              <IconButton variant="ghost" aria-label="Next Page">
                <ChevronRightIcon />
              </IconButton>
            </ArkPagination.NextTrigger>
          </>
        )}
      </ArkPagination.Root>
    );
  },
);

Pagination.displayName = 'Pagination';

const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-label="previous page"
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m15 18l-6-6l6-6"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    role="img"
    aria-label="next page"
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m9 18l6-6l-6-6"
    />
  </svg>
);
