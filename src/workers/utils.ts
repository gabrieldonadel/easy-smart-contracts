export const compileWithWorker = async (data: {
  contractFileName?: string;
  content: string;
}) => {
  return new Promise<string>((resolve, reject) => {
    const worker = new Worker("./SolcJs.worker.ts", {
      type: "module",
    });
    worker.postMessage(data);
    worker.onmessage = function (event: any) {
      worker.terminate();
      resolve(event.data);
    };
    worker.onerror = (error) => {
      worker.terminate();
      reject(error);
    };
  });
};
