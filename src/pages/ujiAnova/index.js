import {
  Box,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomInput from "../../components/common/atoms/CustomInput";
import CustomButton from "../../components/common/atoms/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { getAllDataAHP } from "../../store/ahp";
import { getAllDataMopa, getDataMopa } from "../../store/mopa";
import { getDataTopsis } from "../../store/topsis";
import { getDataSaw } from "../../store/saw";
import { changeDataAnova } from "../../store/anova";

// const dataUji = [
//   0.843267898, 0.8197365750000001, 0.608251303, 0.8207482024999999,
//   0.7758069300000001, 0.8821112425, 0.6178887875000001, 0.917665698, 0.63557285,
//   0.574572203, 0.60265471, 0.576847795, 0.8455434900000001, 0.748485383,
//   0.8255838355, 0.847929138, 0.8422562705000001, 0.866877165,
// ];

const UjiAnova = () => {
  const dispatch = useDispatch();
  const [devider, setDevider] = useState("");
  const [isDisableProses, setIsDisalbleProses] = useState(false);

  const [dataDevided, setDataDevided] = useState([]);

  const [anova, setAnova] = useState("");
  const ahp = useSelector(getAllDataAHP);
  const mopa = useSelector(getDataMopa);
  const topsis = useSelector(getDataTopsis);
  const saw = useSelector(getDataSaw);
  const [datas, setDatas] = useState([]);
  const [dataFix, setDataFix] = useState(null);

  useEffect(() => {
    const tempData = [
      { name: "ahp", data: ahp },
      { name: "mopa", data: mopa },
      { name: "topsis", data: topsis },
      { name: "saw", data: saw },
    ];

    setDatas(tempData);
  }, [ahp, mopa, topsis, saw]);

  useEffect(() => {
    const dividedData = Array.from({ length: devider }, (_, index) => ({
      [`data${index + 1}`]: "",
    }));

    setDataDevided(dividedData);
  }, [devider]);

  useEffect(() => {
    if (devider === "") {
      setIsDisalbleProses(true);
    } else {
      setIsDisalbleProses(false);
    }
  }, [devider]);

  const handleChange = (event, idx) => {
    const newData = [...dataDevided];
    newData[idx][`data${idx + 1}`] = Number(event.target.value);
    setDataDevided(newData);
  };

  const handleProses = () => {
    let startIndex = 0;
    const datas = dataDevided.map((item) => {
      const sliceEnd = Object.values(item)[0];
      const slicedData = dataFix?.data?.slice(
        startIndex,
        startIndex + sliceEnd
      );
      startIndex += sliceEnd;
      return slicedData;
    });

    const averages = datas.map(
      (data, idx) => data.reduce((acc, num) => acc + num, 0) / data.length
    );

    const totalAverages =
      averages.reduce((acc, num) => acc + num, 0) / averages.length;

    const variants = datas.map((data, idx) =>
      data.map((item, index) => Math.pow(item - averages[idx], 2))
    );

    const totalVariants = variants.map(
      (data, idx) => data.reduce((acc, num) => acc + num, 0) / (data.length - 1)
    );
    const swa =
      totalVariants.reduce((acc, num) => acc + num, 0) / totalVariants.length;

    const ssb = datas.map(
      (data, idx) => data.length * Math.pow(averages[idx] - totalAverages, 2)
    );

    const totalSsb = ssb.reduce((acc, num) => acc + num, 0) / (ssb.length - 1);

    const f = totalSsb / swa;

    setAnova(f);
    dispatch(changeDataAnova({ name: dataFix?.name, data: f }));
  };
  return (
    <Box>
      <Grid container columns={12} spacing={2}>
        <Grid item xs={12}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "20px" }}>
              Uji Anova
            </Typography>
            <Divider />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography sx={{ fontSize: "14px", mb: 1 }}>
            Silahkan pilih data yang ingin di uji
          </Typography>
          <FormControl fullWidth variant="filled">
            <InputLabel id="demo-simple-select-filled-label">
              Data Uji
            </InputLabel>
            <Select
              fullWidth
              value={dataFix}
              onChange={(e) => setDataFix(e.target.value)}
            >
              {datas?.map(
                (item, idx) =>
                  item?.data.length !== 0 && (
                    <MenuItem value={item}>{item?.name}</MenuItem>
                  )
              )}
              {/* <MenuItem value={"Benefit"}>Benefit</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>

        {dataFix !== null && (
          <Grid item xs={12}>
            <CustomInput
              type="number"
              value={devider}
              // error={isErrorName}
              setValue={setDevider}
              label="Pembagi "
            />
          </Grid>
        )}

        {dataDevided?.map((item, idx) => (
          <Grid item xs={6}>
            <TextField
              type="number"
              value={item[`data${idx + 1}`]}
              variant="filled"
              onChange={(event) => handleChange(event, idx)}
              label={`Jumlah  kelompok ${idx + 1}`}
            />
          </Grid>
        ))}

        <Grid item xs={12}>
          <CustomButton
            isButtonDisabled={isDisableProses}
            title="Proses"
            color="primary"
            sx={{ fontSize: "14px", background: "#B11312", cursor: "pointer" }}
            handleButton={handleProses}
          />
        </Grid>
        {anova !== "" && (
          <Grid item={12}>
            <Box>
              <Typography sx={{ fontWeightL: 600 }}>F = {anova}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default UjiAnova;
