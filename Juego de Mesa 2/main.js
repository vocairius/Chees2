// --- ARCHIVO SIMPLIFICADO main.js ---

// Librerías necesarias
import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from './node_modules/three/examples/jsm/loaders/MTLLoader.js';
import Stats from './node_modules/stats.js/src/Stats.js';
 // Importar dat.GUI

// Importar datos de configuración del tablero y piezas
import { initialPieceData, pieceModelPaths } from './boardData.js';

//---------- INICIALIZACIÓN DE LA ESCENA Y ELEMENTOS BÁSICOS ----------//

// Escena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xadd8e6); // Fondo azul claro

// Cámara
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -4, 5); // Posición inicial de la cámara
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Crear botón para mostrar/ocultar grid
function createGridToggleButton() {
    const button = document.createElement('button');
    button.textContent = 'Mostrar Grid';
    button.style.position = 'absolute';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '100';
    button.style.padding = '8px 16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    
    button.addEventListener('click', () => {
        toggleDebugGrid();
        button.textContent = debugGridLines ? 'Ocultar Grid' : 'Mostrar Grid';
        button.style.backgroundColor = debugGridLines ? '#f44336' : '#4CAF50';
    });
    
    document.body.appendChild(button);
    return button;
}

// Crear botón después de inicializar el renderer
const gridToggleButton = createGridToggleButton();

// Orbit Controls para mover la cámara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

//---------- LUCES ----------//
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.position.set(-1.6, 15, 10);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Stats (monitor de rendimiento)
const stats = new Stats();
document.body.appendChild(stats.dom);

//---------- ALMACENAMIENTO DE OBJETOS ----------//
const pieceObjects = {}; // Almacena información de las piezas: { mesh, data }
let boardMesh = null; // Referencia al mesh del tablero

// Variables para manejar la selección y movimiento de piezas
let selectedPiece = null; // Pieza actualmente seleccionada
let squareMarkers = []; // Marcadores de casillas del tablero

// Variable para almacenar las líneas de debug
let debugGridLines = null;

// Parámetros para el ajuste del grid
const gridParams = {
    squareSize: 0.45,    // Tamaño de cada casilla
    offsetX: 0.85,       // Offset en X
    offsetY: 0.75,       // Offset en Y
    visible: false,      // Visibilidad del grid
    updateGrid: function() {
        // Recrear el grid con los nuevos parámetros
        if (debugGridLines) {
            scene.remove(debugGridLines);
        }
        debugGridLines = createDebugGridLines(this.squareSize, this.offsetX, this.offsetY);
        
        // Actualizar UI
        updateGridParamsDisplay();
    },
    applyToMarkers: function() {
        // Recrear los marcadores con los nuevos parámetros
        // Primero eliminamos los marcadores existentes
        scene.children.forEach(child => {
            if (child.isGroup && child.userData.isMarkerGroup) {
                scene.remove(child);
            }
        });
        squareMarkers = []; // Limpiar array de marcadores
        
        // Crear nuevos marcadores con los parámetros actualizados
        createBoardSquareMarkers(this.squareSize, this.offsetX, this.offsetY);
        
        // Actualizar UI
        updateGridParamsDisplay();
    },
    copyToClipboard: function() {
        const text = `Valores para el grid:\n` +
            `calibratedSquareSize = ${this.squareSize.toFixed(2)}\n` +
            `offsetX = ${this.offsetX.toFixed(2)}\n` +
            `offsetY = ${this.offsetY.toFixed(2)}`;
        
        // Crear un elemento textarea temporal para copiar al portapapeles
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        
        // Mostrar mensaje de confirmación
        alert('Valores copiados al portapapeles:\n' + text);
    }
};

