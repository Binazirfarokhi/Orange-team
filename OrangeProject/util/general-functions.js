import { get, post } from "../contexts/api";
import { POSITION_L1 } from "./constants";

import * as ImagePicker from "expo-image-picker";
export const bindOrgAndPosition = (orgs, positions) => {
  if (!orgs || orgs === null) return [];
  return Object.fromEntries(
    orgs.map((org, index) => [org, positions[index] || POSITION_L1])
  );
};

export const separateOrgAndPost = (orgAndPos) => {
  return [Object.keys(orgAndPos), Object.values(orgAndPos)];
};

export const getImageUrlWithName = async (id) => {
  let image = "FAILED";
  try {
    const data = await get(`/photos/${id}`);
    if (data.data.status === "OK") image = data.data.data[0];
  } catch (error) {}
  return image;
};

export const getImageUrl = async (id) => {
  let image = "FAILED";
  try {
    const data = await get(`/photos/user/${id}`);
    if (data.data.status === "OK") image = data.data.data[0];
  } catch (error) {}
  return image;
};

export const uploadImage = async (type, id, multi, handleLoading) => {
  if (handleLoading) handleLoading(true);
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: !multi,
    aspect: [4, 3],
    quality: 1,
    base64: true,
    selectionLimit: 5,
    allowsMultipleSelection: multi,
  });

  if (!result.canceled) {
    if (multi) {
      return Promise.all(
        result.assets.map(async (asset) => {
          const extension = asset.uri.substring(asset.uri.lastIndexOf("."));
          const image64 = asset.base64;
          const imgResult = await post(
            `/photos/64/${id}/${type}/${extension}`,
            { image64 }
          );
          return imgResult.data.url;
        })
      );
    } else {
      const extension = result.assets[0].uri.substring(
        result.assets[0].uri.lastIndexOf(".")
      );
      const image64 = result.assets[0].base64;
      const imgResult = await post(`/photos/64/${id}/${type}/${extension}`, {
        image64,
      });
      return imgResult.data.url;
    }
  } else return "FAILED";
};
