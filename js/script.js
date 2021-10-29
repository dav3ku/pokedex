var pokemonList = document.querySelector("#pokemon-list"); // El grid de cards.
var modalList = document.querySelector("#modals"); // El DIV donde estaran los modales.
var modalResults = document.querySelector("#modal-results"); // El DIV donde estara el modal de busqueda por nombre.
const LOADING = document.querySelector(".loading"); // El Loading.
var numElementsForPage = 100; // numero de pokemones por pagina.
var gPage = 1; // pagina actual.

function loadPokemon(use) {
  // Carga de pokemones en el grid para uso normal o filtro.
  let urlUse = ""; // Url para uso normal o filtro.
  let offset = 0; // Comerzar a cargar apartir de que ID.

  if (gPage != 1) {
    // Si no es la primera pagina, se calcula el offset.
    offset = (gPage - 1) * numElementsForPage;
  }

  let urlNormal = `https://pokeapi.co/api/v2/pokemon?limit=${numElementsForPage}&offset=${offset}`;
  // URL para uso normal.

  // let urlFiltro = `https://pokeapi.co/api/v2/type/${use}`;
  // URL para uso con filtro.

  if (use == "normal") {
    urlUse = urlNormal;
  } else {
    urlUse = urlFiltro;
  }

  getData(urlUse).then((data) => {
    // Se obtiene la data.
    pagination(data.count); // Se calcula y colocan la cantidad de paginas.
    let pokemons = data.results; // Se obtiene la lista de pokemones.
    for (let i = 0; i < pokemons.length; i++) {
      // Se recorre la lista de pokemones.
      let item = getData(pokemons[i].url); // Se obtiene los datos de cada pokemon.
      item
        .then((data) => {
          const element = `
              <div class="col-sm-4 col-md-3 col-lg-2">
                <div class="card" id="pokemon-card" data-bs-toggle="modal" data-bs-target="#pokemon${
                  data.id
                }">
                  <img src="${
                    data.sprites.other.home.front_default
                  }" class="card-img-top" alt="${data.id} - ${data.name}">
                  <div class="card-body text-center">
                    <h5 class="card-title">${data.name}</h5>
                  </div>
                </div>
              </div>
            `; // Se crea el elemento card con los datos del pokemon.
          pokemonList.innerHTML += element; // Se agrega el elemento al grid.

          const modal = `
            <div class="modal fade" id="pokemon${data.id}" tabindex="-1" aria-labelledby="${data.name}" aria-hidden="true">
              <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="${data.name}">${data.name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="container">
                      <div class="row">
                        <div class="col-sm-1 col-md-4">
                          <img src="${data.sprites.other.home.front_default}" class="img-modal" alt="${data.id} - ${data.name}">
                        </div>
                        <div class="col-sm-1 col-md-8">
                          <div id="types-${data.id}"></div>
                          <div id="stats-${data.id}"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          `; // Se crea el elemento modal con los datos del pokemon.
          modalList.innerHTML += modal; // Se agrega el elemento al grid.

          let types = document.querySelector(`#types-${data.id}`); // Se selecciona el elemento para agregar los tipos.
          for (let i = 0; i < data.types.length; i++) {
            let element = `
              <span class="badge ${data.types[i].type.name}">${data.types[i].type.name}</span>
            `; // Se crea el elemento para agregar los tipos.
            types.innerHTML += element; // Se agrega el elemento al grid.
          }

          let stats = document.querySelector(`#stats-${data.id}`); // Se selecciona el elemento para agregar las estadisticas.
          for (let i = 0; i < data.stats.length; i++) {
            let element = `
            <h6>${data.stats[i].stat.name}</h6>
            <div class="progress" style="height: 15px;">
              <div class="progress-bar" role="progressbar" style="width: ${data.stats[i].base_stat}%;" aria-valuenow="${data.stats[i].base_stat}" aria-valuemin="0" aria-valuemax="100">${data.stats[i].base_stat} pts.</div>
            </div>
            `; // Se crea el elemento para agregar las estadisticas.
            stats.innerHTML += element; // Se agrega el elemento al grid.
          }
        })
        .catch((err) => console.error(err)); // Se captura el error.
    }
  });
  setTimeout(() => {
    // Se espera a que se carguen los datos.
    LOADING.classList.remove("visible");
    LOADING.classList.add("invisible");
  }, 5000);
}

async function getData(url) {
  // funcion para obtener datos de la API.
  let response = await fetch(url); // Se obtiene la respuesta de la API.
  let data = await response.json(); // Se convierte la respuesta en JSON.
  return data; // Se retorna la data.
}

