import { API } from "./API";

export const getDataAlternatif = () => API.get("alternatif");
export const getCodes = () => API.post("alternatif/lastCode");
export const createAlternatif = (params) => API.post("alternatif", params);
export const deleteAlternatif = (kode) =>
  API.delete(`alternatif/delete/${kode}`);
export const updateAlternatif = (kode, params) =>
  API.patch(`alternatif/edit/${kode}`, params);
