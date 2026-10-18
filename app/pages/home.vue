<template>
    <main class="bg-background text-text-dark font-cabin antialiased">

        <header class="sticky-header bg-primary text-white h-16 flex items-center justify-between px-4 lg:px-8">
            <div class="flex items-center space-x-2">
                <i class="fas fa-mug-hot text-xl text-secondary"></i>
                <span class="text-2xl font-bold tracking-wider">CAFÉ ORDEN</span>
            </div>

            <div class="flex items-center space-x-4">
                <div class="relative group hidden lg:block">
                    <!-- Botón del Usuario -->
                    <div
                        class="flex items-center cursor-pointer p-2 rounded-lg hover:bg-primary/80 transition duration-150">
                        <img class="w-8 h-8 rounded-full mr-2"
                            src="https://ui-avatars.com/api/?name=C&amp;background=48D1CC&amp;color=fff&amp;size=32"
                            alt="Avatar">
                        <span class="text-sm">{{ user?.fullName }}</span>
                        <i class="fas fa-caret-down ml-2 text-secondary"></i>
                    </div>

                    <!-- Contenedor con pt-2 para no romper el hover -->
                    <div class="absolute right-0 pt-2 w-40 hidden group-hover:block z-50">
                        <div class="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                            <a href="#"
                                class="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100 transition duration-150">
                                <i class="fas fa-user mr-2"></i> Mi Perfil
                            </a>
                            <a href="#" @click.prevent="logOut"
                                class="block px-4 py-2 text-sm text-text-dark hover:bg-gray-100 transition duration-150">
                                <i class="fas fa-sign-out-alt mr-2"></i> Salir
                            </a>
                        </div>
                    </div>
                </div>

                <button class="flex items-center space-x-1 p-2 rounded-lg bg-secondary lg:hidden"
                    onclick="alert('Ver carrito completo')">
                    <i class="fas fa-shopping-cart text-white"></i>
                    <span id="cart-count" class="text-white text-xs font-bold">0</span>
                </button>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-4 min-h-screen">

            <div class="lg:col-span-3">

                <div class="sticky-controls px-4 lg:px-8">
                    <div class="mb-4 pt-2">
                        <div class="relative">
                            <input type="text" v-model="inputSearch" placeholder="Buscar producto por nombre..."
                                class="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-secondary focus:border-secondary transition duration-200">
                            <i
                                class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                    </div>

                    <div class="bg-gray-lighter p-1 rounded-xl flex space-x-1 shadow-inner">
                        <button v-for="tab in tabs" :key="tab.id"
                            :class="['tab-button w-1/4 py-3 rounded-xl text-sm font-medium transition duration-200 text-text-dark', activeTab === tab.id ? 'active' : '']"
                            @click="activeTab = tab.id"> <i :class="tab.icon + ' mr-1'"></i> {{ tab.label }}</button>
                    </div>
                </div>

                <div id="menu-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-8 pt-0">
                    <div v-if="loading" v-for="n in 6" :key="n"
                        class="p-4 bg-gray-200 rounded-lg shadow-sm animate-pulse border border-gray-300 flex flex-col justify-between">

                        <div class="flex items-start space-x-4 mb-3">
                            <div class="w-16 h-16 bg-gray-300 rounded-full"></div>

                            <div class="flex-grow min-w-0 space-y-2">
                                <div class="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div class="h-3 bg-gray-300 rounded w-1/2"></div>
                            </div>
                        </div>

                        <div class="h-8 bg-gray-300 rounded"></div>
                    </div>

                    <div v-if="!loading" v-for="item in productsList" :key="item.id"
                        class="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200 border border-gray-100 flex flex-col justify-between">

                        <div class="flex items-start space-x-4 cursor-pointer mb-3" @click="product = item">
                            <img class="w-16 h-16 object-cover rounded-full flex-shrink-0 border-2 border-gray-200"
                                :src="item.imageUrl" alt="Americano">

                            <div class="flex-grow min-w-0">
                                <div class="flex justify-between items-start w-full">
                                    <p class="text-sm font-semibold text-text-dark">{{ item.name }}</p>
                                    <span class="text-md font-bold text-secondary flex-shrink-0 ml-4">
                                        {{
                                            new Intl.NumberFormat('es-BO', {
                                                style: 'currency',
                                                currency: 'BOB',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            }).format(item.price)
                                        }}
                                    </span>
                                </div>
                                <p class="text-xs text-gray-500 truncate">{{ item.description }}...</p>
                            </div>
                        </div>

                        <button @click="agregarProducto(item)"
                            class="w-full bg-secondary text-white py-1.5 rounded-lg text-sm font-semibold hover:bg-primary transition duration-200">
                            <i class="fas fa-plus mr-1"></i> Añadir Rápido
                        </button>

                    </div>



                </div>
            </div>

            <div
                class="hidden lg:block lg:col-span-1 bg-white border-l border-gray-100 shadow-xl p-6 flex flex-col cart-sidebar no-scrollbar">
                <h2 class="text-2xl font-bold text-primary border-b pb-2 mb-4 text-center">
                    <i class="fas fa-shopping-cart mr-2 text-secondary"></i> TU PEDIDO
                </h2>

                <ul id="cart-items" class="flex-grow overflow-y-auto mb-6 space-y-2">
                </ul>

                <div class="mt-auto pt-4 border-t border-gray-200">
                    <div class="flex justify-between items-center mb-4 text-lg font-semibold">
                        <span>Total:</span>
                        <span id="cart-total" class="text-2xl font-bold text-secondary">Bs 0</span>
                    </div>

                    <button
                        class="w-full bg-secondary text-white py-3 rounded-lg text-lg font-bold hover:bg-primary transition duration-200 shadow-lg"
                        onclick="alert('¡Pedido enviado! Total: ' + document.getElementById('cart-total').innerText)">
                        <i class="fas fa-check mr-2"></i> Confirmar Pedido
                    </button>
                </div>
            </div>
        </div>

        <div id="product-modal" v-if="product"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-12">
            <div class="bg-white rounded-lg max-w-lg w-full overflow-hidden shadow-2xl">
                <div class="relative">
                    <img id="modal-image" class="w-full h-64 object-cover" :src="product.imageUrl"
                        alt="Imagen del Producto">
                    <button @click="product = null"
                        class="absolute top-3 right-3 bg-white rounded-full p-2 text-primary hover:bg-gray-200">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="p-6">
                    <h3 id="modal-title" class="text-3xl font-bold text-primary mb-2">{{ product.name }}</h3>
                    <p id="modal-description" class="text-gray-600 mb-6">{{ product.description }}</p>

                    <div class="flex justify-between items-center mb-6 border-t pt-4">
                        <span id="modal-price" class="text-3xl font-bold text-secondary">
                            {{
                                new Intl.NumberFormat('es-BO', {
                                    style: 'currency',
                                    currency: 'BOB',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(product.price)
                            }}
                        </span>

                        <div class="flex items-center space-x-3">
                            <label for="modal-quantity" class="text-primary font-semibold">Cantidad:</label>
                            <input type="number" v-model="modalQuantity" id="modal-quantity" min="1" max="10"
                                class="w-16 p-2 border border-gray-300 rounded-lg text-center focus:ring-secondary focus:border-secondary">
                        </div>
                    </div>

                    <button @click="agregarProducto(product)" id="modal-add-button"
                        class="w-full bg-secondary text-white py-3 rounded-lg text-lg font-bold hover:bg-primary transition duration-200">
                        <i class="fas fa-plus mr-2"></i> Añadir al Pedido
                    </button>
                </div>
            </div>
        </div>



    </main>

    <FooterComponent/>
</template>

<script setup>
definePageMeta({
    middleware: 'auth'
})
import '~/assets/css/home.css'
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { push } from 'notivue';
import FooterComponent from '~/components/FooterComponent.vue';

const inputSearch = ref('')
const tabs = ref([])
const activeTab = ref('todo')

const user = ref()
const error = ref('')

const token = ref({
    token: '',
    token_type: ''
})
const loading = ref(true)
const product = ref()
const modalQuantity = ref(1)
const customerName = ref()
const discount = ref()
const productsList = ref([])

const originalProductsList = ref([])

const getProductList = async (url) => {
    loading.value = true
    error.value = ''

    try {
        const { data } = await axios.get(url)
        productsList.value = data.data
        originalProductsList.value = data.data
        localStorage.setItem('productListBackup', JSON.stringify(data.data))

    } catch (err) {
        push.error({ title: 'Error', message: err.message, timeout: 8000 })
    } finally {
        loading.value = false
    }
}

const logOut = async () => {
    loading.value = true
    error.value = ''
    console.log(token.value.token);
    try {
        await axios.post(
            URL_BASE_API + '/api/v1/account/logout',
            {},
            {
                headers: {
                    Authorization: `${token.value.token_type} ${token.value.token}`
                }
            }
        )
        localStorage.clear()
        return navigateTo({ path: '/' })

    } catch (err) {
        push.error({ title: 'Error', message: err.message, timeout: 8000 })
        return navigateTo({ path: '/auth' })
    } finally {
        localStorage.clear()
        loading.value = false

        window.location.href = '/'
    }
}

onMounted(() => {
    const storedUser = localStorage.getItem('user')
    try {
        user.value = storedUser && storedUser !== 'undefined' ? JSON.parse(storedUser) : {}
    } catch (e) {
        user.value = {}
    }

    token.value.token = localStorage.getItem('token') || ''
    token.value.token_type = localStorage.getItem('token_type') || ''
    tabs.value = [
        { id: 'todo', label: 'Todo el Menú', icon: 'fas fa-list-ul' },
        { id: 'bebidas', label: 'Bebidas', icon: 'fas fa-coffee' },
        { id: 'comidas', label: 'Comidas', icon: 'fas fa-hamburger' },
        { id: 'snacks', label: 'Snacks', icon: 'fas fa-cookie-bite' },
    ];

    const verifyRateLimit = useRateLimit('productList', 30000, 5)
    if (!verifyRateLimit()) {
        originalProductsList.value = JSON.parse(localStorage.getItem('productListBackup'))
        push.warning({ title: 'Muchas peticiones', message: "Demasiadas solicitudes, se cargó una copia de los datos." })
        loading.value = false
        return
    }
    getProductList(URL_BASE_API + '/api/v1/products')

})

const currentTab = computed(() => {
    return tabs.value.find(t => t.id === activeTab.value) || tabs.value[0]
})

watch(currentTab, (valor) => {
    switch (valor.id) {
        case 'bebidas':
            productsList.value = originalProductsList.value.filter(item => item.category === 'Hot Drinks')
            break;
        case 'comidas':
            productsList.value = originalProductsList.value.filter(item => item.category === 'Food')
            break;
        case 'snacks':
            productsList.value = originalProductsList.value.filter(item => item.category === 'Snacks')
            break;
        default:
            productsList.value = originalProductsList.value
            break;
    }
})

watch(inputSearch, (nuevoValor) => {
    productsList.value = originalProductsList.value.filter(item => item.name.toLowerCase().includes(nuevoValor.toLowerCase()))
})


const agregarProducto = (productoNuevo) => {

    const cantidadModal = modalQuantity.value

    const itemExistente = order.value.find(item => item.id === productoNuevo.id);

    if (itemExistente) {
        itemExistente.quantity += cantidadModal;
    } else {
        order.value.push({
            ...productoNuevo,
            quantity: cantidadModal
        });
    }
    modalQuantity.value = 1
    product.value = null
};

const eliminarProducto = (productoId) => {
    const index = order.value.findIndex(item => item.id === productoId);
    if (index !== -1) {
        order.value.splice(index, 1);
    }
};
</script>