// Inicializar el panel de control dat.GUI
function setupGUI() {
    const gui = new GUI({ width: 300 });
    gui.domElement.style.marginTop = '50px';
    
    // Carpeta para los ajustes del grid
    const gridFolder = gui.addFolder('Ajustes del Grid');
    
    // Añadir controles deslizadores
    gridFolder.add(gridParams, 'squareSize', 0.1, 0.7, 0.01).name('Tamaño casilla').onChange(() => gridParams.updateGrid());
    gridFolder.add(gridParams, 'offsetX', -2, 2, 0.01).name('Posición X').onChange(() => gridParams.updateGrid());
    gridFolder.add(gridParams, 'offsetY', -2, 2, 0.01).name('Posición Y').onChange(() => gridParams.updateGrid());
    
    // Botón para aplicar los cambios a los marcadores
    gridFolder.add(gridParams, 'applyToMarkers').name('Aplicar a marcadores');
    
    // Botón para copiar valores al portapapeles
    gridFolder.add(gridParams, 'copyToClipboard').name('Copiar valores');
    
    // Control de visibilidad del grid
    gridFolder.add(gridParams, 'visible').name('Mostrar Grid').onChange((visible) => {
        if (visible) {
            if (!debugGridLines) {
                debugGridLines = createDebugGridLines(gridParams.squareSize, gridParams.offsetX, gridParams.offsetY);
            }
        } else {
            if (debugGridLines) {
                scene.remove(debugGridLines);
                debugGridLines = null;
            }
        }
        
        // Actualizar botón
        if (gridToggleButton) {
            gridToggleButton.textContent = visible ? 'Ocultar Grid' : 'Mostrar Grid';
            gridToggleButton.style.backgroundColor = visible ? '#f44336' : '#4CAF50';
        }
    });
    
    gridFolder.open();
    
    return gui;
}

// Elemento para mostrar los valores actuales de los parámetros
function createGridParamsDisplay() {
    const display = document.createElement('div');
    display.id = 'gridParamsDisplay';
    display.style.position = 'absolute';
    display.style.bottom = '10px';
    display.style.left = '10px';
    display.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    display.style.color = 'white';
    display.style.padding = '10px';
    display.style.borderRadius = '5px';
    display.style.fontFamily = 'monospace';
    display.style.fontSize = '12px';
    document.body.appendChild(display);
    
    // Actualizar inicialmente
    updateGridParamsDisplay();
    
    return display;
}

// Actualizar la visualización de los parámetros
function updateGridParamsDisplay() {
    const display = document.getElementById('gridParamsDisplay');
    if (display) {
        display.innerHTML = `
            <strong>Grid Parameters:</strong><br>
            calibratedSquareSize = ${gridParams.squareSize.toFixed(2)}<br>
            offsetX = ${gridParams.offsetX.toFixed(2)}<br>
            offsetY = ${gridParams.offsetY.toFixed(2)}
        `;
    }
}

//---------- CARGA DE MODELOS 3D ----------//

// Función para cargar una pieza
const loadPieceModel = (pieceData) => {
    const modelPaths = pieceModelPaths[pieceData.typeName];
    if (!modelPaths) {
        console.error(`Rutas de modelo no encontradas para tipo: ${pieceData.typeName}`);
        return;
    }
    
    // Cargar materiales (MTL) y objetos (OBJ)
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();

    mtlLoader.load(modelPaths.mtl, (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(modelPaths.obj, (mesh) => {
            // Configurar rotación, escala y posición
            mesh.rotation.set(Math.PI / 2, pieceData.rotY || 0, 0);
            mesh.scale.set(0.5, 0.5, 0.5);
            mesh.position.set(pieceData.position3D[0], pieceData.position3D[1], pieceData.position3D[2]);
            
            // Guardar información de la pieza en userData
            mesh.userData = {
                pieceId: pieceData.pieceId,
                color: pieceData.color,
                typeName: pieceData.typeName,
                algebraic: pieceData.algebraic
            };
            
            console.log(`Pieza ${pieceData.pieceId} cargada en posición:`, 
                mesh.position.x.toFixed(2), 
                mesh.position.y.toFixed(2), 
                mesh.position.z.toFixed(2));
            
            // Añadir a la escena y al registro de piezas
            scene.add(mesh);
            pieceObjects[pieceData.pieceId] = { mesh: mesh, data: pieceData };
        });
    });
};

// Cargar el tablero
const mtlLoaderBoard = new MTLLoader();
const objLoaderBoard = new OBJLoader();
mtlLoaderBoard.load('./src/Modelos Voxel/Mapa/Tablero.mtl', (materials) => {
    materials.preload();
    objLoaderBoard.setMaterials(materials);
    objLoaderBoard.load('./src/Modelos Voxel/Mapa/Tablero.obj', (object) => {
        // Configurar el tablero
        object.rotation.set(Math.PI / 2, 0, 0); // Rota para que quede "plano"
        object.scale.set(0.6, 0.6, 0.6);
        object.position.set(0, 0, 0);
        
        // Guardar y añadir a la escena
        boardMesh = object;
        scene.add(object);
        console.log("Tablero cargado correctamente");
        
        // Crear visualización de casillas después de cargar el tablero
        createBoardSquareMarkers();
    });
});

