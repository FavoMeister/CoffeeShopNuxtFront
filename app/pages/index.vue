<template>
    <section class="bg-background text-text-dark font-cabin antialiased">
        <HeaderComponent />
    </section>
    <section>
        <div class="sticky-controls px-4 lg:px-8 pt-6 shadow-md">
            <div class="mb-4">
                <div class="relative">
                    <input
                        v-model="inputSearch"
                        type="text"
                        placeholder="Buscar producto por nombre o descripción..."
                        class="w-full p-3 border border-gray-300 rounded-xl pl-12 text-lg focus:ring-secondary focus:border-secondary transition duration-200 shadow-inner"
                    />
                    <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg"></i>

                </div>
            </div>

            <div class="bg-gray-lighter p-1 rounded-xl flex space-x-2 shadow-inner">
                <button
                v-for="tab in tabs"
                :key="tab.id"
                :class="['tab-button w-1/4 py-3 rounded-lg text-lg font-semibold transition duration-200', activeTab === tab.id ? 'active' : '']"
                @click="activeTab = tab.id"
                >
                <i :class="tab.icon +' mr-2'"></i> {{ tab.label }}
                </button>
            </div>

        </div>
    </section>

    <main class="container mx-auto px-4 pt-4">
        <div id="menu-display-container">
            <div class="mb-16">
                <h2 class="text-5xl font-bold text-primary mb-6 border-b-8 border-secondary/50 pb-4 flex items-center">
                   <i :class="currentTab?.icon +' mr-2'"></i> {{ currentTab?.label }}
                </h2>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div v-if="!loading" v-for="item in productsList" :key="item.id" class="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer 
                    hover:shadow-2xl hover:border-b-4 border-secondary transition duration-300 transform hover:-translate-y-1" @click="product=item">
                <img class="w-full h-48 object-cover" :src="item.imageUrl" :alt="item.category">
                <div class="p-5">
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="text-2xl font-bold text-text-dark">{{ item.name }}</h3>
                        <span class="text-4xl font-extrabold text-secondary flex-shrink-0 ml-4">
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
                    <p class="text-base text-gray-600">{{ item.description }}</p>
                </div>
            </div>

        </div>
    </main>
    <FooterComponent></FooterComponent>
</template>

<script setup>
    import '~/assets/index.css'
    import '~/composables/useRateLimit'
    import FooterComponent from '~/components/FooterComponent.vue';
    import HeaderComponent from '~/components/HeaderComponent.vue';
    import {ref, computed, onMounted, watch} from 'vue';
    import axios from 'axios'
    import { push } from 'notivue'

    const inputSearch = ref('')
    const tabs = ref([])
    const activeTab = ref('todo')
    const product = ref()

    const error = ref('')
    const loading = ref(false)
    const productsList = ref([])

    const originalProductsList = ref([]);

    const getProductList = async (url) =>{
        loading.value = true
        error.value = ''

        try {
            const { data } = await axios.get(url)
            productsList.value = data.data;
            originalProductsList.value = data.data;
            localStorage.setItem('productListBackup', JSON.stringify( data.data ));

        } catch (err) {
            push.error({title: 'Error', message: err.message, timeout: 8000})
        }finally{
            loading.value = false
        }
    }


    onMounted(()=>{
        tabs.value = [
            { id: 'todo', label: 'Todo el Menú', icon: 'fas fa-list-ul' },
            { id: 'bebidas', label: 'Bebidas', icon: 'fas fa-coffee' },
            { id: 'comidas', label: 'Comidas', icon: 'fas fa-hamburger' },
            { id: 'snacks', label: 'Snacks', icon: 'fas fa-cookie-bite' },
        ];
        const verifyRateLimit = useRateLimit('productList', 30000, 5)
        if(!verifyRateLimit()){
            originalProductsList.value = JSON.parse(localStorage.getItem('productListBackup'))
            push.warning({title: 'Muchas peticiones', message: "Demasiadas solicitudes, se cargó una copia de los datos."})
            return
        }

        getProductList(URL_BASE_API+'/api/v1/products')

    })

    const currentTab = computed(()=>{
        return tabs.value.find(t=> t.id === activeTab.value) || tabs.value[0]
    })

    watch(currentTab,(valor)=>{
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

    watch(inputSearch,(nuevoValor)=>{
        productsList.value = originalProductsList.value.filter(item=> item.name.toLowerCase().includes(nuevoValor.toLowerCase()))
    })
    /* export default {
        data(){
            return{
                activeTab: 'todo',
                tabs: [
                    { id: 'todo', label: 'Todo el Menú', icon: 'fas fa-list-ul' },
                    { id: 'bebidas', label: 'Bebidas', icon: 'fas fa-coffee' },
                    { id: 'comidas', label: 'Comidas', icon: 'fas fa-hamburger' },
                    { id: 'snacks', label: 'Snacks', icon: 'fas fa-cookie-bite' },
                ]
            }
        },
        computed:{
            currentTab(){
                return this.tabs.find(t=> t.id === this.activeTab ) || this.tabs[0]
            }
        }
    } */
</script>