function pagination(count) {
  // Funcion para crear la paginacion, recibe la cantidad de pokemones.
  let pagination = document.querySelector("#pagination"); // Se selecciona el elemento para agregar la paginacion.
  let pages = Math.ceil(count / numElementsForPage); // Se calcula la cantidad de paginas.
  pagination.innerHTML = ""; // Se limpia el elemento.
  for (let i = 1; i <= pages; i++) {
    let element = "";

    if (i == gPage) {
      // si la pagina es la actual.
      element = `
      <li class="page-item disabled">
        <a class="page-link" href="#" onClick="changePage(${i})" data-page="${i}">${i}</a>
      </li>
    `; // Se crea el elemento para la pagina actual deshabilitado.
    } else {
      // si la pagina no es la actual.
      element = `
        <li class="page-item">
          <a class="page-link" href="#" onClick="changePage(${i})" data-page="${i}">${i}</a>
        </li>
      `; // Se crea el elemento para la pagina habilitado.
    }
    pagination.innerHTML += element; // Se agrega el elemento al grid.
  }
}

function changePage(page) {
  // Funcion para cambiar de pagina.
  LOADING.classList.remove("invisible");
  LOADING.classList.add("visible");
  pokemonList.innerHTML = ""; // Se limpia el grid de cards pokemones.
  modalList.innerHTML = ""; // Se limpia el grid de modales.
  gPage = page; // Se actualiza la pagina global actual.
  loadPokemon("normal"); // Se cargan los pokemones normal.
}

function searchByName() {
  // Funcion para buscar pokemones por nombre.
  LOADING.classList.remove("invisible");
  LOADING.classList.add("visible");
  let search = document.querySelector("#search");
  let name = search.value.toLowerCase(); // Se selecciona el elemento para obtener el nombre.
  let url = `https://pokeapi.co/api/v2/pokemon/${name}`; // Se crea la url para la busqueda.
  modalResults.innerHTML = ""; // Se limpia el grid de resultados.
  let sPokemon = getData(url); // Se obtiene la data de la API.
  sPokemon
    .then((data) => {
      const modal = `
            <div class="modal fade" id="seachPokemon${data.id}" tabindex="-1" aria-labelledby="${data.name}" aria-hidden="true">
              <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="${data.name}">${data.name} - id: ${data.id}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="container">
                      <div class="row">
                        <div class="col-sm-1 col-md-4">
                          <img src="${data.sprites.other.home.front_default}" class="img-modal" alt="${data.id} - ${data.name}">
                        </div>
                        <div class="col-sm-1 col-md-8">
                          <div id="searchTypes${data.id}"></div>
                          <div id="searchStats-${data.id}"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          `; // Se crea el elemento para agregar el modal.
      modalResults.innerHTML += modal; // Se agrega el elemento al div.

      let types = document.querySelector(`#searchTypes${data.id}`); // Se selecciona el elemento para agregar los tipos.
      for (let i = 0; i < data.types.length; i++) {
        let element = `
              <span class="badge ${data.types[i].type.name}">${data.types[i].type.name}</span>
            `; // Se crea el elemento para agregar los tipos.
        types.innerHTML += element; // Se agrega el elemento al modal.
      }

      let stats = document.querySelector(`#searchStats-${data.id}`); // Se selecciona el elemento para agregar las estadisticas.
      for (let i = 0; i < data.stats.length; i++) {
        let element = `
            <h6>${data.stats[i].stat.name}</h6>
            <div class="progress" style="height: 15px;">
              <div class="progress-bar" role="progressbar" style="width: ${data.stats[i].base_stat}%;" aria-valuenow="${data.stats[i].base_stat}" aria-valuemin="0" aria-valuemax="100">${data.stats[i].base_stat} pts.</div>
            </div>
            `; // Se crea el elemento para agregar las estadisticas.
        stats.innerHTML += element; // Se agrega el elemento al modal.
      }
      let result = new bootstrap.Modal(
        document.getElementById(`seachPokemon${data.id}`),
        {
          keyboard: false,
        }
      ); // Se seleccional el elemento modal.
      result.show(); // Se muestra el modal.
      setTimeout(() => {
        // Se espera a que se carguen los datos.
        LOADING.classList.remove("visible");
        LOADING.classList.add("invisible");
      }, 3000);
      search.value = ""; // Se limpia el input.
    })
    .catch(() => {
      const modal = `
            <div class="modal fade" id="seachPokemon" tabindex="-1" aria-labelledby="searchPokemon" aria-hidden="true">
              <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="noEncontrado">Sin registros</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="container">
                      <div class="row">
                        <div class="col-sm-12">
                          <img src="images/maxresdefault.jpg" class="img-modal" alt="sin registros">
                        </div>
                        <div class="col-sm-12">
                          <h3>No se encontraron registros</h3>
                          <h6>Al parecer aun no tenemos registro de este pokemon.</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          `; // Se crea el elemento para agregar el modal.
      modalResults.innerHTML += modal; // Se agrega el elemento al div.

      let result = new bootstrap.Modal(
        document.getElementById(`seachPokemon`),
        {
          keyboard: false,
        }
      ); // Se seleccional el elemento modal.
      result.show(); // Se muestra el modal.
      search.value = ""; // Se limpia el input.

      setTimeout(() => {
        // Se espera a que se carguen los datos.
        LOADING.classList.remove("visible");
        LOADING.classList.add("invisible");
      }, 3000);
    });
}

loadPokemon("normal"); // Se cargan los pokemones normal.
