// 'use strict';

// // current products on the page
// let currentProducts = [];
// let currentPagination = {};

// // instantiate the selectors
// const selectShow = document.querySelector('#show-select');
// const selectPage = document.querySelector('#page-select');
// const sectionProducts = document.querySelector('#products');
// const spanNbProducts = document.querySelector('#nbProducts');

// /**
//  * Set global value
//  * @param {Array} result - products to display
//  * @param {Object} meta - pagination meta info
//  */
// const setCurrentProducts = ({result, meta}) => {
//   currentProducts = result;
//   currentPagination = meta;
// };

// /**
//  * Fetch products from api
//  * @param  {Number}  [page=1] - current page to fetch
//  * @param  {Number}  [size=12] - size of the page
//  * @return {Object}
//  */
// const fetchProducts = async (page = 1, size = 12) => {
//   try {
//     const response = await fetch(
//       `https://clear-fashion-lac.vercel.app/products?page=${page}&size=${size}`
//     );
//     const body = await response.json();

//     if (response.status !== 200) {
//       console.error(body);
//       return {currentProducts, currentPagination};
//     }

//     return body;
//   } catch (error) {
//     console.error(error);
//     return {currentProducts, currentPagination};
//   }
// };

// /**
//  * Render list of products
//  * @param  {Array} products
//  */
// const renderProducts = products => {
//   const fragment = document.createDocumentFragment();
//   const div = document.createElement('div');
//   const template = products
//     .map(product => {
//       return `
//       <div class="product" id=${product.uuid}>
//         <span>${product.brand}</span>
//         <a href="${product.link}">${product.name}</a>
//         <span>${product.price}</span>
//       </div>
//     `;
//     })
//     .join('');

//   div.innerHTML = template;
//   fragment.appendChild(div);
//   sectionProducts.innerHTML = '<h2>Products</h2>';
//   sectionProducts.appendChild(fragment);
// };

// /**
//  * Render page selector
//  * @param  {Object} pagination
//  */
// const renderPagination = pagination => {
//   const {currentPage, pageCount} = pagination;
//   const options = Array.from(
//     {'length': pageCount},
//     (value, index) => `<option value="${index + 1}">${index + 1}</option>`
//   ).join('');

//   selectPage.innerHTML = options;
//   selectPage.selectedIndex = currentPage - 1;
// };

// /**
//  * Render page selector
//  * @param  {Object} pagination
//  */
// const renderIndicators = pagination => {
//   const {count} = pagination;

//   spanNbProducts.innerHTML = count;
// };

// const render = (products, pagination) => {
//   renderProducts(products);
//   renderPagination(pagination);
//   renderIndicators(pagination);
// };

// /**
//  * Declaration of all Listeners
//  */

// /**
//  * Select the number of products to display
//  */
// selectShow.addEventListener('change', async (event) => {
//   const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

//   setCurrentProducts(products);
//   render(currentProducts, currentPagination);
// });

// document.addEventListener('DOMContentLoaded', async () => {
//   const products = await fetchProducts();

//   setCurrentProducts({result:products, meta:23});
//   render(currentProducts, currentPagination);
// });


// current products on the page
let currentProducts = [];
let favorite_list = [];
let currentPagination = {};
currentPagination['currentSize'] = 12;
currentPagination['currentPage'] = 1;
currentPagination['paginationChoice'] = "actual"
let currentBrand = 'all';
let currentMaxPrice = 1000;
let currentSort = 1;


// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPagePrevious = document.querySelector('#previous-page');
const selectPageNext = document.querySelector('#next-page');
const selectBrand = document.querySelector('#brand-select');
const sectionProducts = document.querySelector('#products');
const selectFilterPrice = document.querySelector('#filter-price-select')
const selectFilterDate = document.querySelector('#filter-date-select')
const selectFilterFavorite = document.querySelector('#filter-favorite-select')
const selectSort = document.querySelector('#sort-select');

const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const spanp50 = document.querySelector('#p50');
const spanp90 = document.querySelector('#p90');
const spanp95 = document.querySelector('#p95');
const spanLastReleased = document.querySelector('#lastReleased');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({ result, meta }) => {
    currentProducts = result;
    currentPagination = meta;
    
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (size = currentPagination.currentSize, page = "actual",  brand = currentBrand,  price=currentMaxPrice, sort=currentSort) => {
    if (isNaN(price)) {
        currentMaxPrice = 1000;
        price = currentMaxPrice
    }
    if (page == "actual") {currentPagination.currentPage = 1}
    if (page == "next") { currentPagination.currentPage = currentPagination.currentPage + 1 }
    if (page == "previous") { currentPagination.currentPage = currentPagination.currentPage -1}
    let pageNumber = currentPagination.currentPage
    let skip = (pageNumber - 1) * size;
    let limit = size * pageNumber;
    console.log("skip : ", skip, " | limit : ", limit, " | pageNumber : ", pageNumber)
    try {
        const response = await fetch(
            `https://clear-fashion-lac.vercel.app/products?price=${price}&brand=${brand}&limit=${limit}&sort=${sort}&skip=${skip}`
        );
        const body = await response.json();
        console.log(body)
        currentProducts = body;
        //currentPagination['currentPage'] = 1;
        currentPagination['currentSize'] = size;
        currentBrand = brand
        currentMaxPrice = price
        currentSort = sort;
        if (body.success !== true) {
            console.error(body);
            return { currentProducts, currentPagination };
        }
        //return body.data

        return body;

    } catch (error) {
        console.error(error);
        return { currentProducts, currentPagination };
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
            if (favorite_list.includes(product._id)) {
                return `
      <div class="product" id=${product._id}>
        <span >${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}&euro;</span>
        <span>&nbsp;</span>
        <span style="color:#FF8773; font-size:20px">${"&#10084;"}</span>
      </div>`;
            }
            else {
                return `
      <div class="product" id=${product._id}>
        <span style="text-align:center;">${product.brand}</span>
        <a href="${product.link}" target = "_blank">${product.name}</a>
        <span>${product.price}&euro;</span>
        <button style="border: none; background : none; color:#8FB8C1; font-size : 20px;" onclick= AddFavorite('${product._id}')>${"&#10084;"}</button>
      </div>`;
            }
        }).join('');

    div.innerHTML = template;
    fragment.appendChild(div);
    sectionProducts.innerHTML =`<br><img  id="object-position-2" src="logo.webp" alt="Logo clear-fashion" /><h2>Products</h2><br><br>`;
    sectionProducts.appendChild(fragment);

};