// Cargar todas las piezas
initialPieceData.forEach(pData => {
    loadPieceModel(pData);
});

//---------- FUNCIONES PARA PIEZAS Y TABLERO ----------//

// Crear marcadores visuales para las casillas del tablero
function createBoardSquareMarkers() {
    // VALORES CALIBRADOS PARA COINCIDIR CON EL TABLERO REAL
    const squareSize = 0.45; // Reducido para mantener proporcionalidad con el nuevo calibratedSquareSize
    const squareHeight = 0.02; // Altura de los marcadores
    
    // Crear un grupo para contener todos los marcadores
    const markersGroup = new THREE.Group();
    markersGroup.position.set(0, 0, 0.05); // Ligeramente por encima del tablero
    
    // Determinar el centro del tablero basado en posiciones de piezas existentes
    // Esto nos ayuda a alinear las casillas con las posiciones actuales de las piezas
    let sumX = 0, sumY = 0, count = 0;
    for (const pieceId in pieceObjects) {
        const piecePos = pieceObjects[pieceId].mesh.position;
        sumX += piecePos.x;
        sumY += piecePos.y;
        count++;
    }
    
    // Si no hay piezas, usar valores por defecto
    const centerX = count > 0 ? sumX / count : 0;
    const centerY = count > 0 ? sumY / count : 0;
    
    console.log(`Centro calculado del tablero: (${centerX.toFixed(2)}, ${centerY.toFixed(2)})`);
    
    // ---- AJUSTES PARA ALINEAR CON EL TABLERO REAL ----
    // Estos valores deben ser calibrados manualmente observando el tablero
    // Reducimos el tamaño de cada casilla para que coincida con el tablero real
    const calibratedSquareSize = 0.25;  // Reducido para ajustarse al área jugable
    
    // Ajustar el punto de inicio para centrar el grid con el tablero
    // Basado en la imagen, el tablero parece estar más centrado en el origen
    const offsetX = 0.6;  // Ajustado para centrar en el área jugable
    const offsetY = 0.5;  // Ajustado para centrar en el área jugable
    
    // Crear 64 casillas (8x8)
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            // Crear geometría y material para cada casilla
            const geometry = new THREE.BoxGeometry(squareSize, squareSize, squareHeight);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,  // Verde para mejor visibilidad
                transparent: true,
                opacity: 0.0,     // Inicialmente invisible
                wireframe: false,  // Sólido en lugar de wireframe para mejor visibilidad
                side: THREE.DoubleSide // Visible desde ambos lados
            });
            
            const square = new THREE.Mesh(geometry, material);
            
            // Calcular posición calibrada para alinear con las piezas reales
            // Empezamos desde la esquina izquierda inferior y avanzamos
            const posX = offsetX - col * calibratedSquareSize;
            const posY = offsetY - row * calibratedSquareSize;
            
            square.position.set(posX, posY, 0);
            
            // Guardar información sobre la casilla
            square.userData = {
                row: row,
                col: col,
                algebraic: `${String.fromCharCode(97 + col)}${8 - row}` // 'a1', 'b2', etc. Invertimos filas para notación correcta
            };
            
            // Añadir al grupo y al array de marcadores
            markersGroup.add(square);
            squareMarkers.push(square);
        }
    }
    
    // Añadir el grupo a la escena
    scene.add(markersGroup);
    console.log("Marcadores de casillas creados:", squareMarkers.length);
    
    // DEBUG: hacer visible un marcador central para verificar posición
    if (squareMarkers.length > 27) { // casilla e4 (índice 3,4)
        squareMarkers[27].material.opacity = 0.5;
        console.log("Casilla e4 resaltada para calibración:", squareMarkers[27].position);
    }
    
    // También resaltamos a1 y h8 para verificar la alineación
    if (squareMarkers.length >= 64) {
        // a1 debería ser la casilla 56 (fila 7, columna 0)
        squareMarkers[56].material.opacity = 0.5;
        squareMarkers[56].material.color.set(0xff0000); // Rojo
        
        // h8 debería ser la casilla 7 (fila 0, columna 7)
        squareMarkers[7].material.opacity = 0.5;
        squareMarkers[7].material.color.set(0x0000ff); // Azul
        
        console.log("Casillas a1 y h8 resaltadas para calibración");
    }
}

