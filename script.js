const nameInput = document.querySelector('#name');
const priceInput = document.querySelector('#price');
const discountInput = document.querySelector('#discount');
const categorySelect = document.querySelector('#category');
const searchButton = document.querySelector('#search');
const pageSizeSelect = document.getElementById('pageSize');

let paginationData = {};
let currentPage = 1;
let totalPages = 1;
let pageSize = 5;
let columnSelc = 'id';
let orderSelect = 'asc';

const host = 'http://vps-4150137-x.dattaweb.com/8080/api'

window.onload = () => {
  fetch(host+'/categories/')
      .then(response => response.json())
      .then(data => populateCategories(data))
      .catch(console.error);

  // Establecer el filtro inicial en la columna "id" en orden ascendente
  const idHeader = document.querySelector('th[data-value="id"]');
  idHeader.setAttribute('data-order', 'asc');
  const icon = idHeader.querySelector('span');
  icon.innerHTML = '<i class="bi bi-sort-up-alt"></i>';

  searchProducts();
};

searchButton.addEventListener('click', searchProducts);

pageSizeSelect.addEventListener('change', function() {
  pageSize = parseInt(this.value);
  searchProducts();
});

function populateCategories(data) {
  data.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

function searchProducts() {
  const params = [
    nameInput.value && `name=${nameInput.value}`,
    priceInput.value && `price=${priceInput.value}`,
    discountInput.value && `discount=${discountInput.value}`,
    categorySelect.value && `category=${categorySelect.value}`,
    `page=${currentPage - 1}`,
    `size=${pageSize}`,
    orderSelect && `order=${orderSelect}`,
    columnSelc && `column=${columnSelc}`
  ].filter(Boolean);

  const url = host+`/products/?${params.join('&')}`;
  document.getElementById('loadingOverlay').style.display = 'block';

  console.log(url);
  return fetch(url)
      .then(response => response.json())
      .then(data => {
        // Ocultar el overlay de carga
        document.getElementById('loadingOverlay').style.display = 'none';
        return handleResponse(data);
      })
      .catch(error => {
        // Ocultar el overlay de carga en caso de error
        document.getElementById('loadingOverlay').style.display = 'none';
        console.error(error);
      });
}

function handleResponse(data) {
  if (data._embedded) {
    const productList = data._embedded.productList;
    paginationData = data.page;
    currentPage = paginationData.number + 1;
    totalPages = paginationData.totalPages;

    showPaginationData(paginationData);
    showData(productList);

    return productList;
  } else {
    const table = document.querySelector('table tbody');
    table.innerHTML = '';
    console.error('Error: data._embedded is undefined');
    return null;
  }
}

function showData(data) {
  const table = document.querySelector('table tbody');
  table.innerHTML = '';

  data.forEach(product => {
    const row = table.insertRow();
    row.innerHTML = `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.discount}%</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.category.name}</td>
    </tr>
    `;
  });
}

function showPaginationData(data) {
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  for (let i = 0; i < data.totalPages; i++) {
    const li = document.createElement('li');
    li.classList.add('page-item');
    if (i === currentPage - 1) {
      li.classList.add('active');
    }
    li.innerHTML = `
    <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
    `;

    li.addEventListener('click', function(event) {
      event.preventDefault();
      currentPage = parseInt(event.target.getAttribute('data-page'));
      searchProducts();
    });

    pagination.appendChild(li);
  }
}
categorySelect.addEventListener('change', searchProducts);


document.querySelectorAll('th').forEach(header => {
  header.addEventListener('click', () => {
    const column = header.getAttribute('data-value');
    let order = header.getAttribute('data-order');

    // Invert the order
    order = order === 'asc' ? 'desc' : 'asc';

    // Update the order attribute
    header.setAttribute('data-order', order);

    // Remove icons from all other headers
    document.querySelectorAll('th').forEach(otherHeader => {
      if (otherHeader !== header) {
        otherHeader.querySelector('span').innerHTML = '';
      }
    });

    // Update the icon
    const icon = header.querySelector('span');
    icon.innerHTML = order === 'asc' ? '<i class="bi bi-sort-up-alt"></i>' : '<i class="bi bi-sort-down-alt"></i>';

    orderSelect = order;
    columnSelc = column;

    // Call searchProducts to update the table with the new sorting
    searchProducts();
  });
});

function resetButtons(currentColumn) {
  const tableButtons = document.querySelectorAll("th");
  [...tableButtons].map((button) => {
    if (button !== currentColumn && button.getAttribute('data-value') !== 'id') {
      button.removeAttribute("data-dir");
      const icon = button.querySelector('span');
      icon.innerHTML = '';
    }
  });
}

function clearFilters() {
  // Restablecer los campos de entrada
  nameInput.value = '';
  priceInput.value = '';
  discountInput.value = '';

  // Restablecer los campos de selección
  categorySelect.selectedIndex = 0; // selecciona la primera opción, que es "Todas las categorias"
  pageSizeSelect.value = '5'; // selecciona la opción "5"

  // Restablecer las variables de ordenación
  orderSelect = 'asc';
  columnSelc = 'id';

  // Restablecer los iconos de ordenación en la tabla
  const idHeader = document.querySelector('th[data-value="id"]');
  resetButtons(idHeader);
  idHeader.setAttribute('data-order', 'asc');
  const icon = idHeader.querySelector('span');
  icon.innerHTML = '<i class="bi bi-sort-up-alt"></i>';

  // Llamar a searchProducts para actualizar la tabla con los filtros restablecidos
  searchProducts();
}