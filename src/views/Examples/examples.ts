export const conterExampleContract = {
  name: "Exemplo de Contrato - Contador",
  xml: '<xml xmlns="https://developers.google.com/blockly/xml"><block type="contract" id=")m#hx*mq}ZP0|S)a2*Mz" x="290" y="70"><field name="NAME">Contador</field><statement name="STATES"><block type="contract_state" id="R-G08~Ssrh[_Q_D%3@FF"><field name="TYPE">TYPE_INT</field><field name="NAME">contador</field></block></statement><statement name="METHODS"><block type="contract_method" id=":BJ*z;Ci}CDJ~0bvklEP"><field name="NAME">incrementar</field><statement name="STACK"><block type="contract_state_set" id=":#DGT:WL|y3feL!s8@e:"><field name="STATE_NAME">R-G08~Ssrh[_Q_D%3@FF</field><value name="STATE_VALUE"><block type="math_arithmetic" id="FK1!N/.8H%]iD|WwR[U-"><field name="OP">ADD</field><value name="A"><block type="contract_state_get" id="f^bj{-;zBb^D;?{knoUP"><field name="STATE_NAME">R-G08~Ssrh[_Q_D%3@FF</field></block></value><value name="B"><block type="math_number" id="u0(mzkHD,fx0`taf#wJ3"><field name="NUM">1</field></block></value></block></value></block></statement><next><block type="contract_method" id="l:V[~K|V2b/0?~A|T;72"><field name="NAME">decrementar</field><statement name="STACK"><block type="contract_state_set" id="EETO:?[[kNDV3.gR/Yzh"><field name="STATE_NAME">R-G08~Ssrh[_Q_D%3@FF</field><value name="STATE_VALUE"><block type="math_arithmetic" id="x$BmV^P8N|^?#?i-95hm"><field name="OP">MINUS</field><value name="A"><block type="contract_state_get" id="lB.%!wI1czofM$cPR$ih"><field name="STATE_NAME">R-G08~Ssrh[_Q_D%3@FF</field></block></value><value name="B"><block type="math_number" id="|,jyA1nXY!;7/bis^,q!"><field name="NUM">1</field></block></value></block></value></block></statement></block></next></block></statement></block></xml>',
};