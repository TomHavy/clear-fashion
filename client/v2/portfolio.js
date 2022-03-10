// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectSort = document.querySelector('#sort-select');
const selectPrice = document.querySelector('#price-select');
const selectFilterDate = document.querySelector('#sort-select');
const selectFilterPrice = document.querySelector('#sort-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}€</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const renderBrands = products => {
  let options = [... new Set(products.flatMap(x => x.brand))];

  selectBrand[0] = new Option("all");
  var i = 1;
  for (var option of options) {
    selectBrand[i] = new Option(option);

    i += 1;
  }

};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(products);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

//FEATURE 1:
selectPage.addEventListener('change' , async (event) => {
  fetchProducts(parseInt(event.target.value),currentPagination.pageSize).then(setCurrentProducts)
      .then(()=> render(currentProducts,currentPagination));

});

//FEATURE 2:

selectBrand.addEventListener('change', async (event) => {
  fetchProducts(currentPagination.currentPage,currentPagination.pageSize).then(setCurrentProducts)
      .then(()=> render(filterBrand(currentProducts,event.target.value),currentPagination));
})

function filterBrand(currentProducts, brandName) {
  var filteredProducts = []
  if (brandName == "all") {
    filteredProducts = [...currentProducts]
  }
  for (var product of currentProducts) {
    if (product.brand == brandName) {
      filteredProducts.push(product)
    }
  }
  return filteredProducts
}
// FEATURE:3

selectFilterDate.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then(setCurrentProducts)
      .then(() => render(filterDate(currentProducts, event.target.value), currentPagination));
})

function filterDate(currentProducts, selector) {
  var filteredProducts = []
  if (selector == "Null") {
    filteredProducts = [...currentProducts]
  }
  else {
    for (var product of currentProducts) {
      let today = new Date('2022-01-31')
      let released = new Date(product.released);
      if (today - released < 14 * 1000 * 60 * 60 * 24) {
        filteredProducts.push(product)
      }
    }
  }

  return filteredProducts
}


// FEATURE:4
selectPrice.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
      .then(setCurrentProducts)
      .then(() => render(filterPrice(currentProducts, event.target.value), currentPagination));
})

function filterPrice(currentProducts, selector) {
  var filteredProducts = []
  if (selector == "no_filter") {
    filteredProducts = [...currentProducts]
  }
  if (selector == "Cheaper") {
    for (var product of currentProducts) {
      console.log(product.price);
      console.log(selector);
      if (product.price <= 50) {
        filteredProducts.push(product)
      }
    }
  }
  else {
    for (var product of currentProducts) {
      console.log(product.price);
      if (product.price >= 50) {
        filteredProducts.push(product)
      }
    }
  }

  return filteredProducts
}
document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});
