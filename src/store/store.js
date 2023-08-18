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
import perbandinganAhp from "./perbandinganAhp/perbandinganAhp";
import updateNilaiPerbandinganAhp from "./perbandinganAhp/updatePerbandinganAhp";
import perbandinganMopa from "./perbandinganMopa/perbandinganMopa";
import updateNilaiPerbandinganMopa from "./perbandinganMopa/updatePerbandinganMopa";

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

    // --------------- Perbandingan AHP -----------------

    perbandinganAhp: perbandinganAhp,
    updateNilaiPerbandinganAhp: updateNilaiPerbandinganAhp,

    // --------------- Perbandingan AHP -----------------
    perbandinganMopa: perbandinganMopa,
    updateNilaiPerbandinganMopa: updateNilaiPerbandinganMopa,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