// Función para crear líneas de ayuda que muestren visualmente la cuadrícula del tablero
function createDebugGridLines() {
    // Crear material para las líneas con más opacidad
    const material = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: false, opacity: 1.0 });
    const linesGroup = new THREE.Group();
    
    // Ajustar el tamaño del grid para que coincida con el tablero real
    const calibratedSquareSize = 0.45; // Mismo valor que en createBoardSquareMarkers
    
    // Ajustar posición de inicio para alinear con el tablero
    const offsetX = 0.85; // Mismo valor que en createBoardSquareMarkers
    const offsetY = 0.75; // Mismo valor que en createBoardSquareMarkers
    
    // Calcular dimensiones totales del grid (8 casillas)
    const gridWidth = 8 * calibratedSquareSize;
    const gridHeight = 8 * calibratedSquareSize;
    
    // Coordenadas de inicio y fin del grid
    const startX = offsetX + calibratedSquareSize/2;
    const startY = offsetY + calibratedSquareSize/2;
    const endX = startX - gridWidth;
    const endY = startY - gridHeight;
    
    // Altura Z significativamente mayor para estar por encima de todo
    const gridZ = 0.5;  // Ajustado para estar claramente encima de las piezas
    
    // Crear líneas horizontales
    for (let i = 0; i <= 8; i++) {
        const y = startY - i * calibratedSquareSize;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(startX, y, gridZ),
            new THREE.Vector3(endX, y, gridZ)
        ]);
        const line = new THREE.Line(lineGeometry, material);
        linesGroup.add(line);
    }
    
    // Crear líneas verticales
    for (let i = 0; i <= 8; i++) {
        const x = startX - i * calibratedSquareSize;
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, startY, gridZ),
            new THREE.Vector3(x, endY, gridZ)
        ]);
        const line = new THREE.Line(lineGeometry, material);
        linesGroup.add(line);
    }
    
    // Agregar bordes más gruesos para el límite del tablero
    const edgeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xff3333, 
        transparent: false, 
        opacity: 1.0,
        linewidth: 3 // Más grueso para mejor visibilidad
    });
    
    // Borde exterior del tablero
    const outerBorderGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(startX, startY, gridZ),
        new THREE.Vector3(endX, startY, gridZ),
        new THREE.Vector3(endX, endY, gridZ),
        new THREE.Vector3(startX, endY, gridZ),
        new THREE.Vector3(startX, startY, gridZ)
    ]);
    const outerBorder = new THREE.Line(outerBorderGeometry, edgeMaterial);
    linesGroup.add(outerBorder);
    
    // Agregar esferas en las esquinas con coordenadas
    const corners = [
        { pos: new THREE.Vector3(startX, startY, gridZ + 0.05), label: 'a8', color: 0xffff00 },  // Amarillo brillante
        { pos: new THREE.Vector3(endX, startY, gridZ + 0.05), label: 'h8', color: 0xffff00 },
        { pos: new THREE.Vector3(startX, endY, gridZ + 0.05), label: 'a1', color: 0xff3333 },   // Rojo brillante
        { pos: new THREE.Vector3(endX, endY, gridZ + 0.05), label: 'h1', color: 0xff3333 }
    ];
    
    // Usar esferas más grandes para las esquinas
    corners.forEach(corner => {
        const sphereGeometry = new THREE.SphereGeometry(0.04, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: corner.color, emissive: corner.color, emissiveIntensity: 0.5 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(corner.pos);
        linesGroup.add(sphere);
    });
    
    scene.add(linesGroup);
    console.log("%c Grid de depuración creado a altura Z=" + gridZ, "background: #4CAF50; color: white; padding: 5px;");
    
    return linesGroup;
}

