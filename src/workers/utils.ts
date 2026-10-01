export const compileWithWorker = async (data: {
  contractFileName?: string;
  content: string;
}) => {
  return new Promise<string>((resolve, reject) => {
    const worker = new Worker("./SolcJs.worker.ts", {
      type: "module",
    });
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new Error("Solidity compiler worker timed out"));
    }, 60000);

    worker.onmessage = function (event: any) {
      window.clearTimeout(timeout);
      worker.terminate();
      if (event.data?.type === "error") {
        reject(new Error(event.data.error));
        return;
      }
      resolve(event.data.result);
    };
    worker.onerror = (error) => {
      window.clearTimeout(timeout);
      worker.terminate();
      reject(error);
    };
    worker.postMessage(data);
  });
};
