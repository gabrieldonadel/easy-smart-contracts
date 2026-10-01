declare module "solc/wrapper";
declare module "solc";
declare module "file-loader!*" {
  const url: string;
  export default url;
}
declare module "*.sol" {
  const value: string;
  export default value;
}
