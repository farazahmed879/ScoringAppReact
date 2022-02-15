import { L } from "../../lib/abpUtility";


const playersValidation = {
  name: [{ required: true, message: L('ThisFieldIsRequired') }],
  displayName: [{ required: true, message: L('ThisFieldIsRequired') }]
};

export default playersValidation;
