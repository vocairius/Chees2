// --- START OF FILE boardData.js ---

// Tus pieceModelPaths se mantienen igual, ya que definen los archivos de los modelos
const pieceModelPaths = {
    'PeonN': { mtl: './src/Modelos Voxel/Peon Negro/PeonN.mtl', obj: './src/Modelos Voxel/Peon Negro/PeonN.obj' },
    'PeonB': { mtl: './src/Modelos Voxel/Peon Blanco/PeonB.mtl', obj: './src/Modelos Voxel/Peon Blanco/PeonB.obj' },
    'TorreN': { mtl: './src/Modelos Voxel/TorreN/TorreN.mtl', obj: './src/Modelos Voxel/TorreN/TorreN.obj' },
    'TorreB': { mtl: './src/Modelos Voxel/TorreB/TorreB.mtl', obj: './src/Modelos Voxel/TorreB/TorreB.obj' },
    'CaballoN': { mtl: './src/Modelos Voxel/CaballoN/CaballoN.mtl', obj: './src/Modelos Voxel/CaballoN/CaballoN.obj' },
    'CaballoB': { mtl: './src/Modelos Voxel/CaballoB/CaballoB.mtl', obj: './src/Modelos Voxel/CaballoB/CaballoB.obj' },
    'AlfilN': { mtl: './src/Modelos Voxel/AlfilN/AlfilN.mtl', obj: './src/Modelos Voxel/AlfilN/AlfilN.obj' },
    'AlfilB': { mtl: './src/Modelos Voxel/AlfilB/AlfilB.mtl', obj: './src/Modelos Voxel/AlfilB/AlfilB.obj' },
    'ReinaN': { mtl: './src/Modelos Voxel/Reina Negra/ReinaN.mtl', obj: './src/Modelos Voxel/Reina Negra/ReinaN.obj' },
    'ReinaB': { mtl: './src/Modelos Voxel/Reina Blanca/ReinaB.mtl', obj: './src/Modelos Voxel/Reina Blanca/ReinaB.obj' },
    'ReyN': { mtl: './src/Modelos Voxel/Rey/Rey[1].mtl', obj: './src/Modelos Voxel/Rey/Rey[1].obj' },
    'ReyB': { mtl: './src/Modelos Voxel/Rey Blanco/ReyB.mtl', obj: './src/Modelos Voxel/Rey Blanco/ReyB.obj' },
};

