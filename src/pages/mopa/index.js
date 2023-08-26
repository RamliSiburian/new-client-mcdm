import {
  Box,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from '../../store/kriteria/KriteriaDatas';
import {
  changeJoinData,
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from '../../store/alternatif/AlternatifData';
import { useState } from 'react';
// import { PerbandinganBerpasangan } from "../../components/common/PerbandinganBerpasangan";
import { changeNilaiAkhirMopa } from '../../store/mopa';
import { getAllPerbandinganMopa } from '../../store/perbandinganMopa/perbandinganMopa';

const MOPA = () => {
  const { dataPerbandinganMopa, isLoading } = useSelector(
    getAllPerbandinganMopa
  );
  const dispatch = useDispatch();
  const { datas } = useSelector(getAllDataAlternatifState);
  const [kodeKriteria, setKodeKriteria] = useState([]);
  const dataKriteria = useSelector(getAllDataKriteria);
  const [newDataToShow, setNewDataToShow] = useState([]);

  function PerbandinganBerpasangan(item1 = 0, item2 = 0) {
    let nilaiPerbandingan;

    const bobot = Math.abs(item1 - item2);

    const foundValue = dataPerbandinganMopa.find(
      (entry) => entry.nilai === parseFloat(bobot.toFixed(2))
    );

    if (foundValue) {
      nilaiPerbandingan = foundValue.kode;
    } else {
      nilaiPerbandingan = 1;
    }

    return nilaiPerbandingan;
  }

  useEffect(() => {
    const kode = dataKriteria.map((kode) => kode?.kode);
    setKodeKriteria(kode);
  }, [dataKriteria]);

  useEffect(() => {
    dispatch(fetchDataKriteria());
    dispatch(fetchDataAlternatif());
  }, []);

  useEffect(() => {
    const excepData = datas.reduce((result, item) => {
      if (!result[item.kode]) {
        result[item.kode] = {
          kode: item.kode,
          namaAlternatif: item.namaAlternatif,
          kodeKriteria: [],
          nilai: [],
        };
      }

      result[item.kode].kodeKriteria.push(item.kodeKriteria);
      result[item.kode].nilai.push(item.nilai);

      return result;
    }, {});

    // const exceptDataArray = Object.values(excepData);
    const maxNilaiCount = Math.max(
      ...Object.values(excepData).map((obj) => obj.nilai.length)
    );

    const fixLength =
      kodeKriteria?.length > maxNilaiCount
        ? kodeKriteria?.length
        : maxNilaiCount;

    const exceptDataArray = Object.values(excepData).map((obj) => {
      while (obj.nilai.length < fixLength) {
        obj.nilai.push(0);
      }
      return obj;
    });
    setNewDataToShow(exceptDataArray);
  }, [datas]);

  const totalPerKolom = dataKriteria.reduce((total, item) => {
    return dataKriteria.map((item2, index) => {
      return (
        total[index] +
        (item.bobot > item2.bobot
          ? PerbandinganBerpasangan(
              (item.bobot + 0.05 - item2.bobot).toFixed(2)
            )
          : PerbandinganBerpasangan(0.05)) /
          (item2.bobot > item.bobot
            ? PerbandinganBerpasangan(
                (item2.bobot + 0.05 - item.bobot).toFixed(2)
              )
            : PerbandinganBerpasangan(0.05))
      );
    });
  }, new Array(dataKriteria.length).fill(0));

  const nilaiRataRata = dataKriteria.map((total, item) => {
    return dataKriteria.map((item2, index) => {
      return Number.isInteger(
        (total.bobot > item2.bobot
          ? PerbandinganBerpasangan(
              (total.bobot + 0.05 - item2.bobot).toFixed(2)
            )
          : PerbandinganBerpasangan(0.05)) /
          (item2.bobot > total.bobot
            ? PerbandinganBerpasangan(
                (item2.bobot + 0.05 - total.bobot).toFixed(2)
              )
            : PerbandinganBerpasangan(0.05))
      )
        ? (total.bobot > item2.bobot
            ? PerbandinganBerpasangan(
                (total.bobot + 0.05 - item2.bobot).toFixed(2)
              )
            : PerbandinganBerpasangan(0.05)) /
            (item2.bobot > total.bobot
              ? PerbandinganBerpasangan(
                  (item2.bobot + 0.05 - total.bobot).toFixed(2)
                )
              : PerbandinganBerpasangan(0.05))
        : (
            (total.bobot > item2.bobot
              ? PerbandinganBerpasangan(
                  (total.bobot + 0.05 - item2.bobot).toFixed(2)
                )
              : PerbandinganBerpasangan(0.05)) /
            (item2.bobot > total.bobot
              ? PerbandinganBerpasangan(
                  (item2.bobot + 0.05 - total.bobot).toFixed(2)
                )
              : PerbandinganBerpasangan(0.05))
          ).toFixed(2);
    });
  });

  const totalPerSubArray = nilaiRataRata.map((subArr) => {
    return subArr.reduce((acc, curr, index) => {
      const parsedValue = parseFloat(curr);
      const result = acc + parsedValue / totalPerKolom[index];
      return result;
    });
  });

  const mapBobot = nilaiRataRata?.map((nr, idx) => {
    const result = [];
    return nr.map((value, index) => [...result, value / totalPerKolom[index]]);
  });

  const rataRata = mapBobot.map((row, idx) => {
    return row.flat().reduce((acc, curr, index) => {
      const parsedValue = parseFloat(curr);
      const result = acc + parsedValue;
      return result;
    });
  });

  const normalisasiCostBenefit = newDataToShow?.map((data) => data.nilai);
  const kodeAlt = newDataToShow?.map((data) => data.kode);

  const cek = kodeAlt?.map((row, index) => {
    return normalisasiCostBenefit?.map((col, colIdx) => {
      return row, col;
    });
  });

  const transposeData = (arr) => {
    return arr[0]?.map((_, colIndex) => arr?.map((row) => row[colIndex]));
  };

  const newData = transposeData(normalisasiCostBenefit);

  const highestValue = newData?.map((subArray, idx) => {
    const cek = dataKriteria.some(
      (item) => item.kode === kodeKriteria[idx] && item.kategory === 'Cost'
    );
    return cek
      ? { cost: true, nilai: Math.min(...subArray) }
      : { cost: false, nilai: Math.max(...subArray) };
  });

  const bobotFinal = rataRata?.map((row, idx) => {
    return row / totalPerKolom.length;
  });

  const test = kodeKriteria?.map((kode, idx) => {
    return newData[idx]?.map((item, index) =>
      highestValue[idx]?.cost === true
        ? highestValue[idx]?.nilai / item
        : item / highestValue[idx]?.nilai
    );
  });

  const finalResult = test?.map((row, idx) => {
    return row?.map((value, index) => value * bobotFinal[idx]);
  });

  const coba = kodeKriteria?.map((kode, idx) =>
    newData[idx]?.map((item, index) =>
      highestValue[idx].cost === true
        ? Number.isInteger(highestValue[idx].nilai / item)
          ? highestValue[idx].nilai / item
          : (highestValue[idx].nilai / item).toFixed(2)
        : Number.isInteger(item / highestValue[idx].nilai)
        ? item / highestValue[idx].nilai
        : (item / highestValue[idx].nilai).toFixed(2)
    )
  );

  const totalCostBenefit = finalResult?.map((subArray) => {
    const sum = subArray?.reduce((acc, curr) => acc + Number(curr), 0);
    return sum;
  });

  const perangkingan = finalResult[0]?.reduce((result, _, index) => {
    const sum = finalResult?.reduce((total, arr) => total + arr[index], 0);
    result.push(sum);
    return result;
  }, []);

  useEffect(() => {
    dispatch(changeJoinData(newDataToShow));
    dispatch(changeNilaiAkhirMopa(perangkingan));
  }, [perangkingan, newDataToShow]);

  return (
    <Grid container columns={12} spacing={3}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '20px' }}>
            Perhitungan Menggunakan metode MOPA
          </Typography>
          <Divider />
        </Box>
      </Grid>

      {/* langkah 1 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah I : Normalisasi
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ background: '#FAFAFA' }}>
                <TableCell align="left">Nama Alternatif</TableCell>
                {kodeKriteria.map((kode, index) => (
                  <TableCell align="left" key={index}>
                    {kode}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {newDataToShow?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell align="left">
                    {item.namaAlternatif} ({item.kode})
                  </TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {nilaiC || '-'}
                      {/* {item.nilai[index]} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 2 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 2 : Perbandingan Berpasangan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Kriteria / Kriteria</TableCell>
                {kodeKriteria.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataKriteria.map((item1, index1) => (
                <TableRow key={item1.kode}>
                  <TableCell>{item1.kode}</TableCell>
                  {dataKriteria.map((item2, index2) => (
                    <TableCell key={item2.kode}>
                      {item2.bobot === item1.bobot ? (
                        '1/1'
                      ) : (
                        <>
                          {item1.bobot > item2.bobot
                            ? PerbandinganBerpasangan(
                                (item1.bobot + 0.05 - item2.bobot).toFixed(2)
                              )
                            : PerbandinganBerpasangan(0.05)}
                          /
                          {item2.bobot > item1.bobot
                            ? PerbandinganBerpasangan(
                                (item2.bobot + 0.05 - item1.bobot).toFixed(2)
                              )
                            : PerbandinganBerpasangan(0.05)}
                        </>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 2.1 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 2.1 : Pembobotan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Kriteria / Kriteria</TableCell>
                {kodeKriteria.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dataKriteria.map((item1, index1) => (
                <TableRow key={item1.kode}>
                  <TableCell>{item1.kode}</TableCell>
                  {dataKriteria.map((item2, index2) => (
                    <TableCell key={item2.kode}>
                      {Number.isInteger(
                        (item1.bobot > item2.bobot
                          ? PerbandinganBerpasangan(
                              (item1.bobot + 0.05 - item2.bobot).toFixed(2)
                            )
                          : PerbandinganBerpasangan(0.05)) /
                          (item2.bobot > item1.bobot
                            ? PerbandinganBerpasangan(
                                (item2.bobot + 0.05 - item1.bobot).toFixed(2)
                              )
                            : PerbandinganBerpasangan(0.05))
                      )
                        ? (item1.bobot > item2.bobot
                            ? PerbandinganBerpasangan(
                                (item1.bobot + 0.05 - item2.bobot).toFixed(2)
                              )
                            : PerbandinganBerpasangan(0.05)) /
                          (item2.bobot > item1.bobot
                            ? PerbandinganBerpasangan(
                                (item2.bobot + 0.05 - item1.bobot).toFixed(2)
                              )
                            : PerbandinganBerpasangan(0.05))
                        : (
                            (item1.bobot > item2.bobot
                              ? PerbandinganBerpasangan(
                                  (item1.bobot + 0.05 - item2.bobot).toFixed(2)
                                )
                              : PerbandinganBerpasangan(0.05)) /
                            (item2.bobot > item1.bobot
                              ? PerbandinganBerpasangan(
                                  (item2.bobot + 0.05 - item1.bobot).toFixed(2)
                                )
                              : PerbandinganBerpasangan(0.05))
                          ).toFixed(2)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow sx={{ background: '#CFCFCF', fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                {totalPerKolom.map((total, index) => (
                  <TableCell key={index} sx={{ fontWeight: 600 }}>
                    {/* {Number.isInteger(total) ? total : total.toFixed(2)} */}
                    {Math.round(total)}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 2.2 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 2.2 : Mencari Nilai rata-rata
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 600 }}
                  align="center"
                  colSpan={totalPerKolom.length}
                >
                  Nilai Karakteristik
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rata - rata Wj</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mapBobot.map((row, index) => (
                <TableRow key={index}>
                  {row.flat().map((value, colIndex) => (
                    <TableCell key={colIndex}>{value.toFixed(2)}</TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: 600 }}>
                    {rataRata[index].toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {(rataRata[index] / totalPerKolom.length).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 3 */}
      <Grid item xs={10}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 3 : Normalisasi dan mencari nilai cost dan benefit
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {kodeKriteria.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {newDataToShow?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell align="left">{item.kode}</TableCell>
                  {item?.nilai?.map((nilaiC, index) => (
                    <TableCell align="left" key={index}>
                      {nilaiC || '-'}
                      {/* {item.nilai[index]} */}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {/* langkah 3.1 */}
      <Grid item xs={12}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 3.1 : Menghitung nilai cost dan benefit
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {kodeAlt.map((kode) => (
                  <TableCell key={kode}>{kode}</TableCell>
                ))}
                <TableCell>Bobot Awal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kodeKriteria.map((kode, idx) => (
                <TableRow>
                  <TableCell>{kode}</TableCell>
                  {newData[idx]?.map((item, index) => (
                    <TableCell>
                      {highestValue[idx].cost === true
                        ? Number.isInteger(highestValue[idx].nilai / item)
                          ? highestValue[idx].nilai / item
                          : (highestValue[idx].nilai / item).toFixed(2)
                        : Number.isInteger(item / highestValue[idx].nilai)
                        ? item / highestValue[idx].nilai
                        : (item / highestValue[idx].nilai).toFixed(2)}
                    </TableCell>
                  ))}
                  <TableCell>{bobotFinal[idx].toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {/* <TableRow>
                <TableCell>Total</TableCell>
                {perangkingan?.map((data) => (
                  <TableCell>{data.toFixed(2)}</TableCell>
                ))}
              </TableRow> */}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* langkah 4 */}
      <Grid item xs={6}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '16px',
              textDecoration: 'underline',
            }}
          >
            Langkah 4 : Perangkingan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: '#9D9D9D', fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Alternatif</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hasil Analisis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newDataToShow?.map((item, idx) => (
                <TableRow key={idx} sx={{}}>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...perangkingan) === perangkingan[idx] && 600,
                      background:
                        Math.max(...perangkingan) === perangkingan[idx] &&
                        '#E9E9E9',
                    }}
                  >
                    {item.kode}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...perangkingan) === perangkingan[idx] && 600,
                      background:
                        Math.max(...perangkingan) === perangkingan[idx] &&
                        '#E9E9E9',
                    }}
                  >
                    {perangkingan[idx].toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default MOPA;
