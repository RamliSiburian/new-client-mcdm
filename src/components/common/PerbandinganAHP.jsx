 export function PerbandinganAHP ( item1 = 0 , item2 = 0) {
  let nilaiPerbandingan;

  const bobot = item1 - item2



  switch (bobot) {
    case 0:
      nilaiPerbandingan = 1;
      break;
    case 1:
      nilaiPerbandingan = 3;
      break;
    case 2:
      nilaiPerbandingan = 5;
      break;
    case 3:
      nilaiPerbandingan = 7;
      break;
    case 4:
      nilaiPerbandingan = 11;
      break;
    case 5:
      nilaiPerbandingan = 13;
      break;
    case 6:
      nilaiPerbandingan = 15;
      break;
    case 7:
      nilaiPerbandingan = 17;
      break;
    case 8:
      nilaiPerbandingan = 19;
      break;
    case 9:
      nilaiPerbandingan = 21;
      break;
    default:
      nilaiPerbandingan = 0;
  }

  return nilaiPerbandingan;
};




export default PerbandinganAHP