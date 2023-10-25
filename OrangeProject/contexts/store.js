import * as SecureStore from 'expo-secure-store';

async function savePersistData(key, value) {
    SecureStore.setItemAsync(key, JSON.stringify(value));
}

async function removePersistData(key) {
    SecureStore.deleteItemAsync(key);
}
  
async function getPersistData(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return JSON.parse(result);
    } else {
        throw 'Unable to find user info';
    }
}

export {
    savePersistData,
    getPersistData,
    removePersistData
}