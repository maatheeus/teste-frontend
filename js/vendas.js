let productsAdd = [];


const getTypeProduct = async () => {
    let response = await fetch(`http://localhost:8080/product/`);
    return await response.json();
}


const changeProduct = async (event, index) => {
    const product = await getProduct(event.target.value);
    const quantityInput = document.getElementById(`quantity-product-${index}`)
    productsAdd[index] = {product_id : product.data.id, value: product.data.value, quantity: 1};
    document.getElementById("btn-sale").style.display = 'block';
    document.getElementById(`value-product-${index}`).value = `${product.data.value}`
    quantityInput.disabled = false;
    quantityInput.value = 1;
    calcTotal(index)
    
}

const calcTotal = (index) => {
    document.getElementById(`value-total-product-${index}`).value = productsAdd[index].value * productsAdd[index].quantity 
}

const changeQuantity = (event, index) => {
    productsAdd[index].quantity = event.target.value
    calcTotal(index);
}

const addProduct = async (event) => {
    let result = '';
    const index = productsAdd.push({product_id : null, value: null, quantity: null}) - 1;
    const products = await getTypeProduct();
    const productsSale = document.getElementById("products-sale");

    productsAdd.forEach((product,index) => {
        let optionsProductSelect =  !product.product_id ?  '<option selected disabled hidde>Selecione uma opção</option>' : '';
  
        products.data.forEach((productSelect)=> {
            optionsProductSelect += `
                <option value="${productSelect.id}" ${product.product_id && productSelect.id == product.product_id ? 'selected' : ''}>${productSelect.name}</option>
            `
        })

        result = `
            ${result}
            <div class="row mb-3">
            <div class="col-sm-6">
                <label for="inputNome" class="form-label">Produto</label>
                <select class="form-control" id="type-product" onchange="changeProduct(event, ${index})">
                ${optionsProductSelect}
                </select>
            </div>
            <div class="col-sm-2">
                <label for="inputSenha" class="form-label">Valor Unitario</label>
                ${
                    !product.value ?
                        `<input type="number" class="form-control" id="value-product-${index}" disabled>`
                        :
                        `<input type="number" class="form-control" id="value-product-${index}" value=${product.value}>`
                }
            </div>
            <div class="col-sm-2">
                <label for="inputSenha" class="form-label">Quantidade</label>
                ${
                    !product.quantity ? 
                        ` <input type="number" class="form-control" id="quantity-product-${index}" value="0" disabled onchange="changeQuantity(event, ${index})">`
                        :
                        ` <input type="number" class="form-control" id="quantity-product-${index}" value="${product.quantity}" onchange="changeQuantity(event, ${index})">`   
                }
               
            </div>
            <div class="col-sm-2">
                <label for="inputSenha" class="form-label">Valor Total</label>
                ${
                    !product.value  &&  !product.quantity ? 
                    ` <input type="number" class="form-control" id="value-total-product-${index}" disabled>`
                    :
                    ` <input type="number" class="form-control" id="value-total-product-${index}" value="${product.value * product.quantity}">`
                }
            </div>
        </div>

        `
    })

    productsSale.innerHTML = result;
}

const showUpdateModalProduct = async (productId) => {
    const nameProductModal = document.getElementById("name-product-modal");
    const valueProductModal = document.getElementById("value-product-modal");
    const typeProductModal = document.getElementById("type-product-modal");
    const productModal = new bootstrap.Modal(document.getElementById('edit-product'));
    const saveEditModal = document.getElementById('save-edit-modal');
    const typeProduct = await getTypeProduct();
    const product = await getProduct(productId);
    let optionsProductSelect =  '';


    typeProduct.data.forEach((type)=> {
        optionsProductSelect += `
            <option value="${type.id}" ${type.id == product.data.type_product_id ? 'selected' : ''}>${type.name}</option>
        `
    })

    saveEditModal.innerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="updateProduct(${productId})">Salvar mudanças</button>`

    typeProductModal.innerHTML = optionsProductSelect;
    nameProductModal.value = product.data.name;
    valueProductModal.value = product.data.value;

    productModal.show();
}

const getProduct = async (productId) => {
    let response = await fetch(`http://localhost:8080/product/${productId}/`);
    return await response.json();
}

const getProducts = async () => {
    let bodyTableProducts = document.getElementById("tbody-products");
    let newBody = '';
    let response = await fetch(`http://localhost:8080/product/`);
    response = await response.json();
    
    response.data.forEach(product => {
        newBody += `
            <tr>
                <th scope="row">${product.id}</th>
                <td>${product.name}</td>
                <td>${product.type_product_id}</td>
                <td>${product.value}</td>
                <td><a href="#" class="btn btn-primary" onclick="showUpdateModalProduct(${product.id})">Editar</a></td>
            </tr>
        `
    });

    bodyTableProducts.innerHTML = newBody;
}

const showLog = (message, type) => {
    const toast = new bootstrap.Toast(document.getElementById("liveToast"))
    const toastBody = document.getElementById("toast-body-message")

   document.querySelector('.toast').className = 'toast';
   document.querySelector('.toast').classList.add(type);

    toastBody.innerHTML = message;
    toast.show();
}

const confirmSale = async () => {
    document.getElementById("alert-sales").style.display = 'none'

    await fetch(`http://localhost:8080/sale/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            products: productsAdd
        })
    })
    .then(response => response.json())
    .then(data => {
        showLog('Venda cadastrada sucesso', 'text-bg-success');
    })
    .catch(error => {
        showLog('Erro ao tentar realizar a venda', 'text-bg-danger');
    }); 

    productsAdd = [];
    document.getElementById("products-sale").innerHTML = '';
    document.getElementById("btn-sale").style.display = 'none';
}

const cancelSale = () => {
    document.getElementById("alert-sales").style.display = 'none'
}

const salesProducts = () => {
    document.getElementById("alert-sales").style.display = 'block'
}
