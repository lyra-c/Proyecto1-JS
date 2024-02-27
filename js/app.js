// Variables
const carrito = document.querySelector('#carrito'); // Selecciona el id de 'carrito' para el <div> de carrito (cuadro emergente)
const contenedorCarrito = document.querySelector('#lista-carrito tbody'); // Selecciona el id de 'lista-carrito y el <tbody>
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); // Selecciona el elemento con 'vaciar-carrito' (en este caso, botón )
const listaCursos = document.querySelector('#lista-cursos'); // Es la sección para realizar los eventos y sus funciones
let articulosCarrito = [];  // Este array comienza vacío, porque se llenará al hacer clicks

// El HTML se irá introduciendo de forma dinámica en el <tbody>


// Event Listeners

cargarEventListeners(); //  cargarEventListeners() tiene anidada la función "agregarCurso()"; agregarCurso() anida "leerDatosCurso()"
function cargarEventListeners() {
    // Cuando se agrega un curso presionando "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];  // Para resetear el array

        limpiarHTML();  // Para eliminar todo el HTML
    })
};
// Para los event listeners siempre conviene definir una función a ejecutarse, anónima o externa


// Funciones
function agregarCurso(e) {
    e.preventDefault(); // Para evitar que se ejecute la solicitud HTTP al presionar el <a>, que actúa como enlace
    // En bootstrap, los botones POST se diferencian de los GET en que los POST tienen preventDefault para no redireccionar

    if( e.target.classList.contains('agregar-carrito') ) {  // Para identificar que se presionó el botón de agregar-carrito
        // console.log('Agregando al carrito...');  // Para identificar que el if se ejecuta
        const cursoSeleccionado = e.target.parentElement.parentElement; // permite acceder a etiquetas más previas del conjunto
        leerDatosCurso(cursoSeleccionado); // Se ejecuta la función leerDatosCurso(), que usa como parámetro el curso seleccionado
    } 
}
// El acceso a las etiquetas más previas/padres sirve para luego poder mostrar la sección que 
// lo contiene (elementos de card en este caso). Es necesario visualizar el código para saber
// cuántas veces emplear .parentElement para acceder a divisiones previas


// Eliminar un curso del carrito
function eliminarCurso(e) {
    // console.log(e.target.classList); // Permite conocer la clase del elemento clickeado
    if(e.target.classList.contains('borrar-curso')) {
        // console.log(e.target.getAttribute('data-id')); // Para obtener el atributo correspondiente al id al clickear
        const cursoId = e.target.getAttribute('data-id');

        // Eliminar del array articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );
        
        // Mostrar el HTML actualizado luego de haber borrado

        carritoHTML(); // Para iterar sobre el carrito y mostrar su HTML
    }
};


// Lee el contenido del HTML al que se le dio click, y extrae la información del curso
function leerDatosCurso(curso) {
    console.log(curso);

    // Creando un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'), // 'data-id' no es ni tag, ni class, ni id, es atributo, se usa .getAttribute
        cantidad: 1 
            // La cantidad es para emplear como "contador" de veces que se selecciona el elemento, porque puede seleccionarse más de 1
    }

    // Revisa si un elemento ya existe en el carrito al momento de agregar, y lo hace iterando cada 'curso'
    // En este caso, se itera el id de cada objeto (curso.id), y compara con el curso que se está agregando (infoCurso.id)
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id );
    if (existe) {
        // Se actualiza la cantidad (Se usa return porque .map sólo itera, y no devuelve un nuevo array)
        const cursos = articulosCarrito.map( curso => {
            if( curso.id === infoCurso.id ) {
                curso.cantidad++;   // Modifica el valor curso.cantidad del curso existente
                return curso; // Retorna el objeto actualizado
            } else {
                return curso; // Retorno los objetos que no son los duplicados
            }
        } );
        articulosCarrito = [...cursos]; // cursos corresponde a los objetos con su cantidades actualizadas
        // Se define la cantidad de veces que está seleccionado el curso. De esta manera no se duplica su entrada en el HTML,
        // y se modifica la 'cantidad'
    } else {
        // Se agrega el curso al carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    
    // Agregar elementos al arreglo de articulosCarrito cuando se clickea el botón
    // articulosCarrito = [...articulosCarrito, infoCurso];
    // Se comienza con el mismo arreglo porque cada vez se añadirán más elementos, y de esta forma no se pierden los anteriores
    console.log(articulosCarrito);
    // En un inicio, se mostrará el arreglo con lo nuevo y lo antiguo, dando una impresión de que la entrada está duplicada,
    // por lo que hay que limpiar el HTML previo

    carritoHTML();
}
// La información que se quiere extraer finalmente de esta función, es la establecida en el objeto infoCurso


// Mostrar el carrito de compras en el HTML
// Se itera sobre articulosCarrito, que es el arreglo que contiene todos los objetos de los cursos,
// haciendo que de esta manera se transiciona el leer la selección, a traspasarlo visualmente al HTML
// Se crea la variable row para que corresponda a la sección HTML a mostrar
function carritoHTML() {

    // Limpiar el HTML
    limpiarHTML();

    articulosCarrito.forEach( curso => {
        // Aplicando destructuring para mejorar el código, y no tener que escribir 'curso' para acceder a 
        // cada propiedad de cada objeto
        const { imagen, titulo, precio, cantidad, id } = curso;

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>
            <img src="${imagen}" width="100" >
        </td>
        <td> ${titulo} </td>
        <td> ${precio} </td>
        <td> ${cantidad} </td>
        <td> 
            <a href="#" class="borrar-curso" data-id="${id}" > X </a>
        </td>
        `;

        // Agregar el HTML del carrito en el tbody, insertándolo como la variable 'row' con .appendChild
        contenedorCarrito.appendChild(row);
    })
}
// Como la sección que muestra todos los cursos seleccionados es un <tbody>, hay que insertarle 

// Eliminar los cursos duplicados del tbody (para limpiar el HTML)
// Cada vez que se agrega un curso a la lista, se borra la lista anterior completa gracias al string
// vacío en esta función, de manera que consigue limpiar el HTML para no mostrar duplicados en la lista
function limpiarHTML() {
    // Forma lenta
    // contenedorCarrito.innerHTML = '';

    // Forma rápida
    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    };
    // Elimina elementos 'row' del carrito hasta que esté vacío, y de esta manera limpia el HTML
};

