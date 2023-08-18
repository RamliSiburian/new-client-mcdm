import { API } from "./API";

export const getDataPerbandinganMopa = () => API.get("perbandinganMopa");
export const createPerbandinganMopa = (params) =>
  API.post("perbandinganMopa", params);
// export const getCodes = () => API.post("kriteria/lastCode");
// export const deleteKriteria = (kode) => API.delete(`kriteria/delete/${kode}`);
export const updateDataPerbandinganMopa = (kode, params) =>
  API.patch(`perbandinganMopa/edit/${kode}`, params);
