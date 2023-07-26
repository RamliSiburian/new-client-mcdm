 export function PerbandinganBerpasangan ( bobot ) {
  let nilaiPerbandingan;

  switch (bobot) {
    case 0.05:
      nilaiPerbandingan = 1;
      break;
    case 0.1:
      nilaiPerbandingan = 3;
      break;
    case 0.15:
      nilaiPerbandingan = 5;
      break;
      case 0.2:
        nilaiPerbandingan = 7;
        break;
    default:
      nilaiPerbandingan = 0;
  }

  return nilaiPerbandingan;
};




export default PerbandinganBerpasangan