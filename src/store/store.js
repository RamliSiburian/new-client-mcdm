import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth";
import dataKriteria from "./kriteria/KriteriaDatas";
import UpdateKriteria from "./kriteria/UpdateKriteria";
import dataAlternatif from "./alternatif/AlternatifData";
import UpdateAlternatif from "./alternatif/UpdateAlternatif";

export default configureStore({
  reducer: {
    auth: auth,

    // --------------- kriteria -----------------
    dataKriteria: dataKriteria,
    updateKriteria: UpdateKriteria,

    //  -------------- Alternatif ---------------
    dataAlternatif: dataAlternatif,
    updateAlternatif: UpdateAlternatif,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
