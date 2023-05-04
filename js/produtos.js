const getTypeProduct = async () => {
    let response = await fetch(`http://localhost:8080/type-product/`);
    return await response.json();
}

const createProduct = async () => {
    const name = document.getElementById("name-product");
    const value = document.getElementById("value-product");
    const typeProductSelect = document.getElementById("type-product");

    await fetch('http://localhost:8080/product/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name : name.value,
            value : value.value,
            type_product_id : typeProductSelect.value
        })
    })
    .then(response => response.json())
    .then(data => {
        showLog('Produto criado com sucesso', 'text-bg-success');
    })
    .catch(error => {
        showLog('Erro ao tentar cadastrar o produto', 'text-bg-danger');
    });

    name.value = '';
    value.value = '';
    typeProductSelect.value = '';
    await getProducts();
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

const updateProduct = async (productId) => {
    const nameProductModal = document.getElementById("name-product-modal");
    const valueProductModal = document.getElementById("value-product-modal");
    const typeProductModal = document.getElementById("type-product-modal");

    await fetch(`http://localhost:8080/product/${productId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name : nameProductModal.value,
            value : valueProductModal.value,
            type_product_id : typeProductModal.value
        })
    })
    .then(response => response.json())
    .then(data => {
        showLog('Produto atualizado com sucesso', 'text-bg-success');
    })
    .catch(error => {
        showLog('Erro ao tentar atualizar o produto', 'text-bg-danger');
    }); 

    await getProducts();
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

   document.querySelector('.toast').className = '';
   document.querySelector('.toast').classList.add(type);

    toastBody.innerHTML = message;
    toast.show();
}

window.onload = async () => {
    await getProducts();
    let optionsProductSelect =  '<option selected disabled hidde>Selecione uma opção</option>';
    const typeProductSelect = document.getElementById("type-product");
    const typeProduct = await getTypeProduct();

    typeProduct.data.forEach((type)=> {
        optionsProductSelect += `
            <option value="${type.id}">${type.name}</option>
        `
    })

    typeProductSelect.innerHTML = optionsProductSelect;
};
