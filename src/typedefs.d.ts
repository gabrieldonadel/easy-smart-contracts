declare module "solc/wrapper";
declare module "solc";
declare module "*.sol" {
  const value: string;
  export default value;
}
