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
      resolve(event.data);
    };
    worker.onerror = reject;
  });
};
