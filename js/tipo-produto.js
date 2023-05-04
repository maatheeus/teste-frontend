const createProduct = async () => {
    const name = document.getElementById("name-product");

    await fetch('http://localhost:8080/type-product/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name : name.value
        })
    })
    .then(response => response.json())
    .then(data => {
        showLog('Tipo do produto criado com sucesso', 'text-bg-success');
    })
    .catch(error => {
        showLog('Erro ao tentar cadastrar o Tipo do produto', 'text-bg-danger');
    });

    name.value = '';
    await getProducts();
}

const showUpdateModalProduct = async (productId) => {
    const nameProductModal = document.getElementById("name-product-modal");
    const productModal = new bootstrap.Modal(document.getElementById('edit-product'));
    const saveEditModal = document.getElementById('save-edit-modal');
    const product = await getProduct(productId);


    saveEditModal.innerHTML = `<button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="updateProduct(${productId})">Salvar mudanças</button>`

    nameProductModal.value = product.data.name;
    productModal.show();
}

const updateProduct = async (productId) => {
    const nameProductModal = document.getElementById("name-product-modal");

    await fetch(`http://localhost:8080/type-product/${productId}/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name : nameProductModal.value,
        })
    })
    .then(response => response.json())
    .then(data => {
        showLog('Tipo do produto atualizado com sucesso', 'text-bg-success');
    })
    .catch(error => {
        showLog('Erro ao tentar atualizar o Tipo do produto', 'text-bg-danger');
    }); 

    await getProducts();
}

const getProduct = async (productId) => {
    let response = await fetch(`http://localhost:8080/type-product/${productId}/`);
    return await response.json();
}

const getProducts = async () => {
    let bodyTableProducts = document.getElementById("tbody-products");
    let newBody = '';
    let response = await fetch(`http://localhost:8080/type-product/`);
    response = await response.json();
    
    response.data.forEach(product => {
        newBody += `
            <tr>
                <th scope="row">${product.id}</th>
                <td>${product.name}</td>
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
