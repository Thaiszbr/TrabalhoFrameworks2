<template>
  <v-container style="margin-top: 250px">
      <v-data-table-server v-model:items-per-page="itemsPerPage" :headers="headers" :items="serverItems"
          :items-length="totalItems" :loading="loading" :search="search" item-value="name"
          @update:options="loadItems">
          <template v-slot:top>
              <v-toolbar flat>
                  <v-toolbar-title>
                      Controle de Flores
                  </v-toolbar-title>
                  <v-toolbar-items>
                      <v-btn @click="addFlower">Adicionar</v-btn>
                  </v-toolbar-items>
              </v-toolbar>
              <v-container>
                  <v-text-field v-model="searchName" label="Pesquisar..." variant="underlined"></v-text-field>
              </v-container>
          </template>
          <template v-slot:item.action="{ item }">
              <v-btn icon="mdi-pencil" @click="editFlower(item)" class="mr-2" />
              <v-btn icon="mdi-delete" @click="remove(item.uuid)" />
          </template>
      </v-data-table-server>
  </v-container>

  <v-dialog v-model="dialog" max-width="600">
      <v-card>
          <v-card-title>Detalhes da Flor</v-card-title>
          <v-card-text>
              <v-text-field label="Nome" v-model="flower.name" />
              <v-text-field label="Espécie" v-model="flower.species" />
              <v-text-field label="Cor" v-model="flower.color" />
              <v-text-field label="Preço por Unidade" v-model="flower.price_per_unit" type="number" />
          </v-card-text>
          <v-card-actions>
              <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
              <v-spacer />
              <v-btn color="primary" @click="save">Salvar</v-btn>
          </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce';

const flower = ref({}); // Substituindo house por flower
const itemsPerPage = ref(10);
const page = ref(1);
const sortBy = ref([]);
const dialog = ref(false);
const headers = ref([
  { title: 'Nome', key: 'name' },
  { title: 'Espécie', key: 'species' },
  { title: 'Cor', key: 'color' },
  { title: 'Preço por Unidade', key: 'price_per_unit' },
  { title: 'Ações', key: 'action', sortable: false },
]);
const serverItems = ref([]);
const totalItems = ref(0);
const loading = ref(false);
const search = ref('');
const searchName = ref('');

const loadItems = async (options) => {
  loading.value = true;
  let url = 'http://localhost:5000/flowers?1';
  if (options) {
      page.value = options.page;
      sortBy.value = options.sortBy;
      if (options.sortBy.length > 0) {
          url += '&sortKey=' + options.sortBy[0].key;
          url += '&sortOrder=' + options.sortBy[0].order;
      }
      if (options.search.length > 0) {
          url += '&search=' + options.search;
      }
      url += '&page=' + options.page || 1;
      url += '&limit=' + options.itemsPerPage || itemsPerPage.value;
  }
  const response = await fetch(url);
  const result = await response.json();
  serverItems.value = result.data;
  totalItems.value = result.total;
  loading.value = false;
}

watch(searchName, debounce(() => {
  search.value = searchName.value;
}, 500));

const remove = async (uuid) => {
  await fetch('http://localhost:5000/flowers/' + uuid, { method: 'DELETE' });
  loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value, search: searchName.value });
}

const save = () => {
  const method = flower.value.uuid ? 'PUT' : 'POST';
  const url = method === 'PUT' ? `http://localhost:5000/flowers/${flower.value.uuid}` : 'http://localhost:5000/flowers';

  fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flower.value),
  })
  .then(() => {
      flower.value = {};
      dialog.value = false;
      loadItems({ page: page.value, itemsPerPage: itemsPerPage.value, sortBy: sortBy.value, search: searchName.value });
  })
  .catch(error => console.log(error));
}

// Função para editar uma flor específica
const editFlower = (item) => {
  flower.value = { ...item };
  dialog.value = true;
}

// Função para adicionar uma nova flor
const addFlower = () => {
  flower.value = { name: '', species: '', color: '', price_per_unit: '' }; // Inicializa com campos vazios
  dialog.value = true;
}
</script>