function AddFavorite(_id) {
    //console.log(uuid)
    favorite_list.push(_id);
    //console.log(favorite_list)
    render(currentProducts, currentPagination)
}

/**
 * Render page selector
 * @param  {Object} pagination
 */
function renderPagination() {
    const options = ` <button style="border: none; background : none; color:#8FB8C1; font-size : 20px;" onclick= AddFavorite('${product.uuid}')>${"&#10084;"}</button>`

    selectPage.innerHTML = options;
    selectPage.selectedIndex = 0;
};

// Show the list of brand names to filter
const renderBrands = products => {

    const options = `<option value="all">all brands</option>
        <option value="dedicatedbrand">dedicatedbrand</option>
        <option value="montlimart">montlimart</option>
        <option value="adresseparis">adresseparis</option>`;
    let i = 0
    if (currentBrand == "all") { i = 0 }
    else if (currentBrand == "dedicatedbrand") { i = 1 }
    else if (currentBrand == "montlimart") { i = 2 }
    else if (currentBrand == "adresseparis") { i = 3 }
    selectBrand.innerHTML = options;
    selectBrand.selectedIndex = i;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
function renderIndicators() {

    spanNbProducts.innerHTML = currentProducts.length;
    //spanNbNewProducts.innerHTML = CountNewProducts();
    spanp50.innerHTML = Percentile(0.50);
    spanp90.innerHTML = Percentile(0.90);
    spanp95.innerHTML = Percentile(0.95);
    //spanLastReleased.innerHTML = LastReleased();
};

function LastReleased() {
    var sortedProducts = SortProducts(currentProducts, "date-asc")
    return sortedProducts[0].released
}

function CountNewProducts() {
    var count = 0
    for (var product of currentProducts) {
        let today = new Date('2022-01-30')
        let released = new Date(product.released);
        if (today - released < 14 * 1000 * 60 * 60 * 24) {
            count += 1
        }
    }
    return count
}

function Percentile(p) {
    let clone = [...currentProducts]
    var sortedProducts = clone.sort((x, y) => x.price - y.price)
    var index = p * sortedProducts.length
    index = Math.round(index)
    var percentile = sortedProducts[index].price
    return percentile.toString() + "&euro;"
}

const render = (products) => {
    renderBrands(products);
    renderProducts(products);
    //renderPagination();
    renderIndicators();

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Select the number of products to display


selectShow.addEventListener('change', event => {
    fetchProducts(parseInt(event.target.value))
        .then(() => render(currentProducts)); //, pagination
});

//Feature 1 - Browse pages

selectPagePrevious.addEventListener('click', event => {
    fetchProducts(currentPagination.currentSize, "previous")
        .then(() => render(currentProducts)); //, pagination
});
selectPageNext.addEventListener('click', event => {
    fetchProducts(currentPagination.currentSize, "next")
        .then(() => render(currentProducts)); //, pagination
});

//Feature 2 - Filter by brands


selectBrand.addEventListener('change', event => {
    fetchProducts(currentPagination.currentSize, "actual", event.target.value)
        .then(() => render(currentProducts));
})


//Feature 4 - Filter by reasonable price

selectFilterPrice.addEventListener('change', event => {
    fetchProducts(currentPagination.currentSize, currentPagination.currentPage, currentBrand, parseInt(event.target.value))
        .then(() => render(currentProducts));
})

//Feature 5 - Sort by price

selectSort.addEventListener('change', event => {
    fetchProducts(currentPagination.currentSize, currentPagination.currentPage, currentBrand, currentMaxPrice, parseInt(event.target.value))
        .then(() => render(currentProducts));
})

//Feature 14 - Filter by favorite

selectFilterFavorite.addEventListener('change', event => {
    fetchProducts()
        .then(() => render(filterFavorite(currentProducts, event.target.value)));
})

function filterFavorite(currentProducts, selector) {
    var filteredProducts = []
    if (selector == "no_filter") {
        filteredProducts = [...currentProducts]
    }
    else {
        for (var product of currentProducts) {
            if (favorite_list.includes(product._id)) {
                filteredProducts.push(product)
            }
        }
    }
    return filteredProducts
}


document.addEventListener('DOMContentLoaded', () =>
    fetchProducts()
        .then(() => render(currentProducts))
);