// Función para encontrar la pieza más cercana a un punto en la escena
function findClosestPiece(point, maxDistance = 0.5) {
    let closestPiece = null;
    let closestDistance = Infinity;
    
    console.log("Buscando pieza más cercana a:", point);
    
    // Recorrer todas las piezas
    for (const pieceId in pieceObjects) {
        const pieceInfo = pieceObjects[pieceId];
        const piecePos = pieceInfo.mesh.position;
        
        // Calcular distancia en el plano XY
        const distance = Math.sqrt(
            Math.pow(point.x - piecePos.x, 2) + 
            Math.pow(point.y - piecePos.y, 2)
        );
        
        // Mostrar distancias para debug
        console.log(`Distancia a ${pieceId}: ${distance.toFixed(3)}`);
        
        if (distance < closestDistance && distance < maxDistance) {
            closestDistance = distance;
            closestPiece = pieceInfo;
        }
    }
    
    if (closestPiece) {
        console.log(`Pieza más cercana: ${closestPiece.data.pieceId} a distancia ${closestDistance.toFixed(3)}`);
    } else {
        console.log("No se encontró ninguna pieza suficientemente cerca");
    }
    
    return closestPiece;
}

// Función para convertir coordenadas de pantalla a coordenadas 3D
function screenToWorld(screenX, screenY) {
    // Normalizar coordenadas de pantalla a rango -1 a 1
    const normalizedX = (screenX / window.innerWidth) * 2 - 1;
    const normalizedY = -(screenY / window.innerHeight) * 2 + 1;
    
    // Crear un rayo desde la cámara
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
    
    // Definir el plano del tablero
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    
    // Calcular intersección del rayo con el plano
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectionPoint);
    
    return intersectionPoint;
}

// Función para encontrar la casilla más cercana a un punto 3D
function findClosestSquare(point3D) {
    let closestSquare = null;
    let closestDistance = Infinity;
    
    console.log("Buscando casilla más cercana a:", point3D);
    
    // Buscar entre todos los marcadores
    for (const square of squareMarkers) {
        const squarePos = square.position;
        
        // Calcular distancia en el plano XY
        const distance = Math.sqrt(
            Math.pow(point3D.x - squarePos.x, 2) + 
            Math.pow(point3D.y - squarePos.y, 2)
        );
        
        // Para depuración, mostrar las distancias para algunas casillas
        if (square.userData.algebraic === 'e4' || 
            square.userData.algebraic === 'd4' || 
            square.userData.algebraic === 'e5') {
            console.log(`Distancia a ${square.userData.algebraic}: ${distance.toFixed(2)} unidades`);
        }
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSquare = square;
        }
    }
    
    if (closestSquare) {
        console.log(`Casilla más cercana: ${closestSquare.userData.algebraic} a distancia ${closestDistance.toFixed(2)} unidades`);
        console.log(`Posición de la casilla: (${closestSquare.position.x.toFixed(2)}, ${closestSquare.position.y.toFixed(2)})`);
    } else {
        console.warn("No se encontró ninguna casilla cercana");
    }
    
    return closestSquare;
}

// Función para resaltar una casilla
function highlightSquare(square, isHighlighted = true) {
    if (square) {
        // Cambiar opacidad del material para hacerlo visible o invisible
        square.material.opacity = isHighlighted ? 0.5 : 0.0; // Mayor opacidad para mejor visibilidad
        // Cambiar color según si es selección o destino
        square.material.color.set(isHighlighted ? 0x00ff00 : 0xffffff);
    }
}

// Función sencilla para mover una pieza a una casilla
function movePiece(piece, square) {
    if (!piece || !square) return false;
    
    console.log(`Moviendo pieza ${piece.data.pieceId} a ${square.userData.algebraic}`);
    
    // Obtener posición de la casilla destino
    const targetX = square.position.x;
    const targetY = square.position.y;
    const targetZ = piece.mesh.position.z; // Mantener la altura Z
    
    // Guardar posición anterior para depuración
    const prevPos = piece.mesh.position.clone();
    
    // Establecer nueva posición
    piece.mesh.position.set(targetX, targetY, targetZ);
    
    // Forzar actualización
    piece.mesh.updateMatrix();
    piece.mesh.updateMatrixWorld(true);
    
    // Actualizar datos internos
    piece.data.algebraic = square.userData.algebraic;
    
    console.log(`Posición anterior: (${prevPos.x.toFixed(2)}, ${prevPos.y.toFixed(2)}, ${prevPos.z.toFixed(2)})`);
    console.log(`Nueva posición: (${targetX.toFixed(2)}, ${targetY.toFixed(2)}, ${targetZ.toFixed(2)})`);
    
    // Forzar renderizado para actualizar la vista
    renderer.render(scene, camera);
    
    return true;
}

//---------- MANEJO DE EVENTOS ----------//

