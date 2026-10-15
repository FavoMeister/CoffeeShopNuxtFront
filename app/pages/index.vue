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
    <FooterComponent></FooterComponent>
</template>

<script>
    import '~/assets/index.css'
    import FooterComponent from '~/components/FooterComponent.vue';
    import HeaderComponent from '~/components/HeaderComponent.vue';

    export default {
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
        }
    }
</script>