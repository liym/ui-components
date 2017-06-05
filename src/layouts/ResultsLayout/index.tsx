import * as React from 'react';
import * as cx from 'classnames';
import { compose, defaultProps, withPropsOnChange } from 'recompose';

import { Grid } from 'widgets/Grid';
import { BreadCrumbs } from 'widgets/BreadCrumbs';
import { Sorting } from 'widgets/Sorting';
import { Pagination } from 'widgets/Pagination';
import { ProductsList } from 'lists/ProductsList';
import { FacetsLayout } from '../FacetsLayout';
import { Button } from 'internals/Button';
import { Banner } from 'internals/Banner';
import { PoweredBy } from 'internals/PoweredBy';
import withHooks from 'helpers/withHooks';

const styles = require('./styles.css');

export const ResultsLayout = compose(
  defaultProps({
    showFacets: true,
    columns: {
      facets: 3,
      products: 9,
    }
  }),

  withPropsOnChange(['isMobile'], ({ isMobile }) => ({
    showMobileHeader: !!isMobile,
    showFacets: !isMobile
  })),

  withHooks('results')
)
(({
  config,
  isMobile,
  response,
  onFacetsChange,
  onProductClick,
  onPageChange,
  onSortChange,
  onBreadCrumbRemove,
  onMobileFacetsOpen,
  onBannerClick,
  onPoweredByClick,
  onClearAll,
  columns,
  showMobileHeader,
  showFacets,
  type
}: any) => (
  <div>
    { 
      !showMobileHeader &&
      <div>
        <BreadCrumbs
        {...response.meta}
        className={styles.breadcrumbs}
        onChange={onBreadCrumbRemove}
        displayQuery={type !== 'collection'}
        config={{
          ...config.breadcrumbs,
          facets: config.facets,
          currency: config.currency
        }} />

        <Sorting
          className={styles.sort}
          value={!!response.meta.sort.length && response.meta.sort[0]}
          onChange={onSortChange}
          options={config.sorting.options}
          config={config.sorting} />
      </div>
    }
    {
      showMobileHeader &&
      <Grid columns='6|6'>
        <Button
          onClick={onMobileFacetsOpen}
          className={styles.mobileFacetsButton}
          columnClass={styles.paddingRight}>
          { 
            config.facets.i18n.showMobileFacets
          }
          { 
            response.meta.filters && !!response.meta.filters.length &&
            ` (${response.meta.filters.length})`
          }
        </Button>

        <Sorting
          isMobile={isMobile}
          columnClass={styles.paddingLeft}
          className={cx(styles.sort, styles.mobileSort)}
          value={!!response.meta.sort.length && response.meta.sort[0]}
          onChange={onSortChange}
          options={config.sorting.options}
          config={config.sorting} />
      </Grid>
    }

    <Grid columns={showFacets ? `${columns.facets}|${columns.products}` : '12'}>
      {
        showFacets &&
        <FacetsLayout {...{ isMobile, config, response, onFacetsChange, onClearAll, columnClass: styles.facets }}/>
      }
  
      <div className={cx(styles.products, !isMobile && styles.productsWithPadding)}>

        {
          response.banner && response.banner.products &&
          <Banner {...response.banner.products} onClick={onBannerClick} />
        }
        <ProductsList
          config={{
            ...config,
            ...config.productsGrid
          }}
          columnClass={styles.product}
          items={response.items}
          onProductClick={onProductClick} />

        {
          !!response.meta.total && response.meta.total > response.meta.limit &&
            <Pagination
              className={styles.pagination}
              onChange={onPageChange}
              style={{ textAlign: 'center' }}
              config={config.pagination}
              total={Math.ceil(response.meta.total / response.meta.limit)}
              current={Math.ceil(response.meta.offset / response.meta.limit) + 1} />
        }
        {
          !!config.poweredByFindify &&
          <PoweredBy onClick={onPoweredByClick} />
        }
  
      </div>
    </Grid>

  </div>
));