// Manejar clics del ratón
function onMouseClick(event) {
    console.log("======== Nuevo Clic ========");
    console.log("Clic detectado");
    
    // Convertir clic a coordenadas 3D
    const point3D = screenToWorld(event.clientX, event.clientY);
    console.log("Punto 3D:", point3D);
    
    // Mostrar un marcador temporal en la posición del clic para debug
    showTemporaryMarker(point3D.x, point3D.y, point3D.z);
    
    // Si no hay pieza seleccionada, buscar una pieza para seleccionar
    if (!selectedPiece) {
        // Buscar pieza cercana al punto del clic
        const nearestPiece = findClosestPiece(point3D);
        
        if (nearestPiece) {
            // Seleccionar pieza
            selectedPiece = nearestPiece;
            console.log(`Pieza seleccionada: ${selectedPiece.data.pieceId}`);
            
            // Encontrar y resaltar su casilla actual
            const currentSquare = findClosestSquare(selectedPiece.mesh.position);
            
            if (currentSquare) {
                console.log(`Casilla actual de la pieza: ${currentSquare.userData.algebraic}`);
                highlightSquare(currentSquare, true);
            }
        }
    } 
    // Si ya hay una pieza seleccionada, intentar moverla
    else {
        // Buscar casilla destino
        const targetSquare = findClosestSquare(point3D);
        
        if (targetSquare) {
            // También resaltar la casilla destino antes de mover
            highlightSquare(targetSquare, true);
            
            // Pequeña pausa para que se vea la casilla resaltada
            setTimeout(() => {
                console.log(`Casilla destino: ${targetSquare.userData.algebraic}`);
                
                // Mover la pieza a la casilla
                const moveSuccess = movePiece(selectedPiece, targetSquare);
                
                if (moveSuccess) {
                    console.log(`Pieza ${selectedPiece.data.pieceId} movida a ${targetSquare.userData.algebraic}`);
                } else {
                    console.error("No se pudo mover la pieza");
                }
                
                // Limpiar resaltados
                squareMarkers.forEach(square => highlightSquare(square, false));
                
                // Deseleccionar pieza
                selectedPiece = null;
            }, 300); // 300ms de retraso para ver el resaltado
        } else {
            console.log("No se encontró casilla válida para mover");
            selectedPiece = null; // Deseleccionar si no hay casilla válida
        }
    }
}

// Función para mostrar un marcador temporal en la posición del clic
function showTemporaryMarker(x, y, z) {
    // Crear una pequeña esfera en la posición del clic
    const geometry = new THREE.SphereGeometry(0.05, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff00ff }); // Rosa
    const marker = new THREE.Mesh(geometry, material);
    
    marker.position.set(x, y, z);
    scene.add(marker);
    
    // Eliminar después de 1 segundo
    setTimeout(() => {
        scene.remove(marker);
    }, 1000);
}

// Registrar eventos
renderer.domElement.addEventListener('click', onMouseClick);

// Manejar cambio de tamaño de ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
});

//---------- RENDERIZADO DE LA ESCENA ----------//

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Actualizar controles de la cámara
    renderer.render(scene, camera);
    stats.update();
}

// Iniciar la animación
animate();

// Función para alternar la visualización de las líneas de debug
function toggleDebugGrid() {
    if (debugGridLines) {
        scene.remove(debugGridLines);
        debugGridLines = null;
        console.log("%c Grid de depuración DESACTIVADO", "background: #f44336; color: white; padding: 5px;");
    } else {
        debugGridLines = createDebugGridLines();
        console.log("%c Grid de depuración ACTIVADO", "background: #4CAF50; color: white; padding: 5px;");
        
        // Forzar renderizado para asegurar que el grid sea visible
        renderer.render(scene, camera);
    }
    
    // Actualizar el texto del botón
    if (gridToggleButton) {
        gridToggleButton.textContent = debugGridLines ? 'Ocultar Grid' : 'Mostrar Grid';
        gridToggleButton.style.backgroundColor = debugGridLines ? '#f44336' : '#4CAF50';
    }
}

// Añadir event listener para la tecla 'G' para mostrar/ocultar el grid
window.addEventListener('keydown', (event) => {
    if (event.key === 'g' || event.key === 'G') {
        toggleDebugGrid();
    }
});

// --- FIN ARCHIVO SIMPLIFICADO main.js ---