// Nueva estructura para initialPieceData, usando tus coordenadas validadas
// y añadiendo los campos del ejemplo.
const initialPieceData = [
    // --- Piezas Negras ---
    // Rank 8
    { pieceId: 'bRa8', algebraic: 'a8', typeName: 'TorreN', position3D: [-1.26, -1.31, 0.3], rotY: 0, color: 'black', name: 'r', inSquare: 'a8', isDead: false, inDanger: false, hasMoved: false, availableMoves: [] },
    { pieceId: 'bNb8', algebraic: 'b8', typeName: 'CaballoN', position3D: [-0.95, -1.26, 0.3], rotY: -Math.PI / 2, color: 'black', name: 'h', inSquare: 'b8', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'bBc8', algebraic: 'c8', typeName: 'AlfilN', position3D: [-0.54, -1.26, 0.3], rotY: 0, color: 'black', name: 'b', inSquare: 'c8', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'bQd8', algebraic: 'd8', typeName: 'ReinaN', position3D: [0.13, -1.21, 0.3], rotY: 0, color: 'black', name: 'q', inSquare: 'd8', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'bKe8', algebraic: 'e8', typeName: 'ReyN', position3D: [-0.23, -1.31, 0.3], rotY: Math.PI / 2, color: 'black', name: 'k', inSquare: 'e8', isDead: false, inDanger: false, hasMoved: false, availableMoves: [] },
    { pieceId: 'bBf8', algebraic: 'f8', typeName: 'AlfilN', position3D: [0.54, -1.26, 0.3], rotY: 0, color: 'black', name: 'b', inSquare: 'f8', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'bNg8', algebraic: 'g8', typeName: 'CaballoN', position3D: [0.85, -1.26, 0.3], rotY: -Math.PI / 2, color: 'black', name: 'h', inSquare: 'g8', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'bRh8', algebraic: 'h8', typeName: 'TorreN', position3D: [1.26, -1.31, 0.3], rotY: 0, color: 'black', name: 'r', inSquare: 'h8', isDead: false, inDanger: false, hasMoved: false, availableMoves: [] },

    // Rank 7 - Peones Negros
    { pieceId: 'bPa7', algebraic: 'a7', typeName: 'PeonN', position3D: [-1.06, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'a7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'bPb7', algebraic: 'b7', typeName: 'PeonN', position3D: [-0.7, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'b7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'bPc7', algebraic: 'c7', typeName: 'PeonN', position3D: [-0.34, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'c7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'bPd7', algebraic: 'd7', typeName: 'PeonN', position3D: [0.02, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'd7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'bPe7', algebraic: 'e7', typeName: 'PeonN', position3D: [0.38, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'e7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'bPf7', algebraic: 'f7', typeName: 'PeonN', position3D: [0.74, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'f7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'bPg7', algebraic: 'g7', typeName: 'PeonN', position3D: [1.1, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'g7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'bPh7', algebraic: 'h7', typeName: 'PeonN', position3D: [1.46, -1.1, 0.3], rotY: 0, color: 'black', name: 'p', inSquare: 'h7', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },

    // --- Piezas Blancas ---
    // Rank 1
    { pieceId: 'wRa1', algebraic: 'a1', typeName: 'TorreB', position3D: [-1.26, 1.21, 0.3], rotY: 0, color: 'white', name: 'r', inSquare: 'a1', isDead: false, inDanger: false, hasMoved: false, availableMoves: [] },
    { pieceId: 'wNb1', algebraic: 'b1', typeName: 'CaballoB', position3D: [-0.85, 1.26, 0.3], rotY: Math.PI / 2, color: 'white', name: 'h', inSquare: 'b1', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'wBc1', algebraic: 'c1', typeName: 'AlfilB', position3D: [-0.54, 1.26, 0.3], rotY: 0, color: 'white', name: 'b', inSquare: 'c1', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'wQd1', algebraic: 'd1', typeName: 'ReinaB', position3D: [0.13, 1.31, 0.3], rotY: 0, color: 'white', name: 'q', inSquare: 'd1', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'wKe1', algebraic: 'e1', typeName: 'ReyB', position3D: [-0.23, 1.21, 0.3], rotY: Math.PI / 2, color: 'white', name: 'k', inSquare: 'e1', isDead: false, inDanger: false, hasMoved: false, availableMoves: [] },
    { pieceId: 'wBf1', algebraic: 'f1', typeName: 'AlfilB', position3D: [0.54, 1.26, 0.3], rotY: 0, color: 'white', name: 'b', inSquare: 'f1', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'wNg1', algebraic: 'g1', typeName: 'CaballoB', position3D: [0.95, 1.26, 0.3], rotY: Math.PI / 2, color: 'white', name: 'h', inSquare: 'g1', isDead: false, inDanger: false, availableMoves: [] },
    { pieceId: 'wRh1', algebraic: 'h1', typeName: 'TorreB', position3D: [1.26, 1.1, 0.3], rotY: 0, color: 'white', name: 'r', inSquare: 'h1', isDead: false, inDanger: false, hasMoved: false, availableMoves: [] },

    // Rank 2 - Peones Blancos
    { pieceId: 'wPa2', algebraic: 'a2', typeName: 'PeonB', position3D: [-0.86, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'a2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'wPb2', algebraic: 'b2', typeName: 'PeonB', position3D: [-0.5, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'b2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'wPc2', algebraic: 'c2', typeName: 'PeonB', position3D: [-0.14, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'c2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'wPd2', algebraic: 'd2', typeName: 'PeonB', position3D: [0.22, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'd2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'wPe2', algebraic: 'e2', typeName: 'PeonB', position3D: [0.58, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'e2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'wPf2', algebraic: 'f2', typeName: 'PeonB', position3D: [0.94, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'f2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'wPg2', algebraic: 'g2', typeName: 'PeonB', position3D: [1.3, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'g2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
    { pieceId: 'wPh2', algebraic: 'h2', typeName: 'PeonB', position3D: [1.66, 1.1, 0.3], rotY: 0, color: 'white', name: 'p', inSquare: 'h2', isDead: false, inDanger: false, canBePromoted: false, availableMoves: [] },
];

export { initialPieceData, pieceModelPaths };
// --- END OF FILE boardData.js ---