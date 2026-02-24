import Checkbox from '@mui/material/Checkbox';
import { IoBagHandleOutline } from "react-icons/io5";
import { IoBagHandle } from "react-icons/io5";

export default function IconCheckboxes({ checked, onChange }) {
  return (
    <Checkbox 
      checked={checked}
      onChange={onChange}
      icon={<IoBagHandleOutline style={{ color: '#777676', width: '24px', height: '24px' }} />} 
      checkedIcon={<IoBagHandle style={{ color: '#056839', width: '24px', height: '24px' }} />}
      sx={{
        '&.Mui-checked': {
          color: '#056839',
        },
      }}
    />
  );
}
