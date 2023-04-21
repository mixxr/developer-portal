import { useSearchResults, widget, WidgetDataType } from '@sitecore-search/react';
import { WidgetComponentProps } from '@sitecore-search/react/types';
import Image from 'next/image';
import { ComponentType } from 'react';
import { truncateString } from 'ui/common/text-util';
import Loader from './Loader';
import QuerySummary from './QuerySummary';
import SearchFacets from './SearchFacets';
import SearchPagination from './SearchPagination';
import SearchSort from './SearchSort';

export interface SearchResultsType extends WidgetComponentProps {
  initialKeyphrase?: string;
  currentPage?: number;
  initialArticlesPerPage?: number;
  defaultSortType?: string;
}

export const SearchResults = (props: SearchResultsType) => {
  const { initialKeyphrase = '', initialArticlesPerPage = 24, currentPage = 1, defaultSortType = 'suggested' } = props;
  const {
    actions: { onSortChange, onFacetClick, onPageNumberChange },
    context: { page = currentPage, itemsPerPage = initialArticlesPerPage, sortType = defaultSortType },
    queryResult: { isLoading, data: { sort: { choices: sortChoices = [] } = {}, total_item: totalItems = 0, content: articles = [], facet: facets = [] } = {} },
  } = useSearchResults(() => {
    return {
      itemsPerPage: initialArticlesPerPage,
      keyphrase: initialKeyphrase,
      page: currentPage,
      sortType: defaultSortType,
    };
  });

  return (
    <>
      {isLoading && <Loader />}
      {!isLoading && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <SearchFacets onFacetClick={onFacetClick} facets={facets} />
          </div>
          <div className="md:col-span-2">
            <div className="m-auto w-full items-center">
              <div className="relative float-right inline-flex text-sm">
                <SearchSort onSortChange={onSortChange} sortChoices={sortChoices} sortType={sortType} />
              </div>
              {articles.length && <QuerySummary currentPage={page} resultsPerPage={itemsPerPage} totalResults={totalItems} title={initialKeyphrase} />}
            </div>
            <ul className="border-theme-border mt-2 border-t">
              {articles.map((result, index) => (
                <li key={index} className="mt-2 py-4">
                  <a href={result.url} className="group">
                    <div className="bg-theme-bg grid grid-cols-4 items-center md:flex-row">
                      <div className={`${result.type == 'Video' ? 'col-span-3' : 'col-span-4'} pr-2`}>
                        {result.type && <span className="bg-primary-500 text-2xs px-2.5 py-1 uppercase text-white dark:bg-teal-500">{result.type}</span>}
                        {result.index_name && <span className="text-2xs mr-2 px-2.5 py-1 uppercase">{result.site_name}</span>}
                        <h3 className="mt-2 text-base font-bold group-hover:underline">{result.name}</h3>

                        {result.description && <p className="text-sm">{truncateString(result.description, 300, true)}</p>}
                      </div>
                      {result.type == 'Video' && (
                        <div className="col-span-1">
                          {result.image_url && <Image width={256} height={144} src={result.image_url} alt={result.index_name} className="mt-20 object-scale-down" />}
                          {!result.image_url && <Image width={256} height={144} src="/images/social/social-card-default.jpeg" alt={result.index_name} className="mt-20 object-scale-down" />}
                        </div>
                      )}
                    </div>
                    <span className="text-violet mt-1 block break-words text-xs italic dark:text-white">{result.url}</span>
                  </a>
                </li>
              ))}
            </ul>

            <SearchPagination defaultCurrentPage={1} onPageNumberChange={(v) => onPageNumberChange({ page: v })} page={page} pageSize={itemsPerPage} totalItems={totalItems} />
          </div>
        </div>
      )}
    </>
  );
};

const SearchResultsWidget = widget(SearchResults as ComponentType, WidgetDataType.SEARCH_RESULTS, 'content');
export default SearchResultsWidget;
