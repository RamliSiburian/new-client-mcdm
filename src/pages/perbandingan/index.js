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
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { getAllDataMopa } from "../../store/mopa";
import { getAllDataAlternatifState } from "../../store/alternatif/AlternatifData";
import { getDataTopsis } from "../../store/topsis";
import { getDataSaw } from "../../store/saw";
import { getAllDataAHP } from "../../store/ahp";

const Perbandingan = () => {
  const { nilaiAkhir } = useSelector(getAllDataMopa);
  const topsis = useSelector(getDataTopsis);
  const saw = useSelector(getDataSaw);
  const ahp = useSelector(getAllDataAHP);
  const { joinData } = useSelector(getAllDataAlternatifState);
  const kodeAlt = joinData?.map((data) => data.kode);

  return (
    <Grid container columns={12} spacing={3}>
      <Grid item xs={12}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
            Perbandingan hasil akhir metode AHP, Topsis, SAW, dan MOPA
          </Typography>
          <Divider />
        </Box>

        <TableContainer sx={{ mt: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="left">Alternatif</TableCell>
                <TableCell align="left">AHP</TableCell>
                <TableCell align="left">SAW</TableCell>
                <TableCell align="left">Topsis</TableCell>
                <TableCell align="left">MOPA</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kodeAlt?.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell
                    align="left"
                    // sx={{
                    //   fontWeight:
                    //     Math.max(...nilaiAkhir) === nilaiAkhir[idx] && 600,
                    //   background:
                    //     Math.max(...nilaiAkhir) === nilaiAkhir[idx] &&
                    //     "#E9E9E9",
                    // }}
                  >
                    {item}
                  </TableCell>
                  <TableCell>{ahp[idx].toFixed(3)}</TableCell>
                  <TableCell>{saw[idx].toFixed(3)}</TableCell>
                  <TableCell>{topsis[idx].toFixed(3)}</TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      fontWeight:
                        Math.max(...nilaiAkhir) === nilaiAkhir[idx] && 600,
                      background:
                        Math.max(...nilaiAkhir) === nilaiAkhir[idx] &&
                        "#E9E9E9",
                    }}
                  >
                    {nilaiAkhir[idx].toFixed(3)}
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

export default Perbandingan;
