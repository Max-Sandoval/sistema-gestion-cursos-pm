const bcrypt = require('bcrypt');

const generar = async () => {
  const hashAdmin = await bcrypt.hash('Admin1234*', 10);
  const hashConsulta = await bcrypt.hash('Consulta1234*', 10);

  console.log('ADMIN:');
  console.log(hashAdmin);

  console.log('\nCONSULTA:');
  console.log(hashConsulta);
};

generar();