import {
  Grid,
  Box,
  Typography,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Reac, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDataAlternatif,
  getAllDataAlternatifState,
} from "../../store/alternatif/AlternatifData";
import {
  fetchDataKriteria,
  getAllDataKriteria,
} from "../../store/kriteria/KriteriaDatas";
import PerbandinganBerpasangan from "../../components/common/PerbandinganBerpasangan";
import PerbandinganAHP from "../../components/common/PerbandinganAHP";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { changeNilaiAkhirAHP } from "../../store/ahp";

const AHP = () => {
  const dispatch = useDispatch();
  const { datas } = useSelector(getAllDataAlternatifState);
  const [kodeKriteria, setKodeKriteria] = useState([]);
  const dataKriteria = useSelector(getAllDataKriteria);
  const [newDataToShow, setNewDataToShow] = useState([]);

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

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

  // langkah 2.1
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

  const nilaiRataRataAlt = mapBobot.map((row, index) =>
    (rataRata[index] / totalPerKolom.length).toFixed(6)
  );

  // ! ---------------------------------
  const testNilai = newDataToShow?.map((data) => data.nilai);
  const kodeAlt = newDataToShow?.map((data) => data.kode);

  const cekMapAlt = kodeKriteria?.map((datas, indexAlt) => {
    let test = [];

    kodeAlt?.forEach((item, index) => {
      let temp = [];
      kodeAlt?.forEach((item1, idx) => {
        testNilai[idx][indexAlt] === testNilai[index][indexAlt]
          ? temp.push(1 / 1)
          : testNilai[idx][indexAlt] > testNilai[index][indexAlt]
          ? temp.push(
              PerbandinganAHP(
                testNilai[idx][indexAlt],
                testNilai[index][indexAlt]
              ) /
                PerbandinganAHP(
                  testNilai[index][indexAlt],
                  testNilai[index][indexAlt]
                )
            )
          : temp.push(
              PerbandinganAHP(
                testNilai[idx][indexAlt],
                testNilai[idx][indexAlt]
              ) /
                PerbandinganAHP(
                  testNilai[index][indexAlt],
                  testNilai[idx][indexAlt]
                )
            );
      });
      test.push(temp);
    });

    return test;
  });

  const totalPerbandinganAltKriteria = cekMapAlt.map((matrix) => {
    return matrix.map((col, colIndex) => {
      return matrix.reduce((acc, row) => {
        return acc + row[colIndex];
      }, 0);
    });
  });

  const transposeData = (arr) => {
    return arr[0]?.map((_, colIndex) => arr?.map((row) => row[colIndex]));
  };

  const newCekMapAlt = cekMapAlt?.map((data, idx) => transposeData(data));

  const nilaiEigen = newCekMapAlt?.map((datas, idxAlt) =>
    datas?.map((data, idx) =>
      data?.map((nilai, indexN) =>
        (nilai / totalPerbandinganAltKriteria[idxAlt][idx]).toFixed(2)
      )
    )
  );

  const totalNilaiEigen = nilaiEigen.map((subarray) =>
    subarray.map((innerSubarray) =>
      innerSubarray
        .map((value) => parseFloat(value))
        .reduce((acc, curr) => acc + curr, 0)
    )
  );

  const rataRataNilaiEigen = totalNilaiEigen?.map((data, idx) =>
    data?.map((item, index) => item / kodeAlt?.length)
  );

  const newRataRataNilaiEigen = transposeData(rataRataNilaiEigen);
  const nilaiEigenPerangkingan = newRataRataNilaiEigen?.map((data, idx) =>
    data?.map((item, index) => item * nilaiRataRataAlt[index])
  );

  const perangkingan = nilaiEigenPerangkingan?.map((subarray) =>
    subarray
      .map((value) => parseFloat(value))
      .reduce((acc, curr) => acc + curr, 0)
  );

  useEffect(() => {
    dispatch(changeNilaiAkhirAHP(perangkingan));
  }, [perangkingan]);

  console.log({ perangkingan });

  // !------------------------------------
  return (
    <Grid container columns={12} spacing={2}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
            Perhitungan Menggunakan metode AHP
          </Typography>
          <Divider />
        </Box>
      </Grid>

      {/* langkah 1 */}
      <Grid item xs={12}>
        <Accordion
          sx={{ border: "none", background: "#FAFAFA" }}
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              Langkah I : Normalisasi
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer sx={{ mt: 2 }}>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow sx={{ background: "#FAFAFA" }}>
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
                          {nilaiC || "-"}
                          {/* {item.nilai[index]} */}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* langkah 2. */}
      <Grid item xs={12}>
        <Accordion
          sx={{ border: "none", background: "#FAFAFA" }}
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              Langkah 2 : Perbandingan Berpasangan Kriteria
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
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
                                    (item2.bobot + 0.05 - item1.bobot).toFixed(
                                      2
                                    )
                                  )
                                : PerbandinganBerpasangan(0.05))
                          )
                            ? (item1.bobot > item2.bobot
                                ? PerbandinganBerpasangan(
                                    (item1.bobot + 0.05 - item2.bobot).toFixed(
                                      2
                                    )
                                  )
                                : PerbandinganBerpasangan(0.05)) /
                              (item2.bobot > item1.bobot
                                ? PerbandinganBerpasangan(
                                    (item2.bobot + 0.05 - item1.bobot).toFixed(
                                      2
                                    )
                                  )
                                : PerbandinganBerpasangan(0.05))
                            : (
                                (item1.bobot > item2.bobot
                                  ? PerbandinganBerpasangan(
                                      (
                                        item1.bobot +
                                        0.05 -
                                        item2.bobot
                                      ).toFixed(2)
                                    )
                                  : PerbandinganBerpasangan(0.05)) /
                                (item2.bobot > item1.bobot
                                  ? PerbandinganBerpasangan(
                                      (
                                        item2.bobot +
                                        0.05 -
                                        item1.bobot
                                      ).toFixed(2)
                                    )
                                  : PerbandinganBerpasangan(0.05))
                              ).toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow sx={{ background: "#CFCFCF", fontWeight: 600 }}>
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
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* langkah 2.1 */}
      <Grid item xs={12}>
        <Accordion
          sx={{ border: "none", background: "#FAFAFA" }}
          expanded={expanded === "panel3"}
          onChange={handleChange("panel3")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "16px",
                textDecoration: "underline",
              }}
            >
              Langkah 2.1 : Nilai rata-rata
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: 600 }}
                      align="center"
                      colSpan={totalPerKolom.length}
                    >
                      Nilai Eigen
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Jumlah</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Rata - rata</TableCell>
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
                        {(rataRata[index] / totalPerKolom.length).toFixed(6)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Grid>

      {/* langkah 3 */}
      {cekMapAlt?.map((kode, idxKode) => (
        <Grid item xs={12}>
          <Accordion
            sx={{ border: "none", background: "#FAFAFA" }}
            expanded={expanded === `panel1${idxKode + 4}`}
            onChange={handleChange(`panel1${idxKode + 4}`)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "16px",
                  textDecoration: "underline",
                }}
              >
                Langkah 3 : Perbandingan Berpasangan Alternatif terhadap
                kriteria 1 (C{idxKode + 1})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{}}>
                      <TableCell align="left">Alternatif</TableCell>
                      {newDataToShow?.map((item, idx) => (
                        <TableCell align="left" key={idx}>
                          {item.kode}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cekMapAlt[idxKode]?.map((data, idx) => (
                      <TableRow>
                        <TableCell>A{idx + 1}</TableCell>
                        {data?.map((nilai, indexN) => (
                          <TableCell>{nilai.toFixed(2)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                    <TableRow sx={{ background: "#CFCFCF", fontWeight: 600 }}>
                      <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                      {totalPerbandinganAltKriteria[idxKode].map(
                        (total, index) => (
                          <TableCell key={index} sx={{ fontWeight: 600 }}>
                            {/* {Number.isInteger(total) ? total : total.toFixed(2)} */}
                            {total.toFixed(2)}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <TableContainer sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{}}>
                      <TableCell align="center">Alternatif</TableCell>
                      <TableCell align="center" colSpan={kodeAlt?.length}>
                        Nilai Eigen
                      </TableCell>
                      <TableCell>Jumlah</TableCell>
                      <TableCell>Rata-rata</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newCekMapAlt[idxKode]?.map((data, idx) => (
                      <TableRow>
                        <TableCell>A{idx + 1}</TableCell>
                        {data?.map((nilai, indexN) => (
                          <TableCell>
                            {(
                              nilai / totalPerbandinganAltKriteria[idxKode][idx]
                            ).toFixed(2)}
                          </TableCell>
                        ))}
                        <TableCell>
                          {totalNilaiEigen[idxKode][idx].toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {rataRataNilaiEigen[idxKode][idx].toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}

      {/* langkah 4 */}
      <Grid item xs={6}>
        <Box>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Langkah 4 : Perangkingan
          </Typography>
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#9D9D9D", fontWeight: 600 }}>
                <TableCell sx={{ fontWeight: 600 }}>Alternatif</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hasil Analisis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {perangkingan?.map((item, idx) => (
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight:
                        Math.max(...perangkingan) === perangkingan[idx] && 600,
                      background:
                        Math.max(...perangkingan) === perangkingan[idx] &&
                        "#E9E9E9",
                    }}
                  >
                    {kodeAlt[idx]}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight:
                        Math.max(...perangkingan) === perangkingan[idx] && 600,
                      background:
                        Math.max(...perangkingan) === perangkingan[idx] &&
                        "#E9E9E9",
                    }}
                  >
                    {item.toFixed(3)}
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

export default AHP;
