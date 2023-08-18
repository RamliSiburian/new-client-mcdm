import { API } from "./API";

export const getDataPerbandinganAhp = () => API.get("perbandinganAhp");
export const createPerbandinganAhp = (params) =>
  API.post("perbandinganAhp", params);
// export const getCodes = () => API.post("kriteria/lastCode");
// export const deleteKriteria = (kode) => API.delete(`kriteria/delete/${kode}`);
export const updateDataPerbandinganAhp = (kode, params) =>
  API.patch(`perbandinganAhp/edit/${kode}`, params);
