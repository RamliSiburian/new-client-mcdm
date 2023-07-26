import { createSlice } from "@reduxjs/toolkit";

export const updateAlternatifState = createSlice({
  name: "updateAlternatif",
  initialState: {
    kode: "",
    namaAlternatif: "",
  },
  reducers: {
    loadDataAlternatif: (state, action) => {
      const { namaAlternatif, kode } = action.payload;
      state.kode = kode;
      state.namaAlternatif = namaAlternatif;
    },
    changeNameAlternatif: (state, action) => {
      state.namaAlternatif = action.payload;
    },
  },
});

export const { loadDataAlternatif, changeNameAlternatif } =
  updateAlternatifState.actions;

export const getAllDataEditAlternatif = (state) => state.updateAlternatif;

export default updateAlternatifState.reducer;
