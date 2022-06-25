export const readFileAsText = (file: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function ({ target: { result } }) {
      resolve(result as string);
    };
    reader.onerror = function () {
      reject("error reading file");
    };
  });
};
