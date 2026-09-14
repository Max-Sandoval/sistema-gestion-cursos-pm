const express = require('express');
const cors = require('cors');

require('dotenv').config();


// =========================================================
// RUTAS
// =========================================================

const catalogoRoutes = require('./routes/catalogoRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const authRoutes = require('./routes/authRoutes');
const cursoRealizadoRoutes = require('./routes/cursoRealizadoRoutes');


// =========================================================
// APLICACIÓN
// =========================================================

const app = express();

app.use(cors());
app.use(express.json());


// =========================================================
// RUTA PRINCIPAL
// =========================================================

app.get('/', (req, res) => {

  res.json({
    mensaje: 'API Sistema de Gestión de Cursos PM funcionando'
  });

});


// =========================================================
// ENDPOINTS API
// =========================================================

app.use('/api', catalogoRoutes);

app.use(
  '/api/funcionarios',
  funcionarioRoutes
);

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api',
  cursoRealizadoRoutes
);


// =========================================================
// SERVIDOR
// =========================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor ejecutándose en http://localhost:${PORT}`
  );

});