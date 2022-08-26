export default function makePagination(data) {
  let pagination = '';
  if (!data.results.length)
    return pagination;
  const page = data.page;
  const totalPages = data.total_pages;
  pagination += `<li><button aria-label="Previous page" class="gallery__pag-button gallery__pag-button--arrow-left${page === 1 ? ' gallery__pag-button--disabled' : ''}" ${page === 1 ? '' : `data-page="${page - 1}"`}></button></li>`;
  if (page > 1)
    pagination += `<li><button aria-label="First page" class="gallery__pag-button${page === 1 ? ' current' : ''}" data-page="${1}">1</button></li>`;
  if (page > 4)
    pagination += `<li><span class="gallery__elipsis">...</span></li>`;
  if (page > 3)
    pagination += `<li><button aria-label="$Page ${page - 2}" class="gallery__pag-button" data-page="${page - 2}">${page - 2}</button></li>`;
  if (page > 2)
    pagination += `<li><button aria-label="$Page ${page - 1}" class="gallery__pag-button" data-page="${page - 1}">${page - 1}</button></li>`;

  pagination += `<li><button aria-label="Current page" class="gallery__pag-button gallery__pag-button--current" data-curpage="${page}" data-pages="${totalPages}">${page}</button></li>`;

  if (totalPages - 1 > page)
    pagination += `<li><button aria-label="$Page ${page + 1}" class="gallery__pag-button" data-page="${page + 1}">${page + 1}</button></li>`;
  if (totalPages - 2 > page)
    pagination += `<li><button aria-label="$Page ${page + 2}" class="gallery__pag-button" data-page="${page + 2}">${page + 2}</button></li>`;
  if (totalPages - 3 > page)
    pagination += `<li><span class="gallery__elipsis">...</span></li>`;
  if (totalPages > page) {
    pagination += `<li><button aria-label="Last page" class="gallery__pag-button" data-page="${totalPages}">${totalPages}</button></li>`;
  }
  pagination += `<li><button aria-label="Next page" class="gallery__pag-button gallery__pag-button--arrow-right${page === totalPages ? ' gallery__pag-button--disabled' : ''}" ${page === totalPages ? '' : `data-page="${page + 1}"`}></button></li>`;
  return pagination;
}