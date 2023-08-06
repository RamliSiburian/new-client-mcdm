import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import dataKriteria from "./kriteria/KriteriaDatas";
import UpdateKriteria from "./kriteria/UpdateKriteria";
import dataAlternatif from "./alternatif/AlternatifData";
import UpdateAlternatif from "./alternatif/UpdateAlternatif";
import ahp from "./ahp";
import mopa from "./mopa";
import topsis from "./topsis";
import saw from "./saw";

export default configureStore({
  reducer: {
    auth: auth,

    // --------------- kriteria -----------------
    dataKriteria: dataKriteria,
    updateKriteria: UpdateKriteria,

    //  -------------- Alternatif ---------------
    dataAlternatif: dataAlternatif,
    updateAlternatif: UpdateAlternatif,

    //  -------------- AHP -------------------
    ahp: ahp,

    // --------------- MOPA -----------------
    mopa: mopa,

    // --------------- Topsis -----------------
    topsis: topsis,

    // --------------- SAW -----------------
    saw: saw,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
