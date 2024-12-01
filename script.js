


class Nodo { // Aqui creamos una clase Nodo para el árbol binario, con propiedades para la edad y el nivel.
    constructor(edad, ingreso) {
        this.edad = edad; // Edad del cliente
        this.ingreso = ingreso;  // Nivel de ingreso (Alto, Medio, Bajo)
        this.izquierda = null; // Hijo izquierdo del nodo
        this.derecha = null; // Hijo izquierdo del nodo
    }
}

class ArbolBinario {
    constructor() {
        this.raiz = null; // Inicializa el árbol vacío, sin raíz.
    }
    insertar(edad, ingreso) {
        const nuevoNodo = new Nodo(edad, ingreso); // Crea un nuevo nodo.
        if (this.raiz === null) {
            this.raiz = nuevoNodo; // Si no hay raíz, el nuevo nodo se convierte en la raíz.
        } else {
            this._insertarRecursivo(this.raiz, nuevoNodo); // Inserta el nodo recursivamente.
        }
    }
    _insertarRecursivo(actual, nuevoNodo) {
        if (nuevoNodo.edad < actual.edad) {
            // Si la edad del nuevo nodo es menor, va al subárbol izquierdo.
            if (actual.izquierda === null) {
                actual.izquierda = nuevoNodo;  // Si no hay nodo izquierdo, lo asigna.
            } else {
                this._insertarRecursivo(actual.izquierda, nuevoNodo); // Recurre al siguiente nodo izquierdo.
            }
        } else {
             // Si la edad es mayor o igual, va al subárbol derecho.
            if (actual.derecha === null) {
                actual.derecha = nuevoNodo; // Si no hay nodo derecho, lo asigna.
            } else {
                this._insertarRecursivo(actual.derecha, nuevoNodo); // Recurre al siguiente nodo derecho.
            }
        }
    }
    clasificarCliente(edad, ingreso) {
        return this._clasificarRecursivo(this.raiz, edad, ingreso); // Clasifica cliente recursivamente.
    }
    _clasificarRecursivo(nodo, edad, ingreso) {
        if (nodo === null) {
            return "No se encontró clasificación"; // Si llega a un nodo vacío, no hay clasificación.
        }
        if (edad < nodo.edad) {
            return this._clasificarRecursivo(nodo.izquierda, edad, ingreso); // Busca en el subárbol izquierdo.
        } else if (edad > nodo.edad){
            return this._clasificarRecursivo(nodo.derecha, edad, ingreso); // Busca en el subárbol derecho.
        } else {
            // Clasificación en base a la edad y el ingreso.
            if (edad < 30) {
                return ingreso === "Alto" ? "Compra" : "No compra";
            } else if (edad >= 30 && edad < 40) {
                return ingreso === "Bajo" ? "No compra" : "Compra";
            } else {
                return "Compra";
            }
        }
    }
    // Visualización del gráfico
    generarGrafico() { // Se crea los nodos y relaciones para representar el árbol gráficamente usando la biblioteca vis.js
        let nodes = [];
        let edges = [];
        const recorrer = (nodo, parentId = null) => {
            if (nodo === null) return;
            const id = `${nodo.edad}-${nodo.ingreso}`; // Identificador único del nodo.
            nodes.push({ id, label: `${nodo.edad} (${nodo.ingreso})` }); // Nodo visual con etiqueta.
            if (parentId !== null) {
                edges.push({ from: parentId, to: id }); // Relación entre nodos.
            }
            recorrer(nodo.izquierda, id); // Recorre subárbol izquierdo.
            recorrer(nodo.derecha, id); // Recorre subárbol derecho.
        };
        recorrer(this.raiz);
        const data = {
            nodes: new vis.DataSet(nodes), // Datos de los nodos.
            edges: new vis.DataSet(edges) // Datos de las relaciones.
        };
        const options = {
            layout: {
                hierarchical: {
                    direction: 'UD', // Dirección del gráfico (de arriba a abajo).
                    sortMethod: 'directed' // Método de ordenamiento.
                }
            },
            edges: {
                arrows: 'to' // Flechas en las conexiones.
            }
        };
        const container = document.getElementById('grafico'); // Contenedor HTML para el gráfico.
        new vis.Network(container, data, options); // Crea el gráfico usando la biblioteca `vis.js`.
    }
    eliminar(edad) {
        this.raiz = this._eliminarRecursivo(this.raiz, edad);  // Llama recursivamente a la función de eliminación.
    }
    _eliminarRecursivo(nodo, edad) {
        if (nodo === null) return null; // Si no hay nodo, retorna null.
        if (edad < nodo.edad) {
            nodo.izquierda = this._eliminarRecursivo(nodo.izquierda, edad); // Busca en el subárbol izquierdo.
        } else if (edad > nodo.edad) {
            nodo.derecha = this._eliminarRecursivo(nodo.derecha, edad); // Busca en el subárbol derecho.
        } else {
            // Nodo encontrado
            if (nodo.izquierda === null) return nodo.derecha; // Nodo con un solo hijo o sin hijos.
            if (nodo.derecha === null) return nodo.izquierda;
            // Nodo con dos hijos: encuentra el menor del subárbol derecho.
            const minNodo = this._encontrarMinimo(nodo.derecha);
            nodo.edad = minNodo.edad;
            nodo.ingreso = minNodo.ingreso;
            nodo.derecha = this._eliminarRecursivo(nodo.derecha, minNodo.edad); // Elimina el sucesor.
        }
        return nodo;
    }
    _encontrarMinimo(nodo) {
        while (nodo.izquierda !== null) {
            nodo = nodo.izquierda; // Encuentra el nodo más pequeño en el subárbol izquierdo.
        }
        return nodo;
    }
}

// Crear un árbol binario de ejemplo
const arbol = new ArbolBinario();
const clientes = [
    [50, "Alto"],
];
    
clientes.forEach(cliente => arbol.insertar(cliente[0], cliente[1]));

function agregarFilaATabla(edad, ingreso) {
    const tabla = document.getElementById("tablaDatos");
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
        <td>${edad}</td>
        <td>${ingreso}</td>
        <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">Eliminar</button><br>
            <button type="button" id="editarFila" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar datos</button>
        </td>
    `;
    tabla.appendChild(nuevaFila);
}

function eliminarFila(boton) {
    // Eliminar la fila de la tabla
    const fila = boton.parentElement.parentElement;
    const edad = parseInt(fila.cells[0].textContent); // Obtener la edad de la fila eliminada
    // Eliminar el nodo correspondiente del árbol
    arbol.eliminar(edad);
    // Eliminar la fila de la tabla
    fila.remove();
    // Regenerar el gráfico actualizado
    arbol.generarGrafico();
}

document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault(); // Previene el comportamiento por defecto del formulario.
    
    const edad = parseInt(document.getElementById("edad").value); // Obtiene la edad.
    const ingreso = document.getElementById("ingreso").value; // Obtiene el ingreso.
    // Insertar el dato en el árbol
    arbol.insertar(edad, ingreso);
    // Clasificar el cliente y mostrar el resultado
    const resultado = arbol.clasificarCliente(edad, ingreso);
    document.getElementById("resultado").style.display = "block";
    document.getElementById("resultado").textContent = `Cliente de ${edad} años con ingreso ${ingreso}: ${resultado}`;
    agregarFilaATabla(edad, ingreso); // Añade los datos a la tabla.
    arbol.generarGrafico(); // Actualiza el gráfico